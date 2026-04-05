import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  const { email, url, result } = await request.json();

  if (!email || !result) {
    return Response.json({ error: 'Missing data' }, { status: 400 });
  }

  // Save audit
  const { error: auditError } = await supabase.from('audits').insert({
    user_email: email,
    listing_url: url,
    listing_title: result.title,
    overall_score: result.overall,
    title_score: result.factors?.[0]?.score,
    photos_score: result.factors?.[1]?.score,
    description_score: result.factors?.[2]?.score,
    amenities_score: result.factors?.[3]?.score,
    response_rate_score: result.factors?.[4]?.score,
    pricing_score: result.factors?.[5]?.score,
    instant_book_score: result.factors?.[6]?.score,
    review_keywords_score: result.factors?.[7]?.score,
    fix_one: result.fix1,
    fix_two: result.fix2,
    fix_three: result.fix3,
  });

  if (auditError) {
    return Response.json({ error: 'Save failed' }, { status: 500 });
  }

  // Add to subscribers list (ignore duplicate emails)
  await supabase.from('subscribers').upsert(
    { email, listing_url: url },
    { onConflict: 'email' }
  );

  return Response.json({ success: true });
}
