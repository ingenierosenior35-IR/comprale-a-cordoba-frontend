import { env } from '../../../lib/env';

const LOGIN_OPERATIONS = ['generateCustomerToken', 'revokeCustomerToken'];

function isLoginOperation(body) {
  try {
    const query = body?.query || '';
    return LOGIN_OPERATIONS.some((op) => query.includes(op));
  } catch {
    return false;
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Store',
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const url = env.ALCARRITO_GRAPHQL_URL;

    const forwardHeaders = {
      'Content-Type': 'application/json',
      ...(env.ALCARRITO_STORE_CODE ? { Store: env.ALCARRITO_STORE_CODE } : {}),
    };

    // Forward Authorization header unless this is a login operation
    const authHeader = request.headers.get('Authorization');
    if (authHeader && !isLoginOperation(body)) {
      forwardHeaders['Authorization'] = authHeader;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('[graphql-proxy] error:', error);
    return Response.json({ message: 'Proxy error' }, { status: 500 });
  }
}
