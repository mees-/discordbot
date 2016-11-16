const request = require('request-promise-native')

module.exports = async function ytpl(pid, apiKey) {
  const base = 'https://www.googleapis.com/youtube/v3/playlistItems' +
  `?part=contentDetails&maxResults=50&playlistId=${ pid }&key=${ apiKey }`

  function page(token) {
    return `${ base }&pageToken=${ token }`
  }
  const items = []
  async function callback(url) {
    let res
    try {
      res = await request(url)
    } catch (e) {
      console.log(e)
    }
    const json = JSON.parse(res)
    for (const item of json.items) {
      items.push(item)
    }
    if (json.nextPageToken) {
      return callback(page(json.nextPageToken))
    }
    return items
  }
  return callback(base)
}
