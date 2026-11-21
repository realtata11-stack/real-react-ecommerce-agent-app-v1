import {
  discountLabel,
  formatMoney,
  originalPriceCents,
} from '../pricing/pricing.ts'

/** Text size of the main price: 20px on cards, 32px on the detail page. */
const sizeClass = { card: 'text-xl', detail: 'text-3xl' }

type PriceProps = {
  /** Discounted price in whole cents. */
  priceCents: number
  discountPercentage: number
  size?: keyof typeof sizeClass
}

export function Price({
  priceCents,
  discountPercentage,
  size = 'card',
}: PriceProps) {
  return (
    <div className={size === 'detail' ? 'flex items-baseline gap-3' : ''}>
      <div className={sizeClass[size]}>{formatMoney(priceCents)}</div>
      <div className="flex gap-2 text-sm">
        <s className="text-muted">
          {formatMoney(originalPriceCents(priceCents, discountPercentage))}
        </s>
        <span className="text-primary">
          {discountLabel(discountPercentage)}
        </span>
      </div>
    </div>
  )
}
