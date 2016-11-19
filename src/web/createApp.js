const debug = require('debug')('bot:web')
const express = require('express')

module.exports = function createServer(bot) {
  debug('creating webserver')
  const server = express()

  // logger
  server.use('/:guild', (req, res, next) => {
    debug(`request ${ req.params.guild }`)
    next()
  })

  // view engine
  server.set('views', './src/web')
  server.set('view engine', 'pug')

  server.get('/', (req, res) => {
    const guilds = []
    for (const guild of bot.guilds.array()) {
      guilds.push({ name: guild.name, id: guild.id })
    }
    res.render('guilds', { guilds })
  })

  server.get('/:guild', (req, res) => {
    // find guild
    const guild = bot.guilds.find('id', req.params.guild)
    if (!guild) return res.end('No such guild')

    // test for voice
    if (!guild.voiceConnection) return res.end('No voiceConnection')
    // find manager
    const manager = guild.voiceConnection.musicManager
    if (!manager) return res.end('No musicmanager, let the bot join through music command')

    const locals = {
      pageTitle: `dashboard - ${ guild.name }`,
      songs: manager.queue.slice(1)
    }
    if (manager.queue[0]) {
      locals.current = `Currently playing: ${ manager.queue[0].title }`
    } else {
      locals.current = 'Currently playing: nothing'
    }
    res.render('dash', locals)
  })

  return server
}
