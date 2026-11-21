import { useState } from 'react'
import type { ShippingAddress } from '../../shared/api/types.ts'
import {
  trimAddress,
  validateAddress,
  type AddressErrors,
} from './validateAddress.ts'

const inputClass = 'block w-full border border-line bg-white px-4 py-3'

function Field({
  label,
  error,
  ...input
}: {
  label: string
  error?: string
} & Omit<React.ComponentProps<'input'>, 'className'>) {
  return (
    <div>
      <label className="mb-1 block">
        {label}
        <input
          {...input}
          aria-invalid={error ? true : undefined}
          className={`${inputClass} mt-2`}
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
}

/**
 * Collects the shipping address. A valid Submit reports the trimmed address
 * through `onSave`; editing afterwards reports `null` (not saved anymore).
 */
export function AddressForm({
  saved,
  onSave,
}: {
  saved: ShippingAddress | null
  onSave: (address: ShippingAddress | null) => void
}) {
  const [values, setValues] = useState<ShippingAddress>({
    address: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<AddressErrors>({})

  function change(key: keyof ShippingAddress, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    if (saved) onSave(null)
  }

  return (
    <>
      {saved && (
        <div data-testid="saved-address" className="mb-6">
          <p>
            <strong>Address</strong> : {saved.address}
          </p>
          <p>
            <strong>email</strong> : {saved.email}
          </p>
          <p>
            <strong>phone</strong> : {saved.phone}
          </p>
        </div>
      )}
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          const trimmed = trimAddress(values)
          const found = validateAddress(trimmed)
          setErrors(found)
          if (Object.keys(found).length === 0) onSave(trimmed)
        }}
      >
        <Field
          label="Address"
          placeholder="Enter Address"
          value={values.address}
          error={errors.address}
          onChange={(e) => change('address', e.target.value)}
        />
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field
            label="Email"
            type="email"
            placeholder="Enter Email"
            value={values.email}
            error={errors.email}
            onChange={(e) => change('email', e.target.value)}
          />
          <Field
            label="Phone Number"
            type="tel"
            placeholder="Enter Phone Number"
            value={values.phone}
            error={errors.phone}
            onChange={(e) => change('phone', e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-primary px-5 py-3 font-bold text-white hover:bg-primary-hover"
        >
          Submit
        </button>
      </form>
    </>
  )
}
