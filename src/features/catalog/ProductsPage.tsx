import { Navigate, useNavigate, useSearchParams } from 'react-router'
import {
  useCategories,
  useProductsByCategory,
} from '../../shared/api/queries.ts'
import { PageTitleBar } from '../../shared/layout/PageTitleBar.tsx'
import { ErrorMessage } from '../../shared/ui/ErrorMessage.tsx'
import { Spinner } from '../../shared/ui/Spinner.tsx'
import { CategoryList } from './CategoryList.tsx'
import { Pagination } from './Pagination.tsx'
import { ProductCard } from './ProductCard.tsx'
import { productsUrl } from './productsUrl.ts'

const PAGE_SIZE = 20

/** Anything that is not a positive whole number means page 1. */
function parsePage(value: string | null): number {
  const page = value !== null && /^\d+$/.test(value) ? Number(value) : 0
  return page > 0 ? page : 1
}

export function ProductsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const categorySlug = searchParams.get('category') || undefined
  const page = parsePage(searchParams.get('page'))

  const categories = useCategories()
  const category = categories.data?.find((c) => c.slug === categorySlug)
  const products = useProductsByCategory(category?.slug, {
    limit: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  })

  if (categories.isError) {
    return (
      <>
        <PageTitleBar title="Products" />
        <div className="mx-auto max-w-content px-4 py-8">
          <ErrorMessage />
        </div>
      </>
    )
  }
  if (!categories.data) {
    return (
      <>
        <PageTitleBar title="Products" />
        <div className="mx-auto max-w-content px-4 py-8">
          <Spinner />
        </div>
      </>
    )
  }
  if (categorySlug === undefined && categories.data.length > 0) {
    return <Navigate to={productsUrl(categories.data[0].slug)} replace />
  }

  const totalPages = products.data
    ? Math.max(1, Math.ceil(products.data.total / PAGE_SIZE))
    : 1
  if (category && products.data && page > totalPages) {
    return <Navigate to={productsUrl(category.slug, totalPages)} replace />
  }

  return (
    <>
      <PageTitleBar title={category?.name ?? 'Products'} />
      <div className="mx-auto flex max-w-content gap-6 px-4 py-12">
        <aside className="w-48 shrink-0">
          <CategoryList
            categories={categories.data}
            selectedSlug={category?.slug}
          />
        </aside>
        <section className="min-w-0 flex-1">
          {!category || products.isError ? (
            <ErrorMessage />
          ) : !products.data ? (
            <Spinner />
          ) : (
            <>
              <ul className="grid grid-cols-4 gap-6">
                {products.data.products.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(next) =>
                  navigate(productsUrl(category.slug, next))
                }
              />
            </>
          )}
        </section>
      </div>
    </>
  )
}
