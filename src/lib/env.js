function readEnv(name, fallback) {
  return process.env[name] || fallback || '';
}

export const env = {
  ALCARRITO_GRAPHQL_URL:
    readEnv('ALCARRITO_GRAPHQL_URL') ||
    readEnv('NEXT_PUBLIC_ALCARRITO_GRAPHQL_URL') ||
    'https://mcstaging.alcarrito.com/graphql',
  ALCARRITO_STORE_CODE:
    readEnv('ALCARRITO_STORE_CODE') ||
    readEnv('NEXT_PUBLIC_ALCARRITO_STORE_CODE') ||
    'default',
};

export function graphqlUrl() {
  const url = env.ALCARRITO_GRAPHQL_URL;
  if (!url) throw new Error('ALCARRITO_GRAPHQL_URL is not configured');
  return url;
}
