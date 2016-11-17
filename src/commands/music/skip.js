const testVoice = require('../../music/testVoice')
const log = require('debug')('bot:command:skip')

module.exports = {
  name: 'skip ?amount',
  usage: 'skip [amount]',

  run(req) {
    if (!testVoice(req)) return
    let amount = parseInt(req.params.get('amount'))
    if (isNaN(amount)) amount = 1
    const manager = req.guild.voiceConnection.musicManager
    manager.next(amount)
    if (manager.queue[0]) {
      manager.start()
    } else {
      log(`${ req.guild.name }:no next song, stopping`)
    }
  }
}
