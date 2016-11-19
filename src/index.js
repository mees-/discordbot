const Excord = require('excord')
const musicRouter = require('./musicRouter')
const debug = require('debug')('bot:index')
const webApp = require('./web/createApp')

const options = {
  prefix: process.env.BOT_PREFIX || '/',
  token: process.env.BOT_TOKEN,
  channelIds: process.env.BOT_CHANNEL,
  webPort: process.env.BOT_WEB_PORT || 8080
}
try {
  options.channelIds = options.channelIds.split(',')
} catch (e) {
  delete options.channelIds
}
// init discord app
const app = new Excord()

// init web app
const server = webApp(app)

// start server when app is ready
app.on('ready', () => {
  server.listen(options.webPort)
})

// filter based on channel
app.use((req, res, next) => {
  if (!options.channelIds) {
    debug('No channelIds')
    return next()
  }
  if (options.channelIds.includes(req.channel.id)) {
    next()
  }
  // if it isn't in the right channel, don't call next and cancel the chain
})

// filter based on prefix
app.use((req, res, next) => {
  if (req.route.startsWith(options.prefix)) {
    next(req.route.slice(options.prefix.length)) // remove the prefix from the route
  }
  // if it doesn't start with the prefix don't call next and cancel the chain
})

// register routers
app.use(musicRouter)

app.login(options.token)
