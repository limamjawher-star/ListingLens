// Helper function to scrape the real property name from the Airbnb page
async function getListingName(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(6000)
    });
    const html = await res.text();

    // 1. Try to extract from the <title> tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
    if (titleMatch) {
      return titleMatch[1]
        .replace(' - Airbnb', '')
        .replace(' | Airbnb', '')
        .replace(' - Houses for Rent in', '') // Cleans up the title
        .trim();
    }

    // 2. Try to extract from og:title meta tag
    const ogMatch = html.match(/og:title.*?content="([^"]+)"/);
    if (ogMatch) return ogMatch[1].trim();

    return null;
  } catch (err) {
    console.error('Scraping failed:', err.message);
    return null;
  }
}

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
      return Response.json({ error: 'API key missing' }, { status: 500 });
    }

    // NEW: Get the real property name
    const listingName = await getListingName(url) || `Listing ${listingId}`;

    const seed = parseInt(listingId.slice(-3)) || 500;

    const prompt = `You are a senior Airbnb SEO analyst. You are auditing the property: "${listingName}" (ID: ${listingId}) from this URL: ${url}

Your job is to generate a UNIQUE and REALISTIC audit. 

STRICT RULES:
- Use the actual property name "${listingName}" in the "title" field of your JSON.
- Score each of the 8 factors (1 to 10) based on typical SEO logic for a listing like this.
- Make scores DIFFERENT from each other — avoid giving the same score to multiple factors.
- overall = Math.round((sum of all 8 scores / 8) * 10).
- fix1, fix2, fix3 must be SPECIFIC and mention context from the listing name or ID.
- Scores must be between 2 and 9.
- Return ONLY raw JSON — no markdown, no backticks.

Return this exact format:
{"overall":72,"title":"${listingName}","factors":[{"name":"Title keywords","score":6},{"name":"Photo quality","score":8},{"name":"Description","score":4},{"name":"Amenities","score":7},{"name":"Response rate","score":5},{"name":"Pricing","score":9},{"name":"Instant book","score":3},{"name":"Review keywords","score":7}],"fix1":"Specific advice...","fix2":"Specific advice...","fix3":"Specific advice..."}`;

    try {
      // Note: Using v1beta for gemini-1.5-flash which is currently the most stable pairing
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 1.0,
              maxOutputTokens: 1000
            }
          })
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const raw = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          const data = JSON.parse(raw.slice(start, end + 1));
          if (data.factors && data.factors.length === 8) {
            return Response.json(data);
          }
        }
      } else {
        const errText = await geminiRes.text();
        console.error('Gemini error:', errText);
      }
    } catch (aiErr) {
      console.error('AI call failed:', aiErr.message);
    }

    // Fallback with the real Listing Name if AI fails
    const s = (base, offset) => Math.min(9, Math.max(2, base + (seed % offset) - Math.floor(offset / 2)));
    const f1 = s(5, 5), f2 = s(7, 4), f3 = s(4, 6), f4 = s(6, 3);
    const f5 = s(6, 7), f6 = s(5, 5), f7 = s(3, 4), f8 = s(6, 6);
    const overall = Math.round(((f1+f2+f3+f4+f5+f6+f7+f8) / 8) * 10);

    return Response.json({
      overall,
      title: listingName,
      factors: [
        { name: "Title keywords", score: f1 },
        { name: "Photo quality", score: f2 },
        { name: "Description", score: f3 },
        { name: "Amenities", score: f4 },
        { name: "Response rate", score: f5 },
        { name: "Pricing", score: f6 },
        { name: "Instant book", score: f7 },
        { name: "Review keywords", score: f8 }
      ],
      fix1: `For "${listingName}" — Add your neighborhood name and a standout feature to your title to increase search impressions by up to 30 percent.`,
      fix2: `Enable Instant Book on this listing — Airbnb ranks instant book listings significantly higher in search results than request-to-book listings.`,
      fix3: `Rewrite your description for "${listingName}" to focus on how guests will feel — emotional language converts browsers into bookers.`
    });

  } catch (err) {
    console.error('Server error:', err.message);
    return Response.json({ error: 'Server Error' }, { status: 500 });
  }
}
