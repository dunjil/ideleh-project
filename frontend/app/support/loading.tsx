export default function SupportLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full bg-muted animate-pulse mx-auto mb-6" />
          <div className="h-12 bg-muted animate-pulse rounded-lg w-96 mx-auto mb-4" />
          <div className="h-6 bg-muted animate-pulse rounded-lg w-[500px] mx-auto" />
        </div>

        <div className="glass-card p-10 rounded-3xl mb-8">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <div className="p-3 rounded-xl bg-muted animate-pulse w-12 h-12" />
            <div className="h-8 bg-muted animate-pulse rounded w-64" />
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-muted animate-pulse rounded w-32 mb-2" />
                <div className="h-16 bg-muted animate-pulse rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-muted animate-pulse w-11 h-11" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted animate-pulse rounded w-20" />
                  <div className="h-4 bg-muted animate-pulse rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
