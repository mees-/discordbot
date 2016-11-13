const { PassThrough } = require('stream')
const request = require('request-promise-native')

module.exports = function ytpl(pid, apiKey) {
  const url = 'https://www.googleapis.com/youtube/v3/playlistItems' +
  `?part=contentDetails&maxResults=50&playlistId=${ pid }&key=${ apiKey }`
  const stream = new PassThrough({ objectMode: true })

  function page(token) {
    return `${ url }&pageToken=${ token }`
  }

  function callback(url2) {
    request(url2)
      .then((res) => {
        const json = JSON.parse(res)
        for (const item of json.items) {
          stream.write(item)
        }
        if (json.nextPageToken) {
          return callback(page(json.nextPageToken))
        }
        stream.end()
      })
      .catch(e => stream.emit('error', e))
  }
  callback(url)
  return stream
}
