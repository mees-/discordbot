const { pausedSong } = require('../../messages')
const testVoice = require('../../music/testVoice')

module.exports = {
  name: 'pause',
  usage: 'pause',

  run(req, res) {
    if (!testVoice(req)) return
    req.guild.voiceConnection.musicManager.pause()
    res.end(pausedSong())
  }
}
