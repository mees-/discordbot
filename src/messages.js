// this is what the bot says
module.exports = {
  nowPlaying: songTitle => `I'm now bustin' \`${ songTitle }\``,
  notInVoiceChannel: () => 'Ay, I\'m not in a voice channel man',
  resumed: () => 'I resumed that for ya',
  addedSong: songTitle => `Gotcha! I added \`${ songTitle }\``,
  errorAddedSong: () => 'Something went wrong and I couldn\'t add your song :(',
  changeVolume: () => 'Too loud? too quiet? whatevs 😴',
  noArg: () => 'At least give me a hint to what you want',
  stopped: () => 'Went and shut it down',
  noPlaylistId: () => 'That url aint got no playlist in it yo',
  startPlaylist: () => 'Imma get ur playlist right away!',
  endPlSongsError: amount => `Darn i missed ${ amount } song${ amount === 1 ? '' : 's' } ` +
  '(probably because \\*\\*\\*\\*ing copyright)',
  endPlSongsSuccess: () => 'Hey i got ur playlist without any errors!',
  userNotInVoice: () => 'R U tryna trick me? you\'re not even in a voice channel',
  clearedQueue: () => 'Cleaned that mess up, pfff',
  tooHighVolume: () => 'JESUS CHRIST DON\'T TRY THAT AGAIN (panic)',
  left: () => 'Cya later Aligator 🐊 🐊',
  pausedSong: () => 'Your turn'
}
