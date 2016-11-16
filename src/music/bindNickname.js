module.exports = function bindMusicToNickName(guild, manager) {
  const ownGuildMember = guild.members.find('id', guild.client.user.id)
  const originalNickName = ownGuildMember.nickname
  manager.on('start', (song) => {
    ownGuildMember.setNickname(`- ${ song.title }`)
  })
  manager.on('song end', () => {
    ownGuildMember.setNickname(originalNickName)
    .catch((e) => {
      console.log(e)
    })
  })
}
