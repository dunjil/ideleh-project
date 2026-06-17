export default function ProjectsLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <div className="h-12 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-4" />
        <div className="h-6 bg-muted animate-pulse rounded-lg w-96 mx-auto" />
      </div>

      <div className="space-y-24">
        {[1, 2, 3].map((i) => (
          <div key={i} className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
              <div className="h-12 bg-muted animate-pulse rounded-lg w-48 mt-6" />
            </div>
            <div className="h-[400px] bg-muted animate-pulse rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
