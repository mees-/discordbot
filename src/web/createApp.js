const debug = require('debug')('bot:web')
const express = require('express')
const bodyParser = require('body-parser')
const Song = require('../music/Song')

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
  server.use(bodyParser.json())

  server.get('/', (req, res) => {
    res.json({ hello: 'world' })
  })

  server.get('/:guildID/info', (req, res) => {
    const guild = bot.guilds.find('id', req.params.guildID)
    if (!guild) {
      return res.status(404).json({ message: `A guild with guildID ${ req.params.guildID } was not found` })
    }

    const resp = Object.assign({}, guild, {
      queue: guild.voiceConnection.musicManager.queue,
      history: guild.voiceConnection.musicManager.history,
      options: Object.assign({}, guild.voiceConnection.musicManager.options, { textChannel: undefined })
    })

    res.json(resp)
  })

  server.post('/:guildID/song', (req, res) => {
    const guild = bot.guilds.find('id', req.params.guildID)
    if (!guild) {
      return res.status(404).json({ message: `A guild with guildID ${ req.params.guildID } was not found` })
    }

    if (!guild.voiceConnection || !guild.voiceConnection.musicManager) {
      return res.status(404).json({ message: 'The guild does not have a proper voiceConnection' })
    }

    // get info
    (async () => {
      const info = await Song.getInfo(req.body.url)
      const song = new Song(req.body.url, info)
      return song
    })()
      .then((song) => {
        guild.voiceConnection.musicManager.addSong(song)
        res.status(200).json({ message: 'Added song succesfully' })
      })
      .catch((e) => {
        debug('error:', e)
        res.status(424).json({
          message: 'Could not get info from youtube',
          error: e
        })
      })
  })

  server.post('/:guildID/skip', (req, res) => {
    const guild = bot.guilds.find('id', req.params.guildID)
    if (!guild) {
      return res.status(404).json({ message: `A guild with guildID ${ req.params.guildID } was not found` })
    }

    if (!guild.voiceConnection || !guild.voiceConnection.musicManager) {
      return res.status(404).json({ message: 'The guild does not have a proper voiceConnection' })
    }

    guild.voiceConnection.musicManager.next(req.body.amount || 1)
    guild.voiceConnection.musicManager.start()

    res.status(200).json({ message: `skipped ${ req.body.amount || 1 } times` })
  })

  server.post('/:guildID/remove', (req, res) => {
    const guild = bot.guilds.find('id', req.params.guildID)
    if (!guild) {
      return res.status(404).json({ message: `A guild with guildID ${ req.params.guildID } was not found` })
    }

    if (!guild.voiceConnection || !guild.voiceConnection.musicManager) {
      return res.status(404).json({ message: 'The guild does not have a proper voiceConnection' })
    }

    try {
      const removedSong = guild.voiceConnection.musicManager.remove(req.body.id)
      res.json({ removedSong })
    } catch (e) {
      res.status(404).json({ message: `A song with id: ${ req.body.id } could not be found` })
    }
  })

  return server
}
