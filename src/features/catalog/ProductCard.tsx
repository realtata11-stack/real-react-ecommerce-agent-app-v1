import { useState } from 'react'
import { Link } from 'react-router'
import type { Product } from '../../shared/api/types.ts'
import { Price } from '../../shared/ui/Price.tsx'
import { Stars } from '../../shared/ui/Stars.tsx'

/** Grey box the size of the image until the image has loaded. */
function ProductImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`aspect-square ${loaded ? '' : 'bg-surface'}`}>
      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        className="size-full object-contain"
      />
    </div>
  )
}

/** The whole card is one link: no border, no button. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <ProductImage src={product.thumbnail} />
      <h3 className="mt-2 text-lg font-bold">{product.title}</h3>
      {product.brand && <p className="text-sm text-muted">{product.brand}</p>}
      <div className="mt-1 flex items-center gap-2">
        <Stars rating={product.rating} />
        <span className="text-xs text-muted">({product.reviewCount})</span>
      </div>
      <div className="mt-2">
        <Price
          priceCents={product.priceCents}
          discountPercentage={product.discountPercentage}
        />
      </div>
    </Link>
  )
}
