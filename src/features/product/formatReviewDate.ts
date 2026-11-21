/** "2025-04-30T09:41:02.000Z" -> "30 April 2025" (UTC, so it never shifts). */
export function formatReviewDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso))
}
