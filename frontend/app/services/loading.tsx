export default function ServicesLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <div className="h-12 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-4" />
        <div className="h-6 bg-muted animate-pulse rounded-lg w-96 mx-auto" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-10 rounded-3xl">
            <div className="mb-8 h-16 w-16 bg-muted animate-pulse rounded-2xl" />
            <div className="h-8 bg-muted animate-pulse rounded w-3/4 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
