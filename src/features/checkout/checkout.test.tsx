import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { renderApp, stubFetch } from '../../test/renderApp.tsx'
import { CART_STORAGE_KEY as CART_KEY } from '../cart/cartStore.tsx'

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

const field = (name: string) => screen.getByRole('textbox', { name })
const placeOrder = () => screen.getByRole('button', { name: 'Place Order' })
const submit = () => screen.getByRole('button', { name: 'Submit' })

async function fillAddress(user: ReturnType<typeof userEvent.setup>) {
  await user.type(field('Address'), '99 Sukhumvit Road, Bangkok 10110')
  await user.type(field('Email'), 'customer@example.com')
  await user.type(field('Phone Number'), '0812345678')
}

async function saveAddress(user: ReturnType<typeof userEvent.setup>) {
  await fillAddress(user)
  await user.click(submit())
}

test('an empty cart redirects /checkout to the cart page', () => {
  renderApp('/checkout')

  expect(screen.getByRole('heading', { level: 1, name: 'Cart' })).toBeVisible()
  expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument()
})

test('shows the order summary and billing summary with standard delivery', () => {
  seedCart([mascara, perfume])
  renderApp('/checkout')

  expect(
    screen.getByRole('heading', { level: 1, name: 'Checkout' }),
  ).toBeInTheDocument()
  for (const name of [
    'Shipping Address',
    'Delivery Options',
    'Payment Options',
    'Summary Order',
    'Billing Summary',
  ]) {
    expect(screen.getByRole('heading', { name })).toBeInTheDocument()
  }
  expect(
    screen.getByText(
      'For a better experience, verify your goods and choose your shipping option.',
    ),
  ).toBeInTheDocument()

  expect(screen.getByText('Essence Mascara Lash Princess')).toBeInTheDocument()
  expect(screen.getByText('$9.99 X 2')).toBeInTheDocument()
  expect(screen.getByText('$19.98')).toBeInTheDocument()
  expect(screen.getByText('$49.99 X 1')).toBeInTheDocument()

  expect(screen.getByTestId('sub-total')).toHaveTextContent('$69.97')
  expect(screen.getByTestId('shipping')).toHaveTextContent('$5.99')
  expect(screen.getByTestId('total')).toHaveTextContent('$75.96')
})

test('delivery and payment options have the right defaults and descriptions', () => {
  seedCart([mascara])
  renderApp('/checkout')

  expect(
    screen.getByRole('radio', {
      name: /Standard Delivery \| Approx 5 to 7 Days/,
    }),
  ).toBeChecked()
  expect(
    screen.getByRole('radio', { name: /Express Delivery \| Approx 1 - 2 Days/ }),
  ).not.toBeChecked()
  expect(screen.getByRole('radio', { name: /Cash on Delivery/ })).toBeChecked()
  expect(
    screen.getByText('Pay cash when your order is delivered.'),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('radio', { name: /Bank Transfer/ }),
  ).not.toBeChecked()
  expect(
    screen.getByText('Pay directly from your bank account.'),
  ).toBeInTheDocument()
})

test('choosing express delivery changes shipping and the total', async () => {
  const user = userEvent.setup()
  seedCart([mascara, perfume])
  renderApp('/checkout')

  await user.click(screen.getByRole('radio', { name: /Express Delivery/ }))

  expect(screen.getByTestId('shipping')).toHaveTextContent('$15.99')
  expect(screen.getByTestId('total')).toHaveTextContent('$85.96')
  expect(screen.getByTestId('sub-total')).toHaveTextContent('$69.97')
})

test('submitting an empty form shows every error and keeps Place Order locked', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/checkout')

  await user.click(submit())

  expect(screen.getByText('Address is required')).toBeInTheDocument()
  expect(screen.getByText('Email is required')).toBeInTheDocument()
  expect(screen.getByText('Phone number is required')).toBeInTheDocument()
  expect(placeOrder()).toBeDisabled()
})

test('whitespace-only fields count as empty', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/checkout')

  await user.type(field('Address'), '   ')
  await user.type(field('Email'), '  ')
  await user.type(field('Phone Number'), ' ')
  await user.click(submit())

  expect(screen.getByText('Address is required')).toBeInTheDocument()
  expect(screen.getByText('Email is required')).toBeInTheDocument()
  expect(screen.getByText('Phone number is required')).toBeInTheDocument()
})

test('an invalid email shows its own message and phone is only checked for empty', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/checkout')

  await user.type(field('Address'), '99 Sukhumvit Road')
  await user.type(field('Email'), 'not-an-email')
  await user.type(field('Phone Number'), 'abc')
  await user.click(submit())

  expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
  expect(screen.queryByText('Address is required')).toBeNull()
  expect(screen.queryByText('Phone number is required')).toBeNull()
  expect(placeOrder()).toBeDisabled()
})

test('error messages use the warning colour', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/checkout')

  await user.click(submit())

  expect(screen.getByText('Address is required')).toHaveClass('text-danger')
})

test('a valid submit saves the address, shows it above the form and unlocks Place Order', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/checkout')

  await saveAddress(user)

  expect(screen.getByTestId('saved-address')).toHaveTextContent(
    'Address : 99 Sukhumvit Road, Bangkok 10110',
  )
  expect(screen.getByTestId('saved-address')).toHaveTextContent(
    'email : customer@example.com',
  )
  expect(screen.getByTestId('saved-address')).toHaveTextContent(
    'phone : 0812345678',
  )
  expect(placeOrder()).toBeEnabled()
})

test('editing the form after saving locks Place Order until Submit is pressed again', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/checkout')

  await saveAddress(user)
  await user.type(field('Phone Number'), '9')

  expect(placeOrder()).toBeDisabled()
  expect(screen.queryByTestId('saved-address')).toBeNull()

  await user.click(submit())
  expect(placeOrder()).toBeEnabled()
  expect(screen.getByTestId('saved-address')).toHaveTextContent('08123456789')
})

test('the saved address is trimmed', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  renderApp('/checkout')

  await user.type(field('Address'), '  12 Main St  ')
  await user.type(field('Email'), ' a@b.co ')
  await user.type(field('Phone Number'), ' 0812345678 ')
  await user.click(submit())

  expect(screen.getByTestId('saved-address')).toHaveTextContent(
    'Address : 12 Main St',
  )
  expect(screen.getByTestId('saved-address').textContent).not.toMatch(/ {2}/)
})

test('placing an order sends exactly the agreed body, clears the cart and shows the success page', async () => {
  const user = userEvent.setup()
  seedCart([mascara, perfume])
  const fetchStub = stubFetch({
    '/carts/add': { id: 51, userId: 1, products: [] },
  })
  renderApp('/checkout')

  await screen.findByTestId('total')
  await user.click(screen.getByRole('radio', { name: /Express Delivery/ }))
  await user.click(screen.getByRole('radio', { name: /Bank Transfer/ }))
  await saveAddress(user)
  await user.click(placeOrder())

  expect(
    await screen.findByRole('heading', {
      level: 1,
      name: 'ORDER PLACED SUCCESSFULLY!',
    }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('Your order has been successfully placed and is on its way.'),
  ).toBeInTheDocument()
  expect(screen.queryByTestId('cart-badge')).toBeNull()
  expect(JSON.parse(localStorage.getItem(CART_KEY) ?? 'null')).toEqual([])

  const call = fetchStub.mock.calls.find(([url]) =>
    String(url).endsWith('/carts/add'),
  )
  expect(call).toBeDefined()
  const init = call![1]!
  expect(init.method).toBe('POST')
  expect(new Headers(init.headers).get('Content-Type')).toBe('application/json')
  expect(JSON.parse(String(init.body))).toStrictEqual({
    userId: 1,
    products: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ],
    address: {
      address: '99 Sukhumvit Road, Bangkok 10110',
      email: 'customer@example.com',
      phone: '0812345678',
    },
  })
})

test('Place Order is disabled while the order is being sent so it cannot be double-submitted', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  const fetchStub = stubFetch({
    '/carts/add': async () => {
      await gate
      return { id: 51 }
    },
  })
  renderApp('/checkout')

  await saveAddress(user)
  await user.click(placeOrder())

  await waitFor(() => expect(placeOrder()).toBeDisabled())
  await user.click(placeOrder())
  release()

  await screen.findByRole('heading', { name: 'ORDER PLACED SUCCESSFULLY!' })
  const posts = fetchStub.mock.calls.filter(([url]) =>
    String(url).endsWith('/carts/add'),
  )
  expect(posts).toHaveLength(1)
})

test('a failed order shows an error, keeps the cart and can be retried', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  let attempts = 0
  stubFetch({
    '/carts/add': () => {
      attempts += 1
      return attempts === 1
        ? new Response('{}', { status: 500 })
        : { id: 51 }
    },
  })
  renderApp('/checkout')

  await saveAddress(user)
  await user.click(placeOrder())

  expect(await screen.findByRole('alert')).toHaveTextContent(
    "We couldn't place your order. Please try again.",
  )
  expect(
    screen.getByRole('heading', { level: 1, name: 'Checkout' }),
  ).toBeInTheDocument()
  expect(screen.getByTestId('cart-badge')).toHaveTextContent('2')
  expect(JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')).toHaveLength(1)
  expect(placeOrder()).toBeEnabled()

  await user.click(placeOrder())
  expect(
    await screen.findByRole('heading', { name: 'ORDER PLACED SUCCESSFULLY!' }),
  ).toBeInTheDocument()
})

test('a network error is reported the same way', async () => {
  const user = userEvent.setup()
  seedCart([mascara])
  stubFetch({
    '/carts/add': () => {
      throw new TypeError('Failed to fetch')
    },
  })
  renderApp('/checkout')

  await saveAddress(user)
  await user.click(placeOrder())

  expect(await screen.findByRole('alert')).toHaveTextContent(
    "We couldn't place your order. Please try again.",
  )
  expect(screen.getByTestId('cart-badge')).toHaveTextContent('2')
})

test('opening the success page directly redirects to the home page', () => {
  renderApp('/order-success')

  expect(
    screen.queryByRole('heading', { name: 'ORDER PLACED SUCCESSFULLY!' }),
  ).toBeNull()
  expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
})
