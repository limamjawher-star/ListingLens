import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const { url } = await request.json();
  
  if (!url || !url.includes('airbnb.com')) {
    return Response.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Fetch the Airbnb listing page
    const pageRes = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ListingLens/1.0)' }
    });
    const html = await pageRes.text();

    // Extract readable text from the HTML
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 8000);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = [
      'You are an expert Airbnb SEO analyst.',
      'Analyze this Airbnb listing and return ONLY valid JSON. No text before or after.',
      'Listing content: ' + text,
      'Score each factor 1-10. Return JSON with: overall (0-100), title (string),',
      'factors array [{name, score}], fix1, fix2, fix3 (specific action strings).',
      'Factors: Title keywords, Photo quality, Description, Amenities,',
      'Response rate, Pricing, Instant book (10 if on, 3 if off), Review keywords.'
    ].join(' ');

    const result = await model.generateContent(prompt);
    const text_result = result.response.text();
    
    // Clean the response and parse JSON
    const cleaned = text_result.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleaned);
    
    return Response.json(data);
  } catch (error) {
    console.error('Audit error:', error);
    return Response.json({ error: 'Failed to analyze listing' }, { status: 500 });
  }
}
