/* eslint global-require: off */
const { Router } = require('excord')
// require all the commands
const commands = [
  require('./commands/music/add'),
  require('./commands/music/clear'),
  require('./commands/music/join'),
  require('./commands/music/pause'),
  require('./commands/music/playlist'),
  require('./commands/music/queue'),
  require('./commands/music/restart'),
  require('./commands/music/resume'),
  require('./commands/music/skip'),
  require('./commands/music/start'),
  require('./commands/music/volume')
]

// create router
const musicRouter = module.exports = new Router()

// create paths for all the commands
for (const command of commands) {
  musicRouter.hit(command.name, command.run)
}
