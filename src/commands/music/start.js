const testVoice = require('../../music/testVoice')

module.exports = {
  name: 'start',
  usage: 'start',

  run(req) {
    if (!testVoice(req)) return
    req.guild.voiceConnection.musicManager.start()
  }
}
