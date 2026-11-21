/** The one place that builds a product list URL (category and page live in the URL). */
export function productsUrl(slug: string, page = 1): string {
  const base = `/products?category=${encodeURIComponent(slug)}`
  return page > 1 ? `${base}&page=${page}` : base
}
