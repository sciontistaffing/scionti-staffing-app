const https = require('https');
https.get('https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3', (res) => {
  console.log('Location:', res.headers.location);
});
