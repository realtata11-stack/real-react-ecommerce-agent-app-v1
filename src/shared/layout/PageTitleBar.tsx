export function PageTitleBar({ title }: { title: string }) {
  return (
    <div className="bg-surface py-6 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  )
}
