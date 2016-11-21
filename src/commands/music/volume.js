const { changeVolume, tooHighVolume } = require('../../messages')
const testVoice = require('../../music/testVoice')
const log = require('debug')('corldlr-music:command:volume')

module.exports = {
  name: 'volume :percent',
  usage: 'volume <percentage> [method](log | db | scale)',

  run(req, res) {
    if (!testVoice(req)) return
    if (req.params.get('percent') >= 300) {
      log('Not allowing volumes over 300, people hate it.')
      return res.end(tooHighVolume())
    }
    const manager = req.guild.voiceConnection.musicManager
    const oldVolume = manager.volume
    const newVolume = req.params.get('percent') / 100
    log(`setting volume to ${ newVolume }% with setting 'log'`)
    manager.volume = newVolume
    res.end(changeVolume(oldVolume < newVolume))
  }
}
