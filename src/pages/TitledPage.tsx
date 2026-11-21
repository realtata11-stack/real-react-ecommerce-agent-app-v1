import { PageTitleBar } from '../shared/layout/PageTitleBar.tsx'

/** A page that is only a title bar for now; later tickets fill in the body. */
export function TitledPage({ title }: { title: string }) {
  return (
    <>
      <PageTitleBar title={title} />
      <div className="mx-auto max-w-content px-4 py-8" />
    </>
  )
}
