const testVoice = require('../../music/testVoice')
const Song = require('../../music/Song')
const { repeated } = require('../../messages')

module.exports = {
  name: 'repeat :amount',
  usage: 'repeat <amount>',

  run(req, res) {
    if (!testVoice(req)) return
    const manager = req.guild.voiceConnection.musicManager
    const toRepeat = new Song(manager.queue[0].url, manager.queue[0], req.author)
    for (let i = 0; i < req.params.get('amount'); i++) {
      manager.addSong(toRepeat, 1)
    }
    res.send(repeated(req.params.get('amount')))
  }
}
