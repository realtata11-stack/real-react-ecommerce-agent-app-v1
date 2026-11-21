import { dollarsToCents } from '../pricing/pricing.ts'
import { apiBaseUrl } from './config.ts'
import type {
  Category,
  Order,
  Product,
  ProductDetail,
  ProductPage,
  Review,
} from './types.ts'

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

type RawReview = {
  rating: number
  comment: string
  date: string
  reviewerName: string
}

type RawProductDetail = Omit<RawProduct, 'reviews'> & {
  description: string
  images?: string[]
  stock: number
  sku: string
  availabilityStatus: string
  shippingInformation: string
  warrantyInformation: string
  reviews?: RawReview[]
}

type RawProductPage = { products: RawProduct[]; total: number }

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`)
  if (!response.ok) throw new Error(`Request failed with ${response.status}`)
  return (await response.json()) as T
}

/** DummyJSON has no accounts; every order is placed as this user. */
const GUEST_USER_ID = 1

/** Sends the order. DummyJSON does not store it but answers as if it did. */
export async function placeOrder({ products, address }: Order): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/carts/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: GUEST_USER_ID, products, address }),
  })
  if (!response.ok) throw new Error(`Request failed with ${response.status}`)
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

function toReview(raw: RawReview): Review {
  return {
    rating: raw.rating,
    comment: raw.comment,
    date: raw.date,
    reviewerName: raw.reviewerName,
  }
}

export async function getProduct(id: string): Promise<ProductDetail> {
  const raw = await getJson<RawProductDetail>(
    `/products/${encodeURIComponent(id)}`,
  )
  const reviews = (raw.reviews ?? []).map(toReview)
  return {
    ...toProduct({ ...raw, reviews }),
    description: raw.description,
    images: raw.images ?? [],
    stock: raw.stock,
    sku: raw.sku,
    stockStatus: raw.availabilityStatus,
    shippingInformation: raw.shippingInformation,
    warrantyInformation: raw.warrantyInformation,
    reviews,
  }
}
