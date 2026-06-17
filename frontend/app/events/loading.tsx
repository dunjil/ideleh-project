export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <div className="h-12 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-4" />
        <div className="h-6 bg-muted animate-pulse rounded-lg w-96 mx-auto" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg bg-white shadow-lg dark:bg-gray-800 overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-20 bg-muted animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-10 bg-muted animate-pulse rounded flex-1" />
                <div className="h-10 bg-muted animate-pulse rounded flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
