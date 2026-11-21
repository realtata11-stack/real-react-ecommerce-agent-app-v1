import { expect, test } from 'vitest'
import {
  discountLabel,
  dollarsToCents,
  formatMoney,
  originalPriceCents,
  savingsCents,
  starCount,
} from './pricing.ts'

test('formats cents as dollars with two decimals', () => {
  expect(formatMoney(999)).toBe('$9.99')
  expect(formatMoney(500)).toBe('$5.00')
  expect(formatMoney(5)).toBe('$0.05')
  expect(formatMoney(0)).toBe('$0.00')
})

test('converts API dollar prices to whole cents without float drift', () => {
  expect(dollarsToCents(9.99)).toBe(999)
  expect(dollarsToCents(19.99)).toBe(1999)
  expect(dollarsToCents(1.005)).toBe(101)
  expect(dollarsToCents(0.1 + 0.2)).toBe(30)
})

test('rounds a rating to the nearest whole star, capped at 5', () => {
  expect(starCount(4.96)).toBe(5)
  expect(starCount(2.56)).toBe(3)
  expect(starCount(2.5)).toBe(3)
  expect(starCount(2.49)).toBe(2)
  expect(starCount(0)).toBe(0)
  expect(starCount(5.4)).toBe(5)
})

test('shows the discount as a whole number', () => {
  expect(discountLabel(10.48)).toBe('10% Off')
  expect(discountLabel(10.5)).toBe('11% Off')
  expect(discountLabel(0.4)).toBe('0% Off')
})

test('derives the original price from the unrounded discount (brief example)', () => {
  // Design 02: $9.99 with ~10.48% off was $11.16.
  expect(originalPriceCents(999, 10.48)).toBe(1116)
  expect(originalPriceCents(1999, 18.01)).toBe(2438)
})

test('original price equals the price when there is no discount', () => {
  expect(originalPriceCents(999, 0)).toBe(999)
})

test('You Save is original minus discounted price per unit', () => {
  expect(savingsCents(999, 10.48)).toBe(117)
  expect(savingsCents(999, 0)).toBe(0)
})
