const { changeVolume, tooHighVolume, tooLowVolume } = require('../../messages')
const testVoice = require('../../music/testVoice')
const log = require('debug')('corldlr-music:command:volume')

module.exports = {
  name: 'volume :vol',
  usage: 'volume <percentage>',

  run(req, res) {
    if (!testVoice(req)) return
    const newVolume = req.params.get('vol') / 100
    if (newVolume < 0) {
      return res.send(tooLowVolume())
    }
    if (newVolume >= 3) {
      log('Not allowing volumes over 300, people hate it.')
      return res.send(tooHighVolume())
    }
    const manager = req.guild.voiceConnection.musicManager
    const oldVolume = manager.volume
    log(`setting volume to ${ newVolume * 100 }%`)
    manager.volume = newVolume
    res.send(changeVolume(oldVolume > newVolume))
  }
}
