const https = require('https');

const options = {
  hostname: 'archive.org',
  path: '/advancedsearch.php?q=subject:%22acoustic+guitar%22+AND+mediatype:audio&fl[]=identifier,title,server,dir,format&sort[]=downloads+desc&rows=3&page=1&output=json',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed.response.docs, null, 2));
    } catch (e) { console.error('Parse err', data.substring(0, 500)); }
  });
});
