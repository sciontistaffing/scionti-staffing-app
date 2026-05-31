const https = require('https');

const options = {
  hostname: 'freesound.org',
  path: '/apiv2/search/text/?query=acoustic+guitar&fields=id,name,previews&token=YOUR_TOKEN',
  // I need an API key for freesound... let's just fetch a list of public domain mp3s.
};
