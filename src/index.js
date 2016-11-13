const Excord = require('excord')
const router = require('./routes')

const options = {
  prefix: '/',
  token: process.env.BOT_TOKEN
}

// init app
const app = new Excord()

app.use((req, res, next) => {
  if (req.route.startsWith(options.prefix)) {
    next(req.route.slice(options.prefix.length))
  }
  // if it doesn't start with the prefix don't call next and just cancel the chain
})

app.use(router)

app.login(options.token)
