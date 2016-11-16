const { noPlaylistId, startPlaylist, endPlSongsError, endPlSongsSuccess } = require('../../messages')
const Song = require('../../music/Song')
const ytpl = require('../../music/ytpl')
const log = require('debug')('bot:command:playlist')
const testVoice = require('../../music/testVoice')

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

    // start getting songs
    // ytpl(pid, API_KEY)
    //   .then((plSongs) => {
    //     const todos = []
    //     for (const song of plSongs) {
    //
    //     }
    //   })
    (async () => {
      const plSongs = await ytpl(pid, API_KEY)
      const todos = []
      let errors = 0
      for (const plSong of plSongs) {
        log(`pushing ${ todos.length }`)
        todos.push(async () => {
          const url = `https://www.youtube.com/watch?v=${ plSong.contentDetails.videoId }`
          const info = await Song.getInfo(url)
          const song = new Song(url, info, req.author, req.channel)
          return song
        })
      }
      for (const todo of todos) {
        log(`todo number: ${ todos.indexOf(todo) }`)
        try {
          const song = await todo()
          req.guild.voiceConnection.musicManager.addSong(song)
          if (todos.indexOf(todo) === todos.length - 1) {
            res.end(endPlSongsSuccess())
          }
        } catch (e) {
          log('error when getting song', e)
          errors++
          if (todos.indexOf(todo) === todos.length - 1) {
            res.end(endPlSongsError(errors))
          }
        }
      }
    })()

  }
}
