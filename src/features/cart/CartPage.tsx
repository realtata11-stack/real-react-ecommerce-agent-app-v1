import { Link } from 'react-router'
import { PageTitleBar } from '../../shared/layout/PageTitleBar.tsx'
import {
  formatMoney,
  originalPriceCents,
  savingsCents,
} from '../../shared/pricing/pricing.ts'
import { useCart, type CartItem } from './cartStore.tsx'

const qtyButton =
  'size-8 bg-line text-base disabled:cursor-not-allowed disabled:text-muted/50'

function CartRow({ item }: { item: CartItem }) {
  const { dispatch } = useCart()
  return (
    <tr className="border-b border-line">
      <td className="px-4 py-4">
        <button
          type="button"
          aria-label="Remove"
          onClick={() => dispatch({ type: 'remove', id: item.id })}
          className="size-6 border border-muted text-sm"
        >
          ×
        </button>
      </td>
      <td className="px-4 py-4">
        <img src={item.thumbnail} alt="" className="size-14 object-contain" />
      </td>
      <td className="px-4 py-4">{item.title}</td>
      <td className="px-4 py-4">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">
            {formatMoney(item.priceCents)}
          </span>
          <s className="text-muted">
            {formatMoney(
              originalPriceCents(item.priceCents, item.discountPercentage),
            )}
          </s>
        </div>
        <div className="font-bold text-primary">
          You Save:{' '}
          {formatMoney(savingsCents(item.priceCents, item.discountPercentage))}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={item.quantity <= 1}
            onClick={() => dispatch({ type: 'decrease', id: item.id })}
            className={qtyButton}
          >
            &lt;
          </button>
          <span className="font-bold">{item.quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => dispatch({ type: 'increase', id: item.id })}
            className={qtyButton}
          >
            &gt;
          </button>
        </div>
      </td>
      <td className="px-4 py-4">
        {formatMoney(item.priceCents * item.quantity)}
      </td>
    </tr>
  )
}

export function CartPage() {
  const { items, totalCents } = useCart()

  return (
    <>
      <PageTitleBar title="Cart" />
      <div className="mx-auto max-w-content px-4 py-8">
        {items.length === 0 ? (
          <div className="py-4 text-center">
            <h2 className="text-3xl font-bold">Your Cart is Empty</h2>
            <p className="mt-8 text-xl text-muted">
              You haven't added any items to your cart yet.
            </p>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead className="bg-panel">
                <tr>
                  {[
                    'Action',
                    'Image',
                    'Product Name',
                    'Price',
                    'Quantity',
                    'Total',
                  ].map((name) => (
                    <th key={name} className="px-4 py-4 font-bold">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <CartRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex flex-col items-end gap-4 pr-4">
              <p className="text-2xl font-bold">
                Total Price: {formatMoney(totalCents)}
              </p>
              <Link
                to="/checkout"
                className="bg-primary px-5 py-3 text-white hover:bg-primary-hover"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
