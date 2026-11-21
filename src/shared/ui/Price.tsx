import {
  discountLabel,
  dollarsToCents,
  formatMoney,
  originalPriceCents,
} from '../pricing/pricing.ts'

/** Text size of the main price: 20px on cards, 32px on the detail page. */
const sizeClass = { card: 'text-xl', detail: 'text-3xl' }

type PriceProps = {
  /** Price in dollars from the API (already discounted). */
  price: number
  discountPercentage: number
  size?: keyof typeof sizeClass
}

export function Price({
  price,
  discountPercentage,
  size = 'card',
}: PriceProps) {
  const cents = dollarsToCents(price)
  return (
    <div>
      <div className={sizeClass[size]}>{formatMoney(cents)}</div>
      <div className="flex gap-2 text-sm">
        <s className="text-muted">
          {formatMoney(originalPriceCents(cents, discountPercentage))}
        </s>
        <span className="text-primary">
          {discountLabel(discountPercentage)}
        </span>
      </div>
    </div>
  )
}
