const MusicManager = require('../../music/musicManager')
const log = require('debug')('bot:command:join')
const { userNotInVoice, joinedSucces, joinedFail } = require('../../messages')
const bindNickname = require('../../music/bindNickname')

module.exports = {
  name: 'join',
  usage: 'join <channel name> (if none is specified, join person who issued command)',

  run(req, res) {
    const voiceChannel = req.member.voiceChannel
    if (!voiceChannel) {
      return res.send(userNotInVoice())
    }
    log(`joining ${ voiceChannel.guild.name }:${ voiceChannel.name }`)
    return voiceChannel.join()
      .then((connection) => {
        // attach MusicManager
        connection.musicManager = new MusicManager(connection)
        // bind nickname to musicManager
        bindNickname(req.guild, connection.musicManager)
        res.send(joinedSucces())
      })
      .catch((e) => {
        log('an error occured when joining a channel', e)
        res.send(joinedFail())
      })
  }
}
