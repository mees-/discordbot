const { noPlaylistId, startPlaylist, endPlSongsError, endPlSongsSuccess } = require('../../messages')
const Song = require('../../music/Song')
const ytpl = require('../../music/ytpl')
const log = require('debug')('bot:command:playlist')
const testVoice = require('../../music/testVoice')
const PQueue = require('p-queue')

module.exports = {
  name: 'playlist :listUrl',
  usage: 'playlist <playlist url>',

  async run(req, res) {
    const API_KEY = process.env.BOT_YT_API || ''
    if (!testVoice(req)) return
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

    const plSongs = await ytpl(pid, API_KEY)
    const queue = new PQueue({ concurrency: 2 })
    let errors = 0

    async function getAndAddSong(url) {
      try {
        const info = await Song.getInfo(url)
        const song = new Song(url, info, req.author, req.channel)
        req.guild.voiceConnection.musicManager.addSong(song)
      } catch (e) {
        errors++
        log(`An error occured when getting songinfo, song url: ${ url }`)
        log('error:', e)
      }
    }

    for (const plSong of plSongs) {
      const url = `https://www.youtube.com/watch?v=${ plSong.contentDetails.videoId }`
      queue.add(getAndAddSong.bind(null, url))
    }
    queue.onEmpty(() => {
      log('done with playlist')
      if (errors === 0) {
        req.end(endPlSongsSuccess())
      } else {
        req.end(endPlSongsError(errors))
      }
    })
  }
}
