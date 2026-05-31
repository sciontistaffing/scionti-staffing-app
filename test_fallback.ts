import * as googleTTS from 'google-tts-api';

async function test() {
  try {
        let text = "Hola";
        let targetLang = 'es';

        const results = await googleTTS.getAllAudioBase64(text, {
          lang: targetLang,
          slow: false,
          host: 'https://translate.google.com',
        });
        
        const bufs = results.map(r => Buffer.from(r.base64, 'base64'));
        const finalBuffer = Buffer.concat(bufs);
        const base64Audio = finalBuffer.toString('base64');
        console.log("Success:", base64Audio.substring(0, 20));
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
