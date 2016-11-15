const { resumed } = require('../../messages')
const testVoice = require('../../music/testVoice')
module.exports = {
  name: 'resume',
  usage: 'resume',

  run(req, res) {
    if (!testVoice(req)) return
    req.guild.voiceConnection.musicManager.resume()
    res.end(resumed())
  }
}
