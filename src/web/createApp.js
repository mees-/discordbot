const debug = require('debug')('bot:web')
const express = require('express')
const bodyParser = require('body-parser')
const Song = require('../music/Song')

module.exports = function createServer(bot) {
  debug('creating webserver')
  const app = express()

  // logger
  app.use('/', (req, res, next) => {
    debug('request', req.url)
    next()
  })

  // view engine
  app.set('views', './src/web')
  app.set('view engine', 'pug')
  app.use(bodyParser.json())

  app.get('/api', (req, res) => {
    // respond with a list of guildIds
    res.json({ guilds: Array.from(bot.guilds.keys()) })
  })

  app.get('/api/:guildID', (req, res) => {
    const guild = bot.guilds.find('id', req.params.guildID)
    if (!guild) {
      return res.status(404).json({ message: `A guild with guildID ${ req.params.guildID } was not found` })
    }
    if (!guild.voiceConnection || !guild.voiceConnection.musicManager) {
      debug('no voice/musicManager')
      return res.status(404).json({ message: 'The guild doesn\'t have a working voiceConnection' })
    }

    const resp = Object.assign({}, guild, {
      queue: guild.voiceConnection.musicManager.queue,
      history: guild.voiceConnection.musicManager.history,
      options: Object.assign({}, guild.voiceConnection.musicManager.options, { textChannel: undefined })
    })

    res.json(resp)
  })

  app.post('/api/:guildID/song', (req, res) => {
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

  app.delete('/api/:guildId/remove/:songId', (req, res) => {
    const guild = bot.guilds.find('id', req.params.guildID)
    if (!guild) {
      return res.status(404).json({ message: `A guild with guildId ${ req.params.guildId } was not found` })
    }

    if (!guild.voiceConnection || !guild.voiceConnection.musicManager) {
      return res.status(404).json({ message: 'The guild does not have a proper voiceConnection' })
    }

    try {
      const removedSong = guild.voiceConnection.musicManager.remove(req.params.songId)
      res.json({ removedSong })
    } catch (e) {
      res.status(404).json({ message: `A song with id: ${ req.body.id } could not be found`, error: e.message })
    }
  })

  return app
}
