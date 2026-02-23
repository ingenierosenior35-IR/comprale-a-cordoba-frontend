import { useQuery } from '@tanstack/react-query';
import graphqlClient from '../lib/graphqlClient';
import { SELLERS_WITH_PRODUCTS } from '../graphql/sellers/queries';

export function useSellersWithProducts({ pageSize = 10, productLimit = 6, currentPage = 1 } = {}) {
  return useQuery({
    queryKey: ['sellersWithProducts', pageSize, productLimit, currentPage],
    queryFn: () =>
      graphqlClient.request(SELLERS_WITH_PRODUCTS, { pageSize, productLimit, currentPage }),
  });
}
