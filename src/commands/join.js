const MusicManager = require('../music/musicManager')
const log = require('debug')('bot:command:join')
const { userNotInVoice } = require('../messages')

module.exports = {
  name: 'join',
  usage: 'join <channel name> (if none is specified, join person who issued command)',

  run(req, res) {
    const voiceChannel = req.member.voiceChannel
    if (!voiceChannel) {
      return res.end(userNotInVoice())
    }
    log(`joining ${ voiceChannel.guild.name }:${ voiceChannel.name }`)
    return voiceChannel.join()
      .then((connection) => {
        // attach MusicManager
        connection.musicManager = new MusicManager(connection)
      })
  }
}
