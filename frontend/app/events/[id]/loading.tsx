export default function EventDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <div className="h-full bg-muted animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="h-10 bg-muted animate-pulse rounded-lg w-3/4" />

          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          </div>

          <div className="h-12 bg-muted animate-pulse rounded-lg w-40" />
        </div>
      </div>
    </div>
  )
}
