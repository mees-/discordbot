const debug = require('debug')('bot:music:bindnickname')

module.exports = function bindMusicToNickName(guild, manager) {
  const ownGuildMember = guild.members.find('id', guild.client.user.id)
  const originalNickName = process.env.BOT_NICK || ownGuildMember.nickname

  manager.on('start', (song) => {
    ownGuildMember.setNickname(`- ${ song.shortTitle }`)
    .catch((e) => {
      debug('error when setting nickname', e)
    })
  })

  manager.on('song end', () => {
    ownGuildMember.setNickname(originalNickName)
      .catch((e) => {
        debug('error when setting nickname', e)
      })
  })
}
