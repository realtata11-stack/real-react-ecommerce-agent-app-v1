import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import {
  categoriesResponse,
  makeProduct,
  productList,
} from '../../test/fixtures.ts'
import { renderApp, stubFetch } from '../../test/renderApp.tsx'

const title = () => screen.getByRole('heading', { level: 1 })
const categoryNav = () =>
  within(screen.getByRole('navigation', { name: 'Categories' }))

test('/products redirects to the first category and lists its products', async () => {
  stubFetch({
    '/products/category/beauty': productList([
      makeProduct(1, {
        title: 'Essence Mascara',
        brand: 'Essence',
        price: 9.99,
        discountPercentage: 10.48,
      }),
    ]),
  })
  renderApp('/products')

  expect(await screen.findByText('Essence Mascara')).toBeInTheDocument()
  expect(title()).toHaveTextContent('Beauty')
  const card = screen.getByRole('link', { name: /Essence Mascara/ })
  expect(card).toHaveAttribute('href', '/products/1')
  expect(within(card).getByText('Essence')).toBeInTheDocument()
  expect(within(card).getByText('(3)')).toBeInTheDocument()
  expect(within(card).getByText('$9.99')).toBeInTheDocument()
  expect(within(card).getByText('$11.16')).toBeInTheDocument()
  expect(within(card).getByText('10% Off')).toBeInTheDocument()
})

test('lists every category and marks the one being viewed', async () => {
  stubFetch({ '/products/category/fragrances': productList([makeProduct(2)]) })
  renderApp('/products?category=fragrances')

  expect(await screen.findByText('Product 2')).toBeInTheDocument()
  expect(title()).toHaveTextContent('Fragrances')
  for (const { name } of categoriesResponse) {
    expect(categoryNav().getByRole('link', { name })).toBeInTheDocument()
  }
  expect(
    categoryNav().getByRole('link', { name: 'Fragrances', current: 'page' }),
  ).toHaveAttribute('href', '/products?category=fragrances')
  expect(
    categoryNav().getByRole('link', { name: 'Beauty', current: false }),
  ).toBeInTheDocument()
})

test('an unknown category shows an error', async () => {
  renderApp('/products?category=no-such-category')

  expect(
    await screen.findByText('Something went wrong. Please try again.'),
  ).toBeInTheDocument()
})

test('shows a loading indicator while products load', async () => {
  stubFetch({ '/products/category/beauty': () => new Promise(() => {}) })
  renderApp('/products?category=beauty')

  // The categories arrive; the products are still pending.
  expect(
    await within(
      await screen.findByRole('navigation', { name: 'Categories' }),
    ).findByRole('link', { name: 'Fragrances' }),
  ).toBeInTheDocument()
  expect(title()).toHaveTextContent('Beauty')
  expect(screen.getByRole('status')).toBeInTheDocument()
})

test('shows an error when products fail to load', async () => {
  stubFetch({
    '/products/category/beauty': new Response('boom', { status: 500 }),
  })
  renderApp('/products?category=beauty')

  expect(
    await screen.findByText('Something went wrong. Please try again.'),
  ).toBeInTheDocument()
  expect(
    categoryNav().getByRole('link', { name: 'Fragrances' }),
  ).toBeInTheDocument()
})

test('switching category shows that category', async () => {
  stubFetch({
    '/products/category/beauty': productList([makeProduct(1)]),
    '/products/category/fragrances': productList([makeProduct(2)]),
  })
  renderApp('/products?category=beauty')
  await screen.findByText('Product 1')

  await userEvent.click(categoryNav().getByRole('link', { name: 'Fragrances' }))

  expect(await screen.findByText('Product 2')).toBeInTheDocument()
  expect(title()).toHaveTextContent('Fragrances')
})

test('the title falls back to Products when the categories cannot load', async () => {
  stubFetch({
    '/products/categories': new Response('boom', { status: 500 }),
  })
  renderApp('/products')

  expect(
    await screen.findByText('Something went wrong. Please try again.'),
  ).toBeInTheDocument()
  expect(title()).toHaveTextContent('Products')
})

// --- Pagination -------------------------------------------------------------

const groceriesCategories = [
  { slug: 'beauty', name: 'Beauty', url: '' },
  { slug: 'groceries', name: 'Groceries', url: '' },
]

/** A 25-product Groceries category: 20 on page 1, 5 on page 2. */
function stubGroceries() {
  return stubFetch({
    '/products/categories': groceriesCategories,
    '/products/category/beauty': productList([makeProduct(900)]),
    '/products/category/groceries': (url: URL) => {
      const skip = Number(url.searchParams.get('skip'))
      const count = Math.max(0, Math.min(20, 25 - skip))
      const products = Array.from({ length: count }, (_, i) =>
        makeProduct(skip + i + 1, { title: `Grocery ${skip + i + 1}` }),
      )
      return productList(products, 25, skip)
    },
  })
}

const pager = () =>
  within(screen.getByRole('navigation', { name: 'Pagination' }))

const requestedUrls = (stub: ReturnType<typeof stubFetch>) =>
  stub.mock.calls.map(([input]) => String(input))

test('requests 20 products per page using limit and skip', async () => {
  const stub = stubGroceries()
  renderApp('/products?category=groceries&page=2')

  expect(await screen.findByText('Grocery 21')).toBeInTheDocument()
  expect(requestedUrls(stub)).toContain(
    'https://dummyjson.com/products/category/groceries?limit=20&skip=20',
  )
})

test('Groceries page 2 is the last page: Next is disabled', async () => {
  stubGroceries()
  renderApp('/products?category=groceries&page=2')
  await screen.findByText('Grocery 21')

  expect(
    screen
      .getAllByRole('listitem')
      .filter((li) => li.textContent?.includes('Grocery')),
  ).toHaveLength(5)
  expect(pager().getByRole('button', { name: 'Next' })).toBeDisabled()
  expect(pager().getByRole('button', { name: 'Previous' })).toBeEnabled()
  expect(pager().getByRole('button', { name: '2' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(pager().getByRole('button', { name: '1' })).not.toHaveAttribute(
    'aria-current',
  )
})

test('Next and Previous move between pages', async () => {
  stubGroceries()
  renderApp('/products?category=groceries')
  await screen.findByText('Grocery 1')
  expect(pager().getByRole('button', { name: 'Previous' })).toBeDisabled()

  await userEvent.click(pager().getByRole('button', { name: 'Next' }))
  expect(await screen.findByText('Grocery 21')).toBeInTheDocument()

  await userEvent.click(pager().getByRole('button', { name: '1' }))
  expect(await screen.findByText('Grocery 1')).toBeInTheDocument()
})

test('the pager is shown even when there is only one page', async () => {
  stubFetch({ '/products/category/beauty': productList([makeProduct(1)]) })
  renderApp('/products?category=beauty')
  await screen.findByText('Product 1')

  expect(pager().getByRole('button', { name: '1' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(pager().getByRole('button', { name: 'Previous' })).toBeDisabled()
  expect(pager().getByRole('button', { name: 'Next' })).toBeDisabled()
})

test.each(['abc', '0', '-3', '1.5', '', ' 3 ', '1e1'])(
  'page=%j is treated as page 1',
  async (page) => {
    const stub = stubGroceries()
    renderApp(`/products?category=groceries&page=${page}`)

    expect(await screen.findByText('Grocery 1')).toBeInTheDocument()
    expect(requestedUrls(stub)).toContain(
      'https://dummyjson.com/products/category/groceries?limit=20&skip=0',
    )
  },
)

test('a page past the last one redirects to the last page', async () => {
  stubGroceries()
  renderApp('/products?category=groceries&page=9')

  expect(await screen.findByText('Grocery 21')).toBeInTheDocument()
  expect(pager().getByRole('button', { name: '2' })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('switching category goes back to page 1', async () => {
  const stub = stubGroceries()
  renderApp('/products?category=groceries&page=2')
  await screen.findByText('Grocery 21')

  await userEvent.click(categoryNav().getByRole('link', { name: 'Beauty' }))
  expect(await screen.findByText('Product 900')).toBeInTheDocument()
  await userEvent.click(categoryNav().getByRole('link', { name: 'Groceries' }))

  expect(await screen.findByText('Grocery 1')).toBeInTheDocument()
  expect(pager().getByRole('button', { name: '1' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  expect(requestedUrls(stub)).toContain(
    'https://dummyjson.com/products/category/beauty?limit=20&skip=0',
  )
})

test('/products with an empty category redirects to the first category', async () => {
  stubFetch({ '/products/category/beauty': productList([makeProduct(1)]) })
  renderApp('/products?category=')

  expect(await screen.findByText('Product 1')).toBeInTheDocument()
  expect(title()).toHaveTextContent('Beauty')
})
