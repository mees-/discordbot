const testVoice = require('../../music/testVoice')
const { left } = require('../../messages')
module.exports = {
  name: 'leave',
  usage: 'leave',

  run(req, res) {
    if (!testVoice(req)) return
    req.guild.voiceConnection.musicManager.kill()
    delete req.guild.voiceConnection.musicManager
    req.guild.voiceConnection.disconnect()
    res.end(left())
  }
}
