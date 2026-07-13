async function test() {
  const url = 'https://us-central1-aiplatform.googleapis.com/v1/projects/484117829682/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent?key=AQ.Ab8RN6IXZteR7JQJl2ZEqdZFQsfPqHXB9A54C9y-yjJD6tajHg';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Diga "Ola"' }] }]
      })
    });
    const data = await res.json();
    console.log("Success with Vertex:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
