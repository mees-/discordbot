/* eslint global-require: off */
const { Router } = require('excord')
// require all the commands
const commands = [
  require('./commands/add'),
  require('./commands/clear'),
  require('./commands/join'),
  require('./commands/pause'),
  require('./commands/playlist'),
  require('./commands/queue'),
  require('./commands/restart'),
  require('./commands/resume'),
  require('./commands/skip'),
  require('./commands/start'),
  require('./commands/volume')
]

// create router
const router = module.exports = new Router()

// create paths for all the commands
for (const command of commands) {
  router.hit(command.name, command.run)
}
