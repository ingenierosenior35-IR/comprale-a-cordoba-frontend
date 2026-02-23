import { GraphQLClient } from 'graphql-request';

function getEndpoint() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/graphql-proxy`;
  }
  return process.env.ALCARRITO_GRAPHQL_URL || 'https://mcstaging.alcarrito.com/graphql';
}

const graphqlClient = new GraphQLClient(getEndpoint(), {
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_ALCARRITO_STORE_CODE
      ? { Store: process.env.NEXT_PUBLIC_ALCARRITO_STORE_CODE }
      : {}),
  },
});

export default graphqlClient;
