import type { Review } from '../../shared/api/types.ts'
import { MAX_STARS } from '../../shared/pricing/pricing.ts'
import { Stars } from '../../shared/ui/Stars.tsx'
import { formatReviewDate } from './formatReviewDate.ts'

type Tone = 'high' | 'mid' | 'low'

const toneClass: Record<Tone, string> = {
  high: 'bg-bar-high',
  mid: 'bg-bar-mid',
  low: 'bg-bar-low',
}

/** 5 and 4 stars are green, 3 is yellow, 2 and 1 are red. */
function toneFor(level: number): Tone {
  if (level >= 4) return 'high'
  if (level === 3) return 'mid'
  return 'low'
}

function countAt(reviews: Review[], level: number): number {
  return reviews.filter((r) => Math.round(r.rating) === level).length
}

function RatingBar({ level, reviews }: { level: number; reviews: Review[] }) {
  const count = countAt(reviews, level)
  const share = reviews.length ? (count / reviews.length) * 100 : 0
  const tone = toneFor(level)
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 font-bold">{level} ★</span>
      <div
        role="meter"
        aria-label={`${level} star reviews`}
        aria-valuemin={0}
        aria-valuemax={reviews.length}
        aria-valuenow={count}
        data-tone={tone}
        className="h-2 flex-1 bg-bar-empty"
      >
        <div
          className={`h-full ${toneClass[tone]}`}
          style={{ width: `${share}%` }}
        />
      </div>
      <span className="w-6 text-right text-muted">{count}</span>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article
      aria-label={`Review by ${review.reviewerName}`}
      className="flex gap-4 border border-line bg-panel p-4"
    >
      <div className="flex size-[72px] shrink-0 items-center justify-center bg-white text-[32px]">
        {review.reviewerName.charAt(0)}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">{review.reviewerName}</span>
          <span className="text-sm text-muted">
            {formatReviewDate(review.date)}
          </span>
        </div>
        <Stars rating={review.rating} />
        <p className="mt-2 text-sm text-muted">{review.comment}</p>
      </div>
    </article>
  )
}

type ReviewsSectionProps = { rating: number; reviews: Review[] }

export function ReviewsSection({ rating, reviews }: ReviewsSectionProps) {
  const levels = Array.from({ length: MAX_STARS }, (_, i) => MAX_STARS - i)
  return (
    <section className="mt-12 grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-[32px] font-bold">{rating.toFixed(2)}</span>
          <div>
            <Stars rating={rating} />
            <p className="text-muted">Based on {reviews.length} Reviews</p>
          </div>
        </div>
        <hr className="my-4 border-line" />
        <div className="flex flex-col gap-2">
          {levels.map((level) => (
            <RatingBar key={level} level={level} reviews={reviews} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 pt-10">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </section>
  )
}
