export default function ContactLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <div className="h-12 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-4" />
        <div className="h-6 bg-muted animate-pulse rounded-lg w-96 mx-auto" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-8 rounded-2xl">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-muted animate-pulse w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="glass-card p-8 rounded-2xl h-full">
          <div className="flex items-start space-x-4 mb-8">
            <div className="p-3 rounded-xl bg-muted animate-pulse w-12 h-12" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
