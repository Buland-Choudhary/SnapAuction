const AuctionCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
        
        {/* Status Badge Skeleton */}
        <div className="absolute top-3 right-3">
          <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Heart Button Skeleton */}
        <div className="absolute top-3 left-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* Price Section Skeleton */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-300 rounded w-20"></div>
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </div>
        </div>

        {/* Info Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="space-y-1 flex-1">
                <div className="h-2 bg-gray-300 rounded w-12"></div>
                <div className="h-3 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
          
          <div className="p-2 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="space-y-1 flex-1">
                <div className="h-2 bg-gray-300 rounded w-12"></div>
                <div className="h-3 bg-gray-300 rounded w-8"></div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button Skeleton */}
        <div className="h-10 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
};

const AuctionGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </div>
  );
};

export { AuctionCardSkeleton, AuctionGridSkeleton };
