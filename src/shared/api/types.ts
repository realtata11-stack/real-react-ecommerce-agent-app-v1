/** Our own types. Raw API fields never leave the adapter. */

export type Category = {
  slug: string
  name: string
}

export type Product = {
  id: number
  title: string
  /** Some products have no brand. */
  brand: string | null
  thumbnail: string
  /** Rating out of 5. */
  rating: number
  reviewCount: number
  /** Discounted price in whole cents. */
  priceCents: number
  discountPercentage: number
}

export type ProductPage = {
  products: Product[]
  /** Number of products in the whole category, across all pages. */
  total: number
}
