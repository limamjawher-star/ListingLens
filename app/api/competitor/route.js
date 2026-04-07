export async function POST(request) {
  try {
    const { myUrl, competitorUrls } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const results = [];

    for (const cUrl of competitorUrls.slice(0, 5)) {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cUrl })
      });
      const audit = await res.json();
      results.push({ url: cUrl, ...audit });
    }

    // Ask Gemini to compare my listing vs competitors
    const prompt = `You are an Airbnb competitive analyst.
My listing URL: ${myUrl}
My competitors and their scores: ${JSON.stringify(results.map(r => ({ url: r.url, score: r.overall, title: r.title })))}

Write exactly 3 specific things my competitors do better than me,
and for each one tell me the exact action I should take.
Be direct and specific. Return plain text, no JSON, no markdown.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
    );
    const gData = await geminiRes.json();
    const gapAnalysis = gData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return Response.json({ competitors: results, gapAnalysis });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
