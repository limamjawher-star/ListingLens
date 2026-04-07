export async function POST(request) {
  try {
    const { photoUrls } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!photoUrls || photoUrls.length === 0) {
      return Response.json({ error: 'No photo URLs provided' }, { status: 400 });
    }

    // Fetch photos as base64 for Gemini Vision
    const photoData = await Promise.all(
      photoUrls.slice(0, 5).map(async (url) => {
        const imgRes = await fetch(url);
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
        return { base64, mimeType, url };
      })
    );

    const parts = [
      { text: 'Analyze these Airbnb listing photos. For each: score brightness (1-10), composition (1-10), clutter (10=perfectly clean, 1=very cluttered). Return JSON array: [{ score, brightness, composition, clutter, main_issue, fix }]. Add a final "best_order" field suggesting optimal photo sequence.' },
      ...photoData.map(p => ({ inlineData: { mimeType: p.mimeType, data: p.base64 } }))
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] }) }
    );
    const data = await geminiRes.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const start = raw.indexOf('['), end = raw.lastIndexOf(']');
    const photos = JSON.parse(raw.slice(start, end + 1));

    return Response.json({ photos });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
