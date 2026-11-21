import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">404 - Page not found</h1>
      <Link
        to="/"
        className="mt-6 inline-block text-primary hover:text-primary-hover"
      >
        Back to Home
      </Link>
    </div>
  )
}
