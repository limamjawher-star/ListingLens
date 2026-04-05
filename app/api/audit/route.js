export async function POST(request) {
  try {
    const body = await request.json();
    const url = body.url || '';

    if (!url.includes('airbnb')) {
      return Response.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const match = url.match(/rooms\/(\d+)/);
    const listingId = match ? match[1] : '99999';

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('API key is missing in Vercel Environment Variables');
      return Response.json({ error: 'API key missing' }, { status: 500 });
    }

    const prompt = `You are an Airbnb SEO expert auditing listing ID ${listingId}.

Return ONLY raw JSON. No markdown. No backticks. No explanation. Just the JSON object starting with { and ending with }.

Use this exact structure with realistic varied scores between 3 and 9:

{"overall":64,"title":"Airbnb Listing ${listingId}","factors":[{"name":"Title keywords","score":5},{"name":"Photo quality","score":7},{"name":"Description","score":4},{"name":"Amenities","score":8},{"name":"Response rate","score":6},{"name":"Pricing","score":5},{"name":"Instant book","score":3},{"name":"Review keywords","score":6}],"fix1":"Add your neighborhood name to your title — change generic titles like Cozy Studio to Cozy Studio in Bastille with City Views — location keywords increase impressions by 23 percent","fix2":"Enable Instant Book in your Airbnb host settings — Airbnb ranks instant book listings up to 40 percent higher in search results than request-to-book listings","fix3":"Add at least 20 photos covering every room, outdoor spaces, the building entrance, and nearby landmarks — listings with 20 plus photos receive significantly more booking requests"}`;

    // FIXED URL: Changed v1beta to v1
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        })
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error details:', errText);
      return Response.json({ error: 'Gemini API failed' }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) {
      console.error('No JSON in response:', raw);
      return Response.json({ error: 'Bad AI response' }, { status: 500 });
    }

    const data = JSON.parse(raw.slice(start, end + 1));
    return Response.json(data);

  } catch (err) {
    console.error('SERVER ERROR:', err.message);
    return Response.json({ error: 'Failed to analyze listing' }, { status: 500 });
  }
}
