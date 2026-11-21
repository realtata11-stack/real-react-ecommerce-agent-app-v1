type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const baseButton = 'min-w-9 border border-line px-3 py-1.5 text-center'

function PageButton({
  label,
  disabled,
  current,
  bold,
  onClick,
}: {
  label: string
  disabled?: boolean
  current?: boolean
  /** Previous and Next are bold; page numbers are regular. */
  bold?: boolean
  onClick: () => void
}) {
  const style = current
    ? 'border-primary bg-primary text-white'
    : 'bg-white disabled:opacity-40'
  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={current ? 'page' : undefined}
      onClick={onClick}
      className={`${baseButton} ${style} ${bold ? 'font-bold' : ''}`}
    >
      {label}
    </button>
  )
}

/** Previous / page numbers / Next. Always rendered, even for one page. */
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <PageButton
        label="Previous"
        bold
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      />
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <PageButton
          key={n}
          label={String(n)}
          current={n === page}
          onClick={() => onPageChange(n)}
        />
      ))}
      <PageButton
        label="Next"
        bold
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  )
}
