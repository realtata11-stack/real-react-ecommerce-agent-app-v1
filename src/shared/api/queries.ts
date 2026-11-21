import { useQuery } from '@tanstack/react-query'
import { listCategories, listProductsByCategory } from './storeApi.ts'

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
