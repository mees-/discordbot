const testVoice = require('../music/testVoice')
const { clearedQueue } = require('../messages')

module.exports = {
  name: 'clear',
  usage: 'clear',

  run(req, res) {
    if (!testVoice(req)) return
    const manager = req.guild.voiceConnection.musicManager
    manager.queue.splice(1)
    res.end(clearedQueue())
  }
}
