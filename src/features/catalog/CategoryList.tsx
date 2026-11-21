import { Link } from 'react-router'
import type { Category } from '../../shared/api/types.ts'
import { productsUrl } from './productsUrl.ts'

/** Right-aligned category list; the selected one is bold and primary. */
export function CategoryList({
  categories,
  selectedSlug,
}: {
  categories: Category[]
  selectedSlug: string | undefined
}) {
  return (
    <nav aria-label="Categories">
      <ul className="flex flex-col gap-4 text-right">
        {categories.map((category) => {
          const selected = category.slug === selectedSlug
          return (
            <li key={category.slug}>
              <Link
                to={productsUrl(category.slug)}
                aria-current={selected ? 'page' : undefined}
                className={
                  selected
                    ? 'font-bold text-primary'
                    : 'hover:text-primary-hover'
                }
              >
                {category.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
