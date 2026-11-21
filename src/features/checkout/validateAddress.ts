import type { ShippingAddress } from '../../shared/api/types.ts'

export type AddressErrors = Partial<Record<keyof ShippingAddress, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Trims every field. */
export function trimAddress(values: ShippingAddress): ShippingAddress {
  return {
    address: values.address.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
  }
}

/** Expects trimmed values. Phone is only checked for being non-empty. */
export function validateAddress(values: ShippingAddress): AddressErrors {
  const errors: AddressErrors = {}
  if (!values.address) errors.address = 'Address is required'
  if (!values.email) errors.email = 'Email is required'
  else if (!EMAIL_PATTERN.test(values.email))
    errors.email = 'Enter a valid email address'
  if (!values.phone) errors.phone = 'Phone number is required'
  return errors
}
