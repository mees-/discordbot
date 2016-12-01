const ytdl = require('ytdl-core')
const randomID = require('crypto-random-string')
const log = require('debug')('bot:Song')

module.exports = class Song {
  constructor(url, info) {
    log(`created ${ info.title }`)
    this.url = url
    this.title = info.title
    this.lengthSecconds = info.length_seconds
    this.id = randomID(20)
  }

  formatLength() {
    return `${ Math.floor(this.lengthSeconds / 60) }:${ this.lengthSeconds % 60 }`
  }

  getStream() {
    log('created stream')
    const stream = ytdl(this.url, { format: 'audioonly' })

    return stream
  }

  get shortTitle() {
    let title = this.title
    const split = this.title.split('-')
    if (split[1]) {
      title = split[1]
    }
    if (title.length > 26) {
      title = title.slice(0, 26)
      title += '...'
    }
    return title
  }
  //  export with Song and wrap in promise
  static getInfo() {
    return new Promise((resolve, reject) => {
      ytdl.getInfo(...arguments, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}
