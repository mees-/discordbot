const testVoice = require('../../music/testVoice')

module.exports = {
  name: 'restart',
  usage: 'restart',

  run(req) {
    if (!testVoice(req)) return
    const manager = req.guild.voiceConnection.musicManager
    manager.forceStop()
    manager.start()
  }
}
