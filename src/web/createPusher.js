const Pusher = require('pusher')
const debug = require('debug')('bot:pusher')

module.exports = function createPusher(bot) {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: true
  })
  bot.on('voiceStateUpdate', (member) => {
    if (member.user.equals(bot.user)) {
      setTimeout(() => {
        for (const connection of bot.voiceConnections.array()) {
          const channelName = connection.channel.guild.id
          const manager = connection.musicManager
          // add
          manager.on('add', (song, idx) => {
            debug('add', song.title)
            pusher.trigger(channelName, 'add', { song, idx }, (err) => {
              if (err) debug('BIG ERROR', err)
            })
          })
          // next
          manager.on('next', (amount) => {
            debug('next', amount)
            pusher.trigger(channelName, 'next', { amount }, (err) => {
              if (err) debug('BIG ERROR', err)
            })
          })
          // remove
          manager.on('remove', (id) => {
            pusher.trigger(channelName, 'remove', { id }, (err) => {
              if (err) debug('BIG ERROR', err)
            })
          })
        }
      }, 500)
    } else {
      debug('uhhh')
    }
  })

  return pusher
}
