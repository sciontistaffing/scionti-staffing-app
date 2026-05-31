import fetch from "node-fetch";

async function test() {
  for (const voice of ["Matthew", "Brian", "Joanna", "Salli"]) {
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=Hello%20this%20is%20a%20test`;
    const res = await fetch(url);
    console.log(voice, res.status, res.headers.get("content-type"));
  }
}
test();
