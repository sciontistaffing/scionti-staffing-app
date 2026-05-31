const fs = require('fs');
const https = require('https');

const url = 'https://upload.wikimedia.org/wikipedia/commons/2/25/Acoustic_Guitar_-_Fingerpicking_-_Open_D.ogg';

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
       const file = fs.createWriteStream('./public/bgm.ogg');
       res2.pipe(file);
       file.on('finish', () => console.log('Downloaded bgm.ogg via redirect'));
    });
  } else {
    const file = fs.createWriteStream('./public/bgm.ogg');
    res.pipe(file);
    file.on('finish', () => console.log('Downloaded bgm.ogg'));
  }
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
