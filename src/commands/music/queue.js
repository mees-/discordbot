const testVoice = require('../../music/testVoice')

module.exports = {
  name: 'queue',
  usage: 'queue <startAt>',

  run(req, res) {
    if (!testVoice(req)) return
    const queueArr = formatQueue(req.guild.voiceConnection.musicManager.queue.slice(0, 11))
    queueArr.push('Only showing first 10 songs, for full queue go to: ' +
      `http://${ process.env.BOT_DOMAIN }/${ req.guild.id }`)
    res.end(queueArr, { split: true })
  }
}

function formatQueue(queue, startAtIndex = 0) {
  const lines = ['Queue:\n']
  let index = startAtIndex
  for (let i = index; i < queue.length; i++) {
    const song = queue[index]
    lines.push(`${ index }.\t${ song.title }`)
    index++
  }


  return lines
}
