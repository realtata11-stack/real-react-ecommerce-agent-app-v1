import { useEffect } from 'react'

/** Centred confirmation over a dimmed page. */
export function AddedToCartModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="added-to-cart-title"
        className="relative border border-line bg-white px-6 py-8 text-center"
      >
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-2 right-3 cursor-pointer text-2xl leading-none"
        >
          ×
        </button>
        <h2 id="added-to-cart-title" className="text-xl font-bold">
          Product Added to Cart
        </h2>
        <p className="mt-2">
          The product has been successfully added to your cart!
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 cursor-pointer bg-primary px-4 py-3 text-white hover:bg-primary-hover"
        >
          Close
        </button>
      </div>
    </div>
  )
}
