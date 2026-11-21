import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { CART_STORAGE_KEY } from '../cart/cartStore.tsx'
import { makeProduct } from '../../test/fixtures.ts'
import { renderApp, stubFetch } from '../../test/renderApp.tsx'

const title = () => screen.getByRole('heading', { level: 1 })

const detail = makeProduct(1, {
  title: 'Essence Mascara',
  brand: 'Essence',
  description: 'A popular mascara.',
  price: 9.99,
  discountPercentage: 10.48,
  rating: 4.96,
  stock: 99,
  sku: 'BEA-ESS-ESS-001',
  images: ['https://img.test/1.webp', 'https://img.test/2.webp'],
  reviews: [
    {
      rating: 3,
      comment: 'Would not recommend!',
      date: '2025-04-30T09:41:02.000Z',
      reviewerName: 'Eleanor Collins',
    },
    {
      rating: 4,
      comment: 'Very satisfied!',
      date: '2025-04-30T09:41:02.000Z',
      reviewerName: 'Lucas Gordon',
    },
    {
      rating: 5,
      comment: 'Highly impressed!',
      date: '2025-04-30T09:41:02.000Z',
      reviewerName: 'Nora Smith',
    },
  ],
})

test('shows the product information', async () => {
  stubFetch({ '/products/1': detail })
  renderApp('/products/1')

  expect(await screen.findByText('A popular mascara.')).toBeInTheDocument()
  expect(title()).toHaveTextContent('Essence Mascara')
  expect(
    screen.getByRole('heading', { level: 2, name: 'Essence Mascara' }),
  ).toBeInTheDocument()
  expect(screen.getByText('Essence')).toBeInTheDocument()
  expect(screen.getByText('3 Reviews')).toBeInTheDocument()
  expect(screen.getByText('$9.99')).toBeInTheDocument()
  expect(screen.getByText('$11.16')).toBeInTheDocument()
  expect(screen.getByText('10% Off')).toBeInTheDocument()
  expect(screen.getByText('SKU: BEA-ESS-ESS-001')).toBeInTheDocument()
  expect(screen.getByText('Quantity: 99 left')).toBeInTheDocument()
  expect(screen.getByText('Stock Status: In Stock')).toBeInTheDocument()
  expect(screen.getByText('Ships in 3-5 business days')).toBeInTheDocument()
  expect(screen.getByText('1 week warranty')).toBeInTheDocument()
})

test('the stars match the rating rounded to a whole star', async () => {
  stubFetch({ '/products/1': detail })
  renderApp('/products/1')
  await screen.findByText('A popular mascara.')

  // 4.96 shows 5 stars, not 4 (and not 2).
  const top = screen.getAllByRole('img', { name: '5 out of 5 stars' })
  expect(top.length).toBeGreaterThan(0)
})

test('the thumbnails switch the large image', async () => {
  stubFetch({ '/products/1': detail })
  renderApp('/products/1')
  await screen.findByText('A popular mascara.')

  const main = () => screen.getByRole('img', { name: 'Essence Mascara' })
  expect(main()).toHaveAttribute('src', 'https://img.test/1.webp')
  expect(screen.getByRole('button', { name: 'Image 1' })).toHaveAttribute(
    'aria-current',
    'true',
  )

  await userEvent.click(screen.getByRole('button', { name: 'Image 2' }))

  expect(main()).toHaveAttribute('src', 'https://img.test/2.webp')
  expect(screen.getByRole('button', { name: 'Image 2' })).toHaveAttribute(
    'aria-current',
    'true',
  )
})

test('shows a loading indicator while the product loads', () => {
  stubFetch({ '/products/1': () => new Promise(() => {}) })
  renderApp('/products/1')

  expect(screen.getByRole('status')).toBeInTheDocument()
})

test.each([
  ['the request fails', new Response('boom', { status: 500 })],
  ['the product does not exist', undefined],
])('shows an error when %s', async (_name, answer) => {
  if (answer) stubFetch({ '/products/1': answer })
  renderApp('/products/1')

  expect(
    await screen.findByText("We couldn't load this product. Please try again."),
  ).toBeInTheDocument()
  expect(within(screen.getByRole('main')).queryByRole('status')).toBeNull()
})

// --- Reviews ----------------------------------------------------------------

test('shows the review summary and the review cards', async () => {
  stubFetch({ '/products/1': detail })
  renderApp('/products/1')
  await screen.findByText('A popular mascara.')

  expect(screen.getByText('4.96')).toBeInTheDocument()
  expect(screen.getByText('Based on 3 Reviews')).toBeInTheDocument()

  const bar = (level: number) =>
    screen.getByRole('meter', { name: `${level} star reviews` })
  expect(bar(5)).toHaveAttribute('aria-valuenow', '1')
  expect(bar(4)).toHaveAttribute('aria-valuenow', '1')
  expect(bar(3)).toHaveAttribute('aria-valuenow', '1')
  expect(bar(2)).toHaveAttribute('aria-valuenow', '0')
  expect(bar(1)).toHaveAttribute('aria-valuenow', '0')
  expect(bar(5)).toHaveAttribute('data-tone', 'high')
  expect(bar(4)).toHaveAttribute('data-tone', 'high')
  expect(bar(3)).toHaveAttribute('data-tone', 'mid')
  expect(bar(2)).toHaveAttribute('data-tone', 'low')
  expect(bar(1)).toHaveAttribute('data-tone', 'low')

  const card = screen.getByRole('article', { name: /Eleanor Collins/ })
  expect(within(card).getByText('E')).toBeInTheDocument()
  expect(within(card).getByText('30 April 2025')).toBeInTheDocument()
  expect(
    within(card).getByRole('img', { name: '3 out of 5 stars' }),
  ).toBeInTheDocument()
  expect(within(card).getByText('Would not recommend!')).toBeInTheDocument()
  expect(screen.getAllByRole('article')).toHaveLength(3)
})

test('a product without reviews still renders', async () => {
  stubFetch({ '/products/1': { ...detail, reviews: [] } })
  renderApp('/products/1')

  expect(await screen.findByText('Based on 0 Reviews')).toBeInTheDocument()
  expect(screen.queryAllByRole('article')).toHaveLength(0)
})

// --- Add To Cart ------------------------------------------------------------

const header = () => screen.getByRole('banner')

test('Add To Cart opens the confirmation and raises the cart badge', async () => {
  stubFetch({ '/products/1': detail })
  renderApp('/products/1')
  await screen.findByText('A popular mascara.')
  expect(within(header()).queryByText('1')).toBeNull()

  await userEvent.click(screen.getByRole('button', { name: 'Add To Cart' }))

  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByText('Product Added to Cart')).toBeInTheDocument()
  expect(
    within(dialog).getByText(
      'The product has been successfully added to your cart!',
    ),
  ).toBeInTheDocument()
  expect(within(header()).getByText('1')).toBeInTheDocument()

  await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
  expect(screen.queryByRole('dialog')).toBeNull()

  // The cross in the corner closes it too.
  await userEvent.click(screen.getByRole('button', { name: 'Add To Cart' }))
  expect(within(header()).getByText('2')).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }))
  expect(screen.queryByRole('dialog')).toBeNull()
})

test('the cart survives a refresh', async () => {
  stubFetch({ '/products/1': detail })
  const first = renderApp('/products/1')
  await screen.findByText('A popular mascara.')
  await userEvent.click(screen.getByRole('button', { name: 'Add To Cart' }))
  expect(within(header()).getByText('1')).toBeInTheDocument()
  first.unmount()

  renderApp('/products/1')
  expect(await within(header()).findByText('1')).toBeInTheDocument()
})

test.each([
  ['storage holds broken JSON', () => localStorage.setItem(CART_STORAGE_KEY, '{nope')],
  [
    'storage holds the wrong shape',
    () => localStorage.setItem(CART_STORAGE_KEY, '{"a":1}'),
  ],
])('starts with an empty cart when %s', async (_name, corrupt) => {
  corrupt()
  stubFetch({ '/products/1': detail })
  renderApp('/products/1')
  await screen.findByText('A popular mascara.')

  expect(within(header()).queryByText(/^\d+$/)).toBeNull()
  await userEvent.click(screen.getByRole('button', { name: 'Add To Cart' }))
  expect(within(header()).getByText('1')).toBeInTheDocument()
})

test('the cart keeps working when storage is unavailable', async () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('denied')
  })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('denied')
  })
  stubFetch({ '/products/1': detail })
  renderApp('/products/1')
  await screen.findByText('A popular mascara.')

  await userEvent.click(screen.getByRole('button', { name: 'Add To Cart' }))

  expect(within(header()).getByText('1')).toBeInTheDocument()
  vi.restoreAllMocks()
})

test('Add To Cart is disabled when the product is out of stock', async () => {
  stubFetch({
    '/products/1': { ...detail, stock: 0, availabilityStatus: 'Out of Stock' },
  })
  renderApp('/products/1')
  await screen.findByText('A popular mascara.')

  expect(screen.getByRole('button', { name: 'Add To Cart' })).toBeDisabled()
})
