export type DeliveryOption = {
  id: 'standard' | 'express'
  name: string
  description: string
  /** Shipping fee in whole cents. */
  priceCents: number
}

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Approx 5 to 7 Days',
    priceCents: 599,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Approx 1 - 2 Days',
    priceCents: 1599,
  },
]

export type PaymentOption = {
  id: 'cod' | 'bank'
  name: string
  description: string
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay cash when your order is delivered.',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Pay directly from your bank account.',
  },
]
