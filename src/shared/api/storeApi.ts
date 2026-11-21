import { dollarsToCents } from '../pricing/pricing.ts'
import { apiBaseUrl } from './config.ts'
import type { Category, Product, ProductPage } from './types.ts'

/**
 * The only module that knows the DummyJSON wire format. Swapping the API
 * means changing this file and `VITE_API_BASE_URL`.
 */

type RawCategory = { slug: string; name: string }

type RawProduct = {
  id: number
  title: string
  brand?: string
  thumbnail: string
  rating: number
  reviews?: unknown[]
  price: number
  discountPercentage: number
}

type RawProductPage = { products: RawProduct[]; total: number }

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`)
  if (!response.ok) throw new Error(`Request failed with ${response.status}`)
  return (await response.json()) as T
}

function toProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    brand: raw.brand ?? null,
    thumbnail: raw.thumbnail,
    rating: raw.rating,
    reviewCount: raw.reviews?.length ?? 0,
    priceCents: dollarsToCents(raw.price),
    discountPercentage: raw.discountPercentage,
  }
}

export async function listCategories(): Promise<Category[]> {
  const raw = await getJson<RawCategory[]>('/products/categories')
  return raw.map(({ slug, name }) => ({ slug, name }))
}

export async function listProductsByCategory(
  slug: string,
  { limit, skip }: { limit: number; skip: number },
): Promise<ProductPage> {
  const raw = await getJson<RawProductPage>(
    `/products/category/${encodeURIComponent(slug)}?limit=${limit}&skip=${skip}`,
  )
  return { products: raw.products.map(toProduct), total: raw.total }
}
