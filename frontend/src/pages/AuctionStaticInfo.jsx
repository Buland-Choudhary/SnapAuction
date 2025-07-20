// src/components/AuctionStaticInfo.jsx
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AuctionStaticInfo({
  auction,
  user,
  onFollowToggle,
  isFollowing,
  followLoading,
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = auction.images || [];

  const status = (() => {
    const now = new Date();
    if (auction.isClosed) return "Closed";
    if (now < auction.startTime) return "Upcoming";
    if (now > auction.endTime) return "Ended";
    return "Live";
  })();

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">{auction.title}</h1>
        <span
          className={`px-4 py-1 rounded-xl text-sm font-semibold shadow-sm ${
            status === "Live"
              ? "bg-green-100 text-green-800"
              : status === "Upcoming"
              ? "bg-blue-100 text-blue-800"
              : status === "Ended"
              ? "bg-red-100 text-red-800"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mt-2">{auction.description}</p>
      <div className="text-xs text-gray-500 mt-1 mb-4">
        Created by <strong>{auction.seller.name}</strong> • Starts:{" "}
        <strong>{auction.startTime.toLocaleString()}</strong> • Ends:{" "}
        <strong>{auction.endTime.toLocaleString()}</strong>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="relative w-full overflow-hidden my-6">
          <div className="flex items-center justify-center relative h-72 md:h-96">
            {/* Left faded preview */}
            {images.length > 1 && (
              <img
                src={images[(currentImage - 1 + images.length) % images.length]?.url}
                alt="Preview Left"
                className="absolute left-0 h-3/4 w-1/4 object-cover opacity-30 scale-90"
              />
            )}

            {/* Main image */}
            <img
              src={images[currentImage].url}
              alt={`Auction Image ${currentImage + 1}`}
              className="h-full object-contain rounded-xl z-10"
            />

            {/* Right faded preview */}
            {images.length > 1 && (
              <img
                src={images[(currentImage + 1) % images.length]?.url}
                alt="Preview Right"
                className="absolute right-0 h-3/4 w-1/4 object-cover opacity-30 scale-90"
              />
            )}

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-20"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-20"
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auction Details */}
      <div className="bg-gray-50 border rounded-xl p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 font-semibold">Base Price</p>
          <p className="font-medium text-gray-800">${auction.basePrice}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">Current Price</p>
          <p className="font-medium text-gray-800">${auction.currentPrice}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">Min Increment</p>
          <p className="font-medium text-gray-800">${auction.minIncrement}</p>
        </div>
        {auction.maxIncrement && (
          <div>
            <p className="text-sm text-gray-600 font-semibold">Max Increment</p>
            <p className="font-medium text-gray-800">${auction.maxIncrement}</p>
          </div>
        )}
        {auction.winner && (
          <div>
            <p className="text-sm text-gray-600 font-semibold">Winner</p>
            <p className="font-medium text-gray-800">{auction.winner.name}</p>
          </div>
        )}
      </div>

      {/* Followers */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Followers</h2>
        <p className="text-gray-600">
          {auction.follows.length} user(s) following this auction
        </p>

        {user && auction.sellerId !== user.id && (
          <button
            onClick={onFollowToggle}
            disabled={followLoading}
            className={`mt-3 px-6 py-2 rounded-xl text-white font-semibold ${
              isFollowing ? "bg-gray-600" : "bg-yellow-500"
            }`}
          >
            {isFollowing ? "Unfollow Auction" : "Follow Auction"}
          </button>
        )}
      </div>
    </>
  );
}
