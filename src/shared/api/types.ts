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

export type Review = {
  /** Rating out of 5. */
  rating: number
  comment: string
  /** ISO date string. */
  date: string
  reviewerName: string
}

export type ShippingAddress = {
  address: string
  email: string
  phone: string
}

/** What the customer orders. Delivery and payment choices are not sent. */
export type Order = {
  products: { id: number; quantity: number }[]
  address: ShippingAddress
}

export type ProductDetail = Product & {
  description: string
  /** Gallery images; may be empty, in which case use the thumbnail. */
  images: string[]
  stock: number
  sku: string
  stockStatus: string
  shippingInformation: string
  warrantyInformation: string
  reviews: Review[]
}
