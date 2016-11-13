const ytdl = require('ytdl-core')
const log = require('debug')('cordlr-music:Song')

module.exports = class Song {
  constructor(url, info, addedBy, commandChannel) {
    log(`created ${ info.title }`)
    this.url = url
    this.title = info.title
    this.lengthSecconds = info.length_seconds
    this._info = info
    this.addedBy = addedBy
    this.commandChannel = commandChannel
  }

  formatLength() {
    return `${ Math.floor(this.lengthSeconds / 60) }:${ this.lengthSeconds % 60 }`
  }

  getStream() {
    log('created stream')
    const stream = ytdl.downloadFromInfo(this._info, { format: 'audioonly' })

    return stream
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
