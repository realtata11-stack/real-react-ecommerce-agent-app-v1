import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderApp } from './test/renderApp.tsx'

const header = () => screen.getByRole('banner')
const footer = () => screen.getByRole('contentinfo')

test('shows the store name in the header', () => {
  renderApp('/')

  expect(
    within(header()).getByRole('link', { name: 'My Store' }),
  ).toHaveAttribute('href', '/')
})

test.each([
  ['/products/1', 'Product Details'],
  ['/cart', 'Cart'],
  ['/checkout', 'Checkout'],
  ['/order-success', 'Order Placed'],
])('opens %s directly with a title bar', (path, title) => {
  renderApp(path)

  expect(
    screen.getByRole('heading', { level: 1, name: title }),
  ).toBeInTheDocument()
})

test('the home page has no title bar', () => {
  renderApp('/')

  expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
})

test('an unknown URL shows 404 with a link back home', async () => {
  renderApp('/no-such-page')

  expect(screen.getByRole('heading', { name: /404/ })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('link', { name: 'Back to Home' }))
  expect(screen.queryByRole('heading', { name: /404/ })).not.toBeInTheDocument()
})

test('header links go to the right pages', () => {
  renderApp('/')

  expect(within(header()).getByRole('link', { name: 'Home' })).toHaveAttribute(
    'href',
    '/',
  )
  expect(
    within(header()).getByRole('link', { name: 'Products' }),
  ).toHaveAttribute('href', '/products')
  expect(within(header()).getByRole('link', { name: 'Cart' })).toHaveAttribute(
    'href',
    '/cart',
  )
})

test('footer shows contact info and working links', () => {
  renderApp('/')

  const inFooter = within(footer())
  expect(inFooter.getByText('Bangkok Thailand 10150')).toBeInTheDocument()
  expect(inFooter.getByText('Call Us: 123-456-7898')).toBeInTheDocument()
  expect(inFooter.getByText('Email Us: admin@mystore.com')).toBeInTheDocument()
  expect(inFooter.getByRole('link', { name: 'Home' })).toHaveAttribute(
    'href',
    '/',
  )
  expect(inFooter.getByRole('link', { name: 'Products' })).toHaveAttribute(
    'href',
    '/products',
  )
  expect(inFooter.getByRole('link', { name: 'Cart' })).toHaveAttribute(
    'href',
    '/cart',
  )
  for (const name of [
    'Beauty',
    'Fragrances',
    'Furniture',
    'Groceries',
    'Laptops',
  ]) {
    expect(inFooter.getByRole('link', { name })).toHaveAttribute(
      'href',
      `/products?category=${name.toLowerCase()}`,
    )
  }
})

test('clicking header and footer links navigates', async () => {
  renderApp('/')

  await userEvent.click(within(header()).getByRole('link', { name: 'Cart' }))
  expect(
    screen.getByRole('heading', { level: 1, name: 'Cart' }),
  ).toBeInTheDocument()

  await userEvent.click(
    within(footer()).getByRole('link', { name: 'Products' }),
  )
  // /products lands on the first category.
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Beauty' }),
  ).toBeInTheDocument()

  await userEvent.click(
    within(header()).getByRole('link', { name: 'My Store' }),
  )
  expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
})
