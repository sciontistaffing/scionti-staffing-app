const fs = require('fs');
const https = require('https');

const url = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e0/Street_musician_playing_the_saxophone_-_Krakow_-_Poland.ogg/Street_musician_playing_the_saxophone_-_Krakow_-_Poland.ogg.mp3';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

https.get(url, options, (res) => {
  if (res.statusCode !== 200 && res.statusCode !== 302) {
    console.error(`Failed to get music, status: ${res.statusCode}`);
    process.exit(1);
  }
  
  if (res.statusCode === 302) {
    https.get(res.headers.location, options, (res2) => {
       const file = fs.createWriteStream('./public/bgm.mp3');
       res2.pipe(file);
       file.on('finish', () => console.log('Downloaded bgm.mp3 via redirect'));
    });
  } else {
    const file = fs.createWriteStream('./public/bgm.mp3');
    res.pipe(file);
    file.on('finish', () => console.log('Downloaded bgm.mp3'));
  }
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
