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
  bot.on('newMusicManager', (connection) => {
    const channelName = connection.channel.guild.id
    const manager = connection.musicManager
    if (!manager) {
      debug('Found connection without manager')
      return
    }
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
  })

  return pusher
}
