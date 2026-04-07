export async function POST(request) {
  const { propertyName, city, checkInCode,
          wifiPassword, hostName, messageType } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  const prompts = {
    confirmation: `Write a warm Airbnb booking confirmation for ${propertyName} in ${city}. Host: ${hostName}. Friendly, professional, under 100 words.`,
    pre_arrival:  `Write pre-arrival instructions for ${propertyName}. Check-in code: ${checkInCode}. Wifi: ${wifiPassword}. Under 150 words. Include check-in steps clearly.`,
    day_of:       `Write a short day-of check-in message for ${propertyName}. Welcoming, under 50 words. Tell them the home is ready.`,
    mid_stay:     `Write a mid-stay check-in message for guests at ${propertyName}. Warm, under 40 words. Ask if everything is perfect.`,
    checkout:     `Write a checkout reminder for ${propertyName}. Include checkout time, what to do with keys. Under 60 words.`,
    review:       `Write a post-checkout review request for ${propertyName} in ${city}. Ask guests to mention the location and cleanliness specifically. Personal, never pushy. Under 70 words.`,
  };

  const prompt = prompts[messageType] || prompts.confirmation;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  );
  const data = await res.json();
  const message = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return Response.json({ message });
}
