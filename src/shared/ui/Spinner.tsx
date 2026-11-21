/** Loading indicator, as in the loading-state design. */
export function Spinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex justify-center py-4"
    >
      <div className="size-8 animate-spin rounded-full border-2 border-text border-t-transparent" />
    </div>
  )
}
