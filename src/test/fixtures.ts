// Small DummyJSON-shaped responses used by the fetch stub in tests.
export const categoriesResponse = [
  {
    slug: 'beauty',
    name: 'Beauty',
    url: 'https://dummyjson.com/products/category/beauty',
  },
  {
    slug: 'fragrances',
    name: 'Fragrances',
    url: 'https://dummyjson.com/products/category/fragrances',
  },
  {
    slug: 'furniture',
    name: 'Furniture',
    url: 'https://dummyjson.com/products/category/furniture',
  },
]

/** A DummyJSON-shaped product; override any field per test. */
export function makeProduct(
  id: number,
  overrides: Record<string, unknown> = {},
) {
  return {
    id,
    title: `Product ${id}`,
    description: 'A product.',
    category: 'beauty',
    price: 9.99,
    discountPercentage: 10.48,
    rating: 4.94,
    stock: 5,
    brand: 'Brand',
    sku: `SKU-${id}`,
    thumbnail: `https://cdn.dummyjson.com/products/images/${id}/thumbnail.webp`,
    images: [],
    availabilityStatus: 'In Stock',
    shippingInformation: 'Ships in 3-5 business days',
    warrantyInformation: '1 week warranty',
    reviews: [{}, {}, {}],
    ...overrides,
  }
}

/** A paged DummyJSON list response. */
export function productList(
  products: unknown[],
  total = products.length,
  skip = 0,
) {
  return { products, total, skip, limit: products.length }
}

export const productsResponse = {
  products: [
    {
      id: 1,
      title: 'Essence Mascara Lash Princess',
      description: 'A popular mascara.',
      category: 'beauty',
      price: 9.99,
      discountPercentage: 10.48,
      rating: 4.94,
      stock: 5,
      brand: 'Essence',
      sku: 'BEA-ESS-ESS-001',
      thumbnail:
        'https://cdn.dummyjson.com/products/images/beauty/1/thumbnail.webp',
      images: ['https://cdn.dummyjson.com/products/images/beauty/1/1.webp'],
      reviews: [],
    },
  ],
  total: 1,
  skip: 0,
  limit: 20,
}
