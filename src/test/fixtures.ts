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
