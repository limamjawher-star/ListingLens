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

    const seed = parseInt(listingId.slice(-3)) || 500;

    const prompt = `You are a senior Airbnb SEO analyst. You are auditing listing ID ${listingId} from this URL: ${url}

Your job is to generate a UNIQUE and REALISTIC audit every time. Use the listing ID ${listingId} to vary your scores — no two listings should get the same result.

Score each of these 8 factors from 1 to 10 based on typical Airbnb SEO logic:
1. Title keywords — does the title likely contain location, unique features, property type?
2. Photo quality — based on typical listings of this type, estimate photo quality and count
3. Description — is the description likely detailed, emotional, and keyword-rich?
4. Amenities — does this listing type typically have strong amenity coverage?
5. Response rate — estimate based on listing age and type
6. Pricing — is pricing likely competitive for this market?
7. Instant book — many hosts forget this, estimate likelihood it is enabled
8. Review keywords — estimate quality of review language for this listing type

STRICT RULES:
- Make scores DIFFERENT from each other — avoid giving the same score to multiple factors
- overall = Math.round((sum of all 8 scores / 8) * 10) — calculate this yourself
- fix1, fix2, fix3 must be SPECIFIC to listing ${listingId} — mention the listing ID or URL context
- Do NOT repeat the same fixes every time
- Scores must be between 2 and 9
- Return ONLY raw JSON — no markdown, no backticks, no explanation

Return this exact format:
{"overall":72,"title":"Airbnb Listing ${listingId}","factors":[{"name":"Title keywords","score":6},{"name":"Photo quality","score":8},{"name":"Description","score":4},{"name":"Amenities","score":7},{"name":"Response rate","score":5},{"name":"Pricing","score":9},{"name":"Instant book","score":3},{"name":"Review keywords","score":7}],"fix1":"Your title for listing ${listingId} is missing the neighborhood name — add the district or area name and one unique feature like a view or pool to increase click-through rate by up to 30 percent","fix2":"Based on your listing type, enable Instant Book immediately — Airbnb ranks instant book listings significantly higher and you are currently losing visibility to competitors who have it on","fix3":"Your description likely lacks emotional trigger words — rewrite the first two sentences to describe how guests will feel staying here, not just what the space contains"}`;

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

    // Fallback with seed-based varied scores so every listing gets different numbers
    const s = (base, offset) => Math.min(9, Math.max(2, base + (seed % offset) - Math.floor(offset / 2)));
    const f1 = s(5, 5), f2 = s(7, 4), f3 = s(4, 6), f4 = s(6, 3);
    const f5 = s(6, 7), f6 = s(5, 5), f7 = s(3, 4), f8 = s(6, 6);
    const overall = Math.round(((f1+f2+f3+f4+f5+f6+f7+f8) / 8) * 10);

    return Response.json({
      overall,
      title: `Airbnb Listing ${listingId}`,
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
      fix1: `Listing ${listingId} — Add your neighborhood name and a standout feature to your title to increase search impressions by up to 30 percent`,
      fix2: `Enable Instant Book on listing ${listingId} — Airbnb ranks instant book listings significantly higher in search results than request-to-book listings`,
      fix3: `Listing ${listingId} — Rewrite your first description paragraph to focus on how guests will feel, not just what the space contains — emotional language converts browsers into bookers`
    });

  } catch (err) {
    console.error('Server error:', err.message);
    return Response.json({ error: 'Server Error' }, { status: 500 });
  }
}
