import { useState } from 'react'
import { useParams } from 'react-router'
import { useProduct } from '../../shared/api/queries.ts'
import type { ProductDetail } from '../../shared/api/types.ts'
import { PageTitleBar } from '../../shared/layout/PageTitleBar.tsx'
import { CartIcon } from '../../shared/ui/CartIcon.tsx'
import { ErrorMessage } from '../../shared/ui/ErrorMessage.tsx'
import { Price } from '../../shared/ui/Price.tsx'
import { Spinner } from '../../shared/ui/Spinner.tsx'
import { Stars } from '../../shared/ui/Stars.tsx'
import { useCart } from '../cart/cartStore.tsx'
import { AddedToCartModal } from './AddedToCartModal.tsx'
import { ImageGallery } from './ImageGallery.tsx'
import { ReviewsSection } from './ReviewsSection.tsx'

function ProductDetails({ product }: { product: ProductDetail }) {
  const { dispatch } = useCart()
  const [added, setAdded] = useState(false)
  const images = product.images.length ? product.images : [product.thumbnail]

  const addToCart = () => {
    dispatch({
      type: 'add',
      item: {
        id: product.id,
        title: product.title,
        priceCents: product.priceCents,
        thumbnail: product.thumbnail,
        discountPercentage: product.discountPercentage,
      },
    })
    setAdded(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        <ImageGallery title={product.title} images={images} />
        <div>
          <h2 className="text-[32px] font-bold">{product.title}</h2>
          {product.brand && <p className="mt-2 text-muted">{product.brand}</p>}
          <div className="mt-3 flex items-center gap-2">
            <Stars rating={product.rating} />
            <span className="text-muted">{product.reviewCount} Reviews</span>
          </div>
          <div className="mt-4">
            <Price
              size="detail"
              priceCents={product.priceCents}
              discountPercentage={product.discountPercentage}
            />
          </div>
          <p className="mt-4 text-muted">{product.description}</p>
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={addToCart}
            className="mt-6 flex cursor-pointer items-center gap-2 bg-primary px-6 py-3 text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CartIcon size={18} />
            Add To Cart
          </button>
          <h3 className="mt-8 font-bold">Product Info:</h3>
          <ul className="mt-2 list-disc pl-6 text-muted">
            <li>SKU: {product.sku}</li>
            <li>Quantity: {product.stock} left</li>
            <li>Stock Status: {product.stockStatus}</li>
          </ul>
          <h3 className="mt-6 font-bold">Delivery Details:</h3>
          <ul className="mt-2 list-disc pl-6 text-muted">
            <li>{product.shippingInformation}</li>
            <li>{product.warrantyInformation}</li>
          </ul>
        </div>
      </div>
      <ReviewsSection rating={product.rating} reviews={product.reviews} />
      {added && <AddedToCartModal onClose={() => setAdded(false)} />}
    </>
  )
}

export function ProductDetailPage() {
  const { id = '' } = useParams()
  const product = useProduct(id)

  return (
    <>
      <PageTitleBar title={product.data?.title ?? 'Product Details'} />
      <div className="mx-auto max-w-content px-4 py-12">
        {product.isError ? (
          <ErrorMessage message="We couldn't load this product. Please try again." />
        ) : !product.data ? (
          <Spinner />
        ) : (
          <ProductDetails key={product.data.id} product={product.data} />
        )}
      </div>
    </>
  )
}
