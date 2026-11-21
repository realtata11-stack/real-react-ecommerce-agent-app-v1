/** Error text, as in the error-state design. */
export function ErrorMessage({
  message = 'Something went wrong. Please try again.',
}: {
  message?: string
}) {
  return (
    <p role="alert" className="py-4 text-center text-lg text-muted">
      {message}
    </p>
  )
}
