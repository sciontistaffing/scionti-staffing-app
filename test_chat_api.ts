import fetch from "node-fetch";

async function run() {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "Hello", history: [] })
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
run();
