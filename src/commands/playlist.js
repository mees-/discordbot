const { noPlaylistId, startPlaylist, errorPlSong } = require('../messages')
const Song = require('../music/Song')
const ytpl = require('../music/ytpl')
const log = require('debug')('bot:command:playlist')
const testVoice = require('../music/testVoice')

module.exports = {
  name: 'playlist :listUrl',
  usage: 'playlist <playlist url>',

  run(req, res) {
    const API_KEY = 'AIzaSyBUCT0piaZuI6W6dCvXt4LdWoQ4vMmCwZY'
    if (!testVoice(req)) return
    const pidReg = /.+list=(.+)&?/
    const pid = req.params.get('listUrl').match(pidReg)[1]
    if (!pid) {
      return res.end(noPlaylistId())
    }
    res.end(startPlaylist())
    const songStream = ytpl(pid, API_KEY)

    const todo = []
    let index = 0
    let running = false
    let interval
    songStream.on('data', (data) => {
      todo.push(data)
      if (!running) {
        running = true
        interval = setInterval(() => {
          if (!todo[index]) return clearInterval(interval)
          const url = `https://www.youtube.com/watch?v=${ todo[index].contentDetails.videoId }`
          Song.getInfo(url)
            .then((info) => {
              const song = new Song(url, info, req.author, req.channel)
              req.guild.voiceConnection.musicManager.addSong(song)
            })
            .catch((e) => {
              log('an error occured while getting a playlist song', e)
              res.end(errorPlSong())
            })
          index++
        }, 30)
      }
    })
    songStream.on('error', e => log('error during playlist request', e))
  }
}

// `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`
