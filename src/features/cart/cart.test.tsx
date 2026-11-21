import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderApp } from '../../test/renderApp.tsx'
import { CART_STORAGE_KEY as CART_KEY } from './cartStore.tsx'

const mascara = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  thumbnail:
    'https://cdn.dummyjson.com/products/images/beauty/1/thumbnail.webp',
  priceCents: 999,
  discountPercentage: 10.48,
  quantity: 2,
}
const perfume = {
  id: 2,
  title: 'Calvin Klein CK One',
  thumbnail:
    'https://cdn.dummyjson.com/products/images/fragrances/2/thumbnail.webp',
  priceCents: 4999,
  discountPercentage: 1.88,
  quantity: 1,
}

function seedCart(items: unknown[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

const row = (name: string) =>
  within(screen.getByRole('row', { name: new RegExp(name) }))
const badge = () => screen.queryByTestId('cart-badge')

test('lists each cart item with prices, savings, quantity and row total', () => {
  seedCart([mascara, perfume])
  renderApp('/cart')

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Cart')
  for (const name of [
    'Action',
    'Image',
    'Product Name',
    'Price',
    'Quantity',
    'Total',
  ]) {
    expect(screen.getByRole('columnheader', { name })).toBeInTheDocument()
  }

  const first = row('Essence Mascara')
  expect(first.getByText('$9.99')).toBeInTheDocument()
  expect(first.getByText('$11.16')).toBeInTheDocument()
  expect(first.getByText('You Save: $1.17')).toBeInTheDocument()
  expect(first.getByText('2')).toBeInTheDocument()
  expect(first.getByText('$19.98')).toBeInTheDocument()

  const second = row('Calvin Klein')
  expect(second.getAllByText('$49.99')).toHaveLength(2) // unit price and row total
  expect(second.getByText('You Save: $0.96')).toBeInTheDocument()

  expect(screen.getByText('Total Price: $69.97')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Checkout' })).toHaveAttribute(
    'href',
    '/checkout',
  )
  expect(badge()).toHaveTextContent('3')
})

test('increase and decrease update the totals and the badge', async () => {
  const user = userEvent.setup()
  seedCart([mascara, perfume])
  renderApp('/cart')

  await user.click(
    row('Essence Mascara').getByRole('button', { name: 'Increase quantity' }),
  )
  expect(row('Essence Mascara').getByText('$29.97')).toBeInTheDocument()
  expect(screen.getByText('Total Price: $79.96')).toBeInTheDocument()
  expect(badge()).toHaveTextContent('4')

  await user.click(
    row('Essence Mascara').getByRole('button', { name: 'Decrease quantity' }),
  )
  expect(screen.getByText('Total Price: $69.97')).toBeInTheDocument()
  expect(badge()).toHaveTextContent('3')
})

test('quantity cannot go below 1', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/cart')

  const decrease = () =>
    row('Essence Mascara').getByRole('button', { name: 'Decrease quantity' })
  expect(decrease()).toBeEnabled()
  await user.click(decrease())

  expect(decrease()).toBeDisabled()
  await user.click(decrease())
  expect(row('Essence Mascara').getAllByText('$9.99')).toHaveLength(2) // unit price and row total
  expect(screen.getByText('Total Price: $9.99')).toBeInTheDocument()
  expect(badge()).toHaveTextContent('1')
})

test('removing an item updates the totals; removing the last shows the empty cart', async () => {
  const user = userEvent.setup()
  seedCart([mascara, perfume])
  renderApp('/cart')

  await user.click(
    row('Essence Mascara').getByRole('button', { name: 'Remove' }),
  )
  expect(screen.queryByText('Essence Mascara Lash Princess')).toBeNull()
  expect(screen.getByText('Total Price: $49.99')).toBeInTheDocument()
  expect(badge()).toHaveTextContent('1')

  await user.click(row('Calvin Klein').getByRole('button', { name: 'Remove' }))
  expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
  expect(
    screen.getByText("You haven't added any items to your cart yet."),
  ).toBeInTheDocument()
  expect(badge()).toBeNull()
})

test('an empty cart shows the empty message and no checkout button', () => {
  renderApp('/cart')

  expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
  expect(
    screen.getByText("You haven't added any items to your cart yet."),
  ).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Checkout' })).toBeNull()
  expect(badge()).toBeNull()
})

test('changes are saved so the cart survives a refresh', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  const first = renderApp('/cart')
  await user.click(
    row('Essence Mascara').getByRole('button', { name: 'Increase quantity' }),
  )
  first.unmount()

  renderApp('/cart')
  expect(row('Essence Mascara').getByText('$29.97')).toBeInTheDocument()
  expect(badge()).toHaveTextContent('3')
})

test('corrupted storage starts with an empty cart instead of crashing', () => {
  localStorage.setItem(CART_KEY, '{not json')
  renderApp('/cart')

  expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
})

test('unusable storage starts with an empty cart and still works', () => {
  const original = Storage.prototype.getItem
  Storage.prototype.getItem = () => {
    throw new Error('storage blocked')
  }
  try {
    renderApp('/cart')
    expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
  } finally {
    Storage.prototype.getItem = original
  }
})

test('the cart keeps working when saving to storage fails', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  const original = Storage.prototype.setItem
  Storage.prototype.setItem = () => {
    throw new Error('quota exceeded')
  }
  try {
    renderApp('/cart')
    await user.click(
      row('Essence Mascara').getByRole('button', { name: 'Increase quantity' }),
    )
    expect(screen.getByText('Total Price: $29.97')).toBeInTheDocument()
    expect(badge()).toHaveTextContent('3')
  } finally {
    Storage.prototype.setItem = original
  }
})

test('stored items with the wrong shape are ignored', () => {
  seedCart([mascara, { id: 'x', title: 5 }])
  renderApp('/cart')

  expect(screen.getByText('Total Price: $19.98')).toBeInTheDocument()
  expect(badge()).toHaveTextContent('2')
})
