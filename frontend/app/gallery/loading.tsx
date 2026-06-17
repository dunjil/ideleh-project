export default function GalleryLoading() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center mb-16">
        <div className="h-12 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-4" />
        <div className="h-6 bg-muted animate-pulse rounded-lg w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[400px] rounded-3xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  )
}
