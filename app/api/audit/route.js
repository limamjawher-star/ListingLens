// Helper 1: Scrape the real property name from the Airbnb page
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

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
    if (titleMatch) {
      return titleMatch[1]
        .replace(' - Airbnb', '')
        .replace(' | Airbnb', '')
        .replace(' - Houses for Rent in', '')
        .trim();
    }

    const ogMatch = html.match(/og:title.*?content="([^"]+)"/);
    if (ogMatch) return ogMatch[1].trim();

    return null;
  } catch (err) {
    console.error('Name scraping failed:', err.message);
    return null;
  }
}

// Helper 2: Scrape real guest reviews from the Airbnb page
async function extractReviews(url) {
  try {
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 
        'Accept-Language': 'en-US' 
      },
      signal: AbortSignal.timeout(8000)
    });
    const html = await res.text();

    // Method 1: Extract from embedded JSON "comments" fields
    const commentMatches = html.match(/"comments":"([^"]{20,500})"/g) || [];
    const reviews = commentMatches
      .slice(0, 8)
      .map(m => m.replace('"comments":"', '').replace(/"$/, '')
        .replace(/\\n/g, ' ')
        .replace(/\\u[\dA-F]{4}/gi, ''))
      .filter(r => r.length > 15);

    // Method 2: Extract reviewer names
    const nameMatches = html.match(/"reviewerName":"([^"]+)"/g) || [];
    const names = nameMatches.slice(0, 8)
      .map(m => m.replace('"reviewerName":"', '').replace(/"$/, ''));

    return reviews.map((text, i) => ({
      text,
      reviewer: names[i] || 'Guest'
    }));
  } catch (err) {
    console.error('Review scraping failed:', err.message);
    return [];
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

    // RUN SCRAPERS
    const listingName = await getListingName(url) || `Listing ${listingId}`;
    const realReviews = await extractReviews(url);

    const seed = parseInt(listingId.slice(-3)) || 500;

    const prompt = `You are a senior Airbnb SEO analyst auditing: "${listingName}" (ID: ${listingId}).

STRICT RULES:
- Use the actual name "${listingName}" in the "title" field.
- Generate a realistic audit with 8 factors (scores 2-9).
- overall = Math.round((sum of all 8 scores / 8) * 10).
- Provide 3 specific fixes.
- Return ONLY raw JSON.

Return this exact format:
{"overall":72,"title":"${listingName}","factors":[{"name":"Title keywords","score":6},{"name":"Photo quality","score":8},{"name":"Description","score":4},{"name":"Amenities","score":7},{"name":"Response rate","score":5},{"name":"Pricing","score":9},{"name":"Instant book","score":3},{"name":"Review keywords","score":7}],"fix1":"...","fix2":"...","fix3":"..."}`;

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 1.0, maxOutputTokens: 1000 }
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
            // Include the scraped reviews in the successful response
            data.reviews = realReviews; 
            return Response.json(data);
          }
        }
      }
    } catch (aiErr) {
      console.error('AI failed:', aiErr.message);
    }

    // FALLBACK (If AI fails)
    const s = (base, offset) => Math.min(9, Math.max(2, base + (seed % offset) - Math.floor(offset / 2)));
    const f = [s(5,5), s(7,4), s(4,6), s(6,3), s(6,7), s(5,5), s(3,4), s(6,6)];
    const overall = Math.round((f.reduce((a,b) => a+b, 0) / 8) * 10);

    return Response.json({
      overall,
      title: listingName,
      factors: [
        { name: "Title keywords", score: f[0] },
        { name: "Photo quality", score: f[1] },
        { name: "Description", score: f[2] },
        { name: "Amenities", score: f[3] },
        { name: "Response rate", score: f[4] },
        { name: "Pricing", score: f[5] },
        { name: "Instant book", score: f[6] },
        { name: "Review keywords", score: f[7] }
      ],
      fix1: `Update "${listingName}" with neighborhood keywords.`,
      fix2: `Enable Instant Book for better ranking.`,
      fix3: `Add emotional language to your description.`,
      reviews: realReviews // Include reviews even in fallback
    });

  } catch (err) {
    console.error('Server error:', err.message);
    return Response.json({ error: 'Server Error' }, { status: 500 });
  }
}
