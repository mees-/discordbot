const Excord = require('excord')
const musicRouter = require('./musicRouter')

const options = {
  prefix: process.env.BOT_PREFIX || '/',
  token: process.env.BOT_TOKEN,
  channelId: process.env.BOT_CHANNEL
}

// init app
const app = new Excord()

// filter based on channel
app.use((req, res, next) => {
  if (!options.channelId) return next()
  if (req.channel.id === options.channelId) {
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
