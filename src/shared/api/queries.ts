import { useMutation, useQuery } from '@tanstack/react-query'
import {
  getProduct,
  listCategories,
  listProductsByCategory,
  placeOrder,
} from './storeApi.ts'

export function usePlaceOrder() {
  return useMutation({ mutationFn: placeOrder })
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: listCategories })
}

export function useProductsByCategory(
  slug: string | undefined,
  { limit, skip }: { limit: number; skip: number },
) {
  return useQuery({
    queryKey: ['products', 'category', slug, { limit, skip }],
    queryFn: () => listProductsByCategory(slug!, { limit, skip }),
    enabled: slug !== undefined,
  })
}

export function useProduct(id: string) {
  return useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id) })
}
