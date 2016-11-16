const { noPlaylistId, startPlaylist, endPlSongsError, endPlSongsSuccess } = require('../../messages')
const Song = require('../../music/Song')
const ytpl = require('../../music/ytpl')
const log = require('debug')('bot:command:playlist')
const testVoice = require('../../music/testVoice')
const PQueue = require('p-queue')

module.exports = {
  name: 'playlist :listUrl',
  usage: 'playlist <playlist url>',

  run(req, res) {
    if (!testVoice(req)) return
    log('running')
    const API_KEY = process.env.BOT_YT_API
    // gather req info
    const pidReg = /.+list=(.+)&?/
    // leave it as the entire result of the match to test for match | null
    const matched = req.params.get('listUrl').match(pidReg)
    if (!matched) {
      return res.end(noPlaylistId())
    }
    const pid = matched[1]
    if (!pid) {
      return res.end(noPlaylistId())
    }
    res.end(startPlaylist())
    ;(async () => {
      const plSongs = await ytpl(pid, API_KEY)
      const todos = []
      let errors = 0
      for (const plSong of plSongs) {
        todos.push(async () => {
          const url = `https://www.youtube.com/watch?v=${ plSong.contentDetails.videoId }`
          const info = await Song.getInfo(url)
          const song = new Song(url, info, req.author, req.channel)
          return song
        })
      }
      // immediately get the first song and have the rest load lazily
      todos.shift()().then()
      const queue = new PQueue({ concurrency: 6 })
      for (const todo of todos) {
        queue.add(() => todo().then((song) => {
          req.guild.voiceConnection.musicManager.addSong(song)
        })
        .catch((e) => {
          log('an error occured when getting a song', e)
          errors++
        }))
      }
      queue.onEmpty().then(() => {
        if (errors === 0) {
          res.end(endPlSongsSuccess())
        } else {
          res.end(endPlSongsError(errors))
        }
      })
    })()

  }
}
