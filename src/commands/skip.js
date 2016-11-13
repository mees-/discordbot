const testVoice = require('../music/testVoice')
const log = require('debug')('cordlr-music:command:skip')

module.exports = {
  name: 'skip',
  usage: 'skip [amount]',

  run(req) {
    if (!testVoice(req)) return

    const manager = req.guild.voiceConnection.musicManager
    manager.next(1)
    if (manager.queue[0]) {
      manager.start()
    } else {
      log(`${ req.guild.name }:no next song, stopping`)
    }
  }
}
