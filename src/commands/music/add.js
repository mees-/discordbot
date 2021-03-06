const Song = require('../../music/Song')
const log = require('debug')('bot:command:add')
const { addedSong, errorAddedSong } = require('../../messages')
const testVoice = require('../../music/testVoice')

// for easter egg
const ytdl = require('ytdl-core')

module.exports = {
  name: 'add :url',
  usage: 'add <song url> [index in queue]',

  run(req, res) {
    if (!testVoice(req)) return
    return Song.getInfo(req.params.get('url'))
      .then((info) => {
        const manager = req.guild.voiceConnection.musicManager
        const song = new Song(req.params.get('url'), info, req.author, req.channel)
        if (Math.random() <= 0.05) {
          // easter egg, 5% chance to add rick astley - Never Gonna Give You Up
          song.getStream = () => {
            log('\n\nGET TROLLED\n\n')
            return ytdl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', { format: 'audioonly' })
          }
        }
        manager.addSong(song)
        res.send(addedSong(song.title))
      })
      .catch((err) => {
        log(err)
        res.send(errorAddedSong())
      })
  }
}
