import * as googleTTS from 'google-tts-api';

async function test() {
  const url = googleTTS.getAudioUrl('Hello, I am Joe', {
    lang: 'en-GB',
    slow: false,
    host: 'https://translate.google.com',
  });
  console.log(url);
}
test();
