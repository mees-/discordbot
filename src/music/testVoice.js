const { notInVoiceChannel } = require('../messages')

module.exports = function testVoice(message) {
  const voice = message.channel.guild.voiceConnection && message.channel.guild.voiceConnection.musicManager

  if (!voice) {
    message.reply(notInVoiceChannel())
  }
  return voice
}
