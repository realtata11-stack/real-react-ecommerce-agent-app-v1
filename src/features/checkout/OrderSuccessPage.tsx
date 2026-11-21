import { Navigate, useLocation } from 'react-router'

/** Only reachable right after a real order: the checkout sets a navigation-state flag. */
export function OrderSuccessPage() {
  const state = useLocation().state as { orderPlaced?: boolean } | null
  if (!state?.orderPlaced) return <Navigate to="/" replace />

  return (
    <div className="bg-surface py-10 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 72 72"
        className="mx-auto size-18 text-primary"
      >
        <circle cx="36" cy="36" r="36" fill="currentColor" />
        <path
          d="M20 37l11 11 21-23"
          fill="none"
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="mt-5 text-2xl font-bold">ORDER PLACED SUCCESSFULLY!</h1>
      <p className="mt-3 text-lg text-muted">
        Your order has been successfully placed and is on its way.
      </p>
    </div>
  )
}
