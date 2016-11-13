const Song = require('../music/Song')
const log = require('debug')('cordlr-music:command:add')
const { addedSong, errorAddedSong } = require('../messages')
const testVoice = require('../music/testVoice')

module.exports = {
  name: 'add :url',
  usage: 'add <song url> [index in queue]',

  run(req, res) {
    if (!testVoice(req)) return
    return Song.getInfo(req.params.get('url'))
      .then((info) => {
        const manager = req.guild.voiceConnection.musicManager
        const song = new Song(req.params.get('url'), info, req.author, req.channel)
        manager.addSong(song)
        res.end(addedSong(song.title))
      })
      .catch((err) => {
        log(err)
        res.end(errorAddedSong())
      })
  }
}
