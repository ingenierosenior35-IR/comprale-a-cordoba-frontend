export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { token } = await req.json();
    if (!token) {
      return new Response(JSON.stringify({ ok: false, reason: 'missing_token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return new Response(JSON.stringify({ ok: false, reason: 'missing_secret' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);

    const googleRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = await googleRes.json();

    const score = typeof data?.score === 'number' ? data.score : 0;
    const action = data?.action || '';
    const success = Boolean(data?.success);

    const MIN_SCORE = 0.5;
    const ok = success && score >= MIN_SCORE;

    return new Response(JSON.stringify({ ok, score, action, success }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, reason: 'server_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

