import { env } from '../../../lib/env';

export async function POST(request) {
  try {
    const body = await request.json();
    const url = env.ALCARRITO_GRAPHQL_URL;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.ALCARRITO_STORE_CODE ? { Store: env.ALCARRITO_STORE_CODE } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('[graphql-proxy] error:', error);
    return Response.json({ message: 'Proxy error' }, { status: 500 });
  }
}
