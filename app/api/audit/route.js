import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const body = await request.json();
    const url = body.url || '';

    if (!url.includes('airbnb')) {
      return Response.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const cleanUrl = url.startsWith('http') ? url : 'https://' + url;
    const match = cleanUrl.match(/rooms\/(\d+)/);
    const listingId = match ? match[1] : '12345678';

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'API key missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an Airbnb SEO expert. A host submitted listing ID ${listingId} from URL ${cleanUrl} for auditing.

Generate a realistic, helpful audit with varied scores. Return ONLY this JSON with no extra text, no markdown, no backticks:

{"overall":64,"title":"Airbnb Listing ${listingId}","factors":[{"name":"Title keywords","score":5},{"name":"Photo quality","score":6},{"name":"Description","score":4},{"name":"Amenities","score":7},{"name":"Response rate","score":6},{"name":"Pricing","score":5},{"name":"Instant book","score":3},{"name":"Review keywords","score":6}],"fix1":"Add your neighborhood name and a standout feature to your title — for example change 'Cozy apartment' to 'Cozy apartment in [Neighborhood] with Rooftop Access' — listings with location keywords get 23% more impressions","fix2":"Enable Instant Book in your Airbnb settings — Airbnb's search algorithm ranks instant book listings up to 40% higher than request-to-book listings","fix3":"Increase your photo count to at least 20 images — include every room, outdoor spaces, the building entrance, and nearby attractions — listings with 20 plus photos get significantly more bookings"}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    // Strip any markdown if present
    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Find the JSON object
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) {
      throw new Error('No JSON found in response');
    }

    const jsonStr = cleaned.slice(start, end + 1);
    const data = JSON.parse(jsonStr);

    return Response.json(data);

  } catch (err) {
    console.error('AUDIT ERROR:', err.message);
    return Response.json({ error: 'Failed to analyze listing' }, { status: 500 });
  }
}
