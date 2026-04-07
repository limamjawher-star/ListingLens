export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Paris';
  const type = searchParams.get('type') || '1-bedroom apartment';
  const rate = searchParams.get('rate') || '80';
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `You are an Airbnb pricing expert for ${city}.
What is the realistic competitive nightly rate range for a ${type} in ${city} right now?
The host currently charges ${rate} per night.
Return only this JSON (no markdown):
{"low":70,"average":85,"high":110,"recommendation":"Specific 1-sentence action","reason":"Why this week is different"}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  );
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const s = raw.indexOf('{'), e = raw.lastIndexOf('}');
  return Response.json(JSON.parse(raw.slice(s, e + 1)));
}
