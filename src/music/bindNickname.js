const debug = require('debug')('bot:music:bindnickname')

module.exports = function bindMusicToNickName(guild, manager) {
  const ownGuildMember = guild.members.find('id', guild.client.user.id)
  const originalNickName = process.env.BOT_NICK || ownGuildMember.nickname

  let timeout = true
  manager.on('start', (song) => {
    debugger
    if (timeout) {
      timeout = false
    }
    ownGuildMember.setNickname(`- ${ song.shortTitle }`)
    .catch((e) => {
      debug('error when setting nickname', e)
    })
  })

  manager.on('song end', () => {
    timeout = setTimeout(() => {
      if (timeout) {
        ownGuildMember.setNickname(originalNickName)
          .catch((e) => {
            debug('error when setting nickname', e)
          })
      } else {
        timeout = true
      }
    }, 1000)
  })
}
