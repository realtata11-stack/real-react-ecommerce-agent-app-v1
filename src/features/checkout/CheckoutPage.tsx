import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { usePlaceOrder } from '../../shared/api/queries.ts'
import type { ShippingAddress } from '../../shared/api/types.ts'
import { PageTitleBar } from '../../shared/layout/PageTitleBar.tsx'
import { formatMoney } from '../../shared/pricing/pricing.ts'
import { ErrorMessage } from '../../shared/ui/ErrorMessage.tsx'
import { useCart } from '../cart/cartStore.tsx'
import { AddressForm } from './AddressForm.tsx'
import {
  DELIVERY_OPTIONS,
  PAYMENT_OPTIONS,
  type DeliveryOption,
  type PaymentOption,
} from './options.ts'

function Box({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-5 bg-panel p-5">
      <h2 className="border-b border-muted pb-4 text-xl font-bold">{title}</h2>
      <div className="pt-4">{children}</div>
    </section>
  )
}

function RadioOption({
  group,
  option,
  checked,
  onSelect,
}: {
  group: string
  option: DeliveryOption | PaymentOption
  checked: boolean
  onSelect: () => void
}) {
  const isDelivery = 'priceCents' in option
  return (
    <label className="mb-2 flex cursor-pointer items-start gap-2">
      <input
        type="radio"
        name={group}
        checked={checked}
        onChange={onSelect}
        className="mt-1.5 accent-primary"
      />
      {isDelivery ? (
        <span>
          {option.name} | {option.description}
        </span>
      ) : (
        <span>
          {option.name}
          <span className="block text-muted">{option.description}</span>
        </span>
      )}
    </label>
  )
}

function BillingRow({
  label,
  cents,
  testId,
}: {
  label: string
  cents: number
  testId: string
}) {
  return (
    <div className="flex justify-between py-1 text-lg text-muted">
      <span>{label}</span>
      <span data-testid={testId} className="text-primary">
        {formatMoney(cents)}
      </span>
    </div>
  )
}

export function CheckoutPage() {
  const { items, totalCents, dispatch } = useCart()
  const navigate = useNavigate()
  const order = usePlaceOrder()
  const [saved, setSaved] = useState<ShippingAddress | null>(null)
  const [deliveryId, setDeliveryId] = useState<DeliveryOption['id']>('standard')
  const [paymentId, setPaymentId] = useState<PaymentOption['id']>('cod')
  // Set once the order is placed so clearing the cart does not bounce us to /cart.
  const [placed, setPlaced] = useState(false)

  if (items.length === 0 && !placed) return <Navigate to="/cart" replace />

  const delivery = DELIVERY_OPTIONS.find((o) => o.id === deliveryId)!
  const grandTotalCents = totalCents + delivery.priceCents

  function placeOrder() {
    if (!saved) return
    order.mutate(
      {
        products: items.map(({ id, quantity }) => ({ id, quantity })),
        address: saved,
      },
      {
        onSuccess: () => {
          setPlaced(true)
          dispatch({ type: 'clear' })
          navigate('/order-success', {
            replace: true,
            state: { orderPlaced: true },
          })
        },
      },
    )
  }

  return (
    <>
      <PageTitleBar title="Checkout" />
      <div className="mx-auto flex max-w-content items-start gap-5 px-4 py-12">
        <div className="w-3/5">
          <Box title="Shipping Address">
            <AddressForm saved={saved} onSave={setSaved} />
          </Box>
          <Box title="Delivery Options">
            {DELIVERY_OPTIONS.map((option) => (
              <RadioOption
                key={option.id}
                group="delivery"
                option={option}
                checked={option.id === deliveryId}
                onSelect={() => setDeliveryId(option.id)}
              />
            ))}
          </Box>
          <Box title="Payment Options">
            {PAYMENT_OPTIONS.map((option) => (
              <RadioOption
                key={option.id}
                group="payment"
                option={option}
                checked={option.id === paymentId}
                onSelect={() => setPaymentId(option.id)}
              />
            ))}
          </Box>
        </div>

        <div className="w-2/5">
          <section className="mb-5 bg-panel p-5">
            <h2 className="text-xl font-bold">Summary Order</h2>
            <p className="mt-1 border-b border-muted pb-4 text-sm text-muted">
              For a better experience, verify your goods and choose your
              shipping option.
            </p>
            <ul className="pt-4">
              {items.map((item) => (
                <li key={item.id} className="mb-4 flex items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="size-12 object-contain"
                  />
                  <div className="flex-1">
                    <p>{item.title}</p>
                    <p className="text-sm text-muted">
                      {formatMoney(item.priceCents)} X {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-primary">
                    {formatMoney(item.priceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-panel p-5">
            <h2 className="border-b border-muted pb-4 text-xl font-bold">
              Billing Summary
            </h2>
            <div className="border-b border-muted py-4">
              <BillingRow
                label="Sub Total"
                cents={totalCents}
                testId="sub-total"
              />
              <BillingRow
                label="Shipping"
                cents={delivery.priceCents}
                testId="shipping"
              />
            </div>
            <div className="flex items-baseline justify-between py-4 text-2xl font-bold">
              <span>Total</span>
              <span data-testid="total" className="text-3xl text-primary">
                {formatMoney(grandTotalCents)}
              </span>
            </div>
            {order.isError && (
              <ErrorMessage message="We couldn't place your order. Please try again." />
            )}
            <button
              type="button"
              disabled={!saved || order.isPending}
              onClick={placeOrder}
              className="w-full bg-primary px-5 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary"
            >
              Place Order
            </button>
          </section>
        </div>
      </div>
    </>
  )
}
