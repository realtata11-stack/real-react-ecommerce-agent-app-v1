import { MAX_STARS, starCount } from '../pricing/pricing.ts'

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className="text-star"
    >
      <path
        d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.7 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Five stars, rounded to whole stars. Empty stars are outlines. */
export function Stars({ rating }: { rating: number }) {
  const filled = starCount(rating)
  return (
    <span
      role="img"
      aria-label={`${filled} out of 5 stars`}
      className="inline-flex gap-0.5"
    >
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <Star key={i} filled={i < filled} />
      ))}
    </span>
  )
}
