import { env } from '../../../lib/env';

const LOGIN_OPERATIONS = ['generateCustomerToken', 'revokeCustomerToken'];

const ALLOWED_ORIGINS = new Set([
  'https://www.compraleacordoba.com',
  'https://compraleacordoba.com',
  'http://localhost:3000',
]);

function isLoginOperation(body) {
  try {
    const query = body?.query || '';
    return LOGIN_OPERATIONS.some((op) => query.includes(op));
  } catch {
    return false;
  }
}

function isCheckoutPaymentOperation(body) {
  try {
    const q = body?.query || '';
    return q.includes('CreateCheckoutPayment');
  } catch {
    return false;
  }
}

async function verifyRecaptchaToken(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: false, reason: 'missing_secret' };
  if (!token) return { ok: false, reason: 'missing_token' };

  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });

  const data = await res.json();
  const success = Boolean(data?.success);
  const score = typeof data?.score === 'number' ? data.score : 0;

  const MIN_SCORE = 0.5;

  return {
    ok: success && score >= MIN_SCORE,
    success,
    score,
    action: data?.action || null,
    hostname: data?.hostname || null,
    errorCodes: data?.['error-codes'] || null,
  };
}

function getCorsHeaders(request) {
  const origin = (request?.headers?.get?.('origin') || '').trim();

  if (!origin) return { headers: {}, origin: '' };

  if (!ALLOWED_ORIGINS.has(origin)) return { headers: {}, origin };

  return {
    origin,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, store, Store, X-ReCaptcha',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  };
}

export async function OPTIONS(request) {
  const { headers, origin } = getCorsHeaders(request);

  if (origin && Object.keys(headers).length === 0) {
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 204, headers });
}

export async function POST(request) {
  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const { headers: corsHeaders, origin } = getCorsHeaders(request);

  if (origin && Object.keys(corsHeaders).length === 0) {
    return new Response(JSON.stringify({ message: 'CORS not allowed' }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        Vary: 'Origin',
      },
    });
  }

  try {
    const body = await request.json();
    const url = env.ALCARRITO_GRAPHQL_URL;

    // ✅ enforce recaptcha only for payment mutation
    if (isCheckoutPaymentOperation(body)) {
      const token = (request.headers.get('X-ReCaptcha') || '').trim();
      const verdict = await verifyRecaptchaToken(token);

      if (!verdict.ok) {
        return new Response(JSON.stringify({ message: 'reCAPTCHA verification failed', details: verdict }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
    }

    const incomingStore = (request.headers.get('store') || request.headers.get('Store') || '').trim();
    const storeToSend = (incomingStore || env.ALCARRITO_STORE_CODE || '').trim();

    const forwardHeaders = {
      'Content-Type': 'application/json',
      ...(storeToSend ? { store: storeToSend } : {}),
    };

    const authHeader = request.headers.get('Authorization');
    if (authHeader && !isLoginOperation(body)) {
      forwardHeaders.Authorization = authHeader;
    }

    console.log('[graphql-proxy] -> upstream', {
      requestId,
      url,
      store: storeToSend || null,
      operationName: body?.operationName || null,
      hasVariables: Boolean(body?.variables),
      queryPreview: typeof body?.query === 'string' ? body.query.slice(0, 120) : null,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('[graphql-proxy] upstream returned non-JSON', {
        requestId,
        status: response.status,
        textPreview: text.slice(0, 300),
      });

      return new Response(JSON.stringify({ message: 'Upstream returned non-JSON', status: response.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!response.ok || data?.errors?.length) {
      console.error('[graphql-proxy] upstream error', {
        requestId,
        status: response.status,
        errors: data?.errors || null,
      });
    } else {
      console.log('[graphql-proxy] upstream ok', { requestId, status: response.status });
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('[graphql-proxy] error:', { requestId, error });

    return new Response(JSON.stringify({ message: 'Proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
