const Excord = require('excord')
const musicRouter = require('./musicRouter')

const options = {
  prefix: '/' || process.env.BOT_PREFIX,
  token: process.env.BOT_TOKEN,
  channelId: '243026225268916224'
}

// init app
const app = new Excord()

app.use((req, res, next) => {
  if (req.channel.id === options.channelId) {
    next()
  }
  // if it isn't in the right channel, don't call next and cancel the chain
})

app.use((req, res, next) => {
  if (req.route.startsWith(options.prefix)) {
    next(req.route.slice(options.prefix.length)) // remove the prefix from the route
  }
  // if it doesn't start with the prefix don't call next and just cancel the chain
})

// register routers
app.use(musicRouter)

app.login(options.token)
