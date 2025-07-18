export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Skeleton untuk Product Card
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 animate-pulse"></div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title Skeleton */}
        <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        {/* Price and Button Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}