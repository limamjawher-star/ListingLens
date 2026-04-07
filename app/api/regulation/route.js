export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // This tells the code to look for a city in the URL, or use 'Paris' as a backup
    const city = searchParams.get('city') || 'Paris'; 
    
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json({ error: 'API key missing' }, { status: 500 });
    }

    const prompt = `You are a short-term rental legal expert.
What are the current STR regulations in ${city} as of ${new Date().getFullYear()}?

Return exactly 3 bullet points in plain text a host needs to know:
1. Permit or registration requirements
2. Night limits or restrictions
3. Tax obligations

If you are uncertain about recent changes say so clearly.
Be specific and practical, not generic.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!res.ok) {
      return Response.json({ error: 'Gemini API failed' }, { status: 500 });
    }

    const data = await res.json();
    const regulationText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No regulation data found.';

    return Response.json({ city, regulation: regulationText });
    
  } catch (err) {
    console.error('Regulation API error:', err.message);
    return Response.json({ error: 'Server Error' }, { status: 500 });
  }
}
