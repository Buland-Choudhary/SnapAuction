import { useState, useEffect, useCallback } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  X,
  Maximize2,
  Heart,
  Share2,
  Download
} from "lucide-react";

const AuctionImageGallery = ({ auction }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});

  const images = auction.images?.length > 0 
    ? auction.images 
    : [{ url: `https://picsum.photos/800/600?random=${auction.id}`, alt: auction.title }];

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          setIsFullscreen(false);
          setIsZoomed(false);
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen, nextImage, prevImage]);

  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: auction.title,
          text: `Check out this auction: ${auction.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative group">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
          {/* Loading Skeleton */}
          {!imageLoaded[currentImage] && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
          )}
          
          <img
            src={images[currentImage].url}
            alt={images[currentImage].alt || auction.title}
            className={`w-full h-full object-cover transition-all duration-500 cursor-pointer ${
              imageLoaded[currentImage] ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsFullscreen(true)}
            onLoad={() => handleImageLoad(currentImage)}
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <Heart size={16} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                {currentImage + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300 ${
                index === currentImage 
                  ? 'ring-4 ring-blue-500 shadow-lg scale-105' 
                  : 'hover:ring-2 hover:ring-blue-300 hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-20 h-16 bg-gray-100">
                {!imageLoaded[`thumb-${index}`] && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
                )}
                <img
                  src={image.url}
                  alt={`View ${index + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded[`thumb-${index}`] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => handleImageLoad(`thumb-${index}`)}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsFullscreen(false);
              setIsZoomed(false);
            }}
            className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110 z-10"
          >
            <X size={24} />
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-6 left-6 flex gap-2 z-10">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = images[currentImage].url;
                link.download = `auction-${auction.id}-image-${currentImage + 1}`;
                link.click();
              }}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
            >
              <Download size={20} />
            </button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="max-w-7xl max-h-full p-8">
            <img
              src={images[currentImage].url}
              alt={images[currentImage].alt || auction.title}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-150 cursor-grab' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="text-sm">
                {currentImage + 1} of {images.length} • {auction.title}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionImageGallery;
