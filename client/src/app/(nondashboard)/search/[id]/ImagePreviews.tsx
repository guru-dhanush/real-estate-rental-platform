"use client";

import { ChevronLeft, ChevronRight, X as CloseIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ImagePreviewsProps {
  images: string[];
}

const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setFullscreen(true);
  };

  const handleCloseFullscreen = () => setFullscreen(false);

  return (
    <div className="relative w-full rounded-2xl">
      {/* Desktop/Tablet Layout: Large image on left, two stacked on right */}
      <div className="hidden md:flex gap-2 lg:gap-4 h-[300px] sm:h-[400px] lg:h-[450px]">
        {/* Main Large Image - Left Side */}
        <div className="relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden group cursor-pointer">
          <Image
            src={images[0]}
            alt="Main Property Image"
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => handleImageClick(0)}
          />
          {/* Image counter overlay */}
          <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 bg-black/70 text-white px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs lg:text-sm font-medium">
            1 / {images.length}
          </div>
        </div>

        {/* Right Side - Two Stacked Images */}
        <div className="flex flex-col gap-2 lg:gap-4 w-48 lg:w-64">
          {/* Top Image */}
          {images[1] && (
            <div className="relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden group cursor-pointer">
              <Image
                src={images[1]}
                alt="Property Image 2"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => handleImageClick(1)}
              />
              <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                2 / {images.length}
              </div>
            </div>
          )}

          {/* Bottom Image */}
          {images[2] && (
            <div className="relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden group cursor-pointer">
              <Image
                src={images[2]}
                alt="Property Image 3"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onClick={() => handleImageClick(2)}
              />
              <div className="absolute bottom-2 right-2 lg:bottom-3 lg:right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                3 / {images.length}
              </div>
              {/* Show more images indicator if there are more than 3 */}
              {images.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-black/70 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold text-sm lg:text-base">
                    +{images.length - 3} more
                  </div>
                </div>
              )}
            </div>
          )}

          {/* If only 2 images, show placeholder or adjust layout */}
          {!images[2] && images.length === 2 && (
            <div className="flex-1 rounded-xl lg:rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
              <span className="text-xs lg:text-sm">No more images</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout: Single image with navigation */}
      <div className="md:hidden relative">
        <div className="relative h-[250px] xs:h-[300px] rounded-xl overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={`Property Image ${currentImageIndex + 1}`}
            fill
            priority
            className="object-cover cursor-pointer"
            onClick={() => handleImageClick(currentImageIndex)}
          />

          {/* Navigation buttons for mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full focus:outline-none z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="text-white w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full focus:outline-none z-10"
                aria-label="Next image"
              >
                <ChevronRight className="text-white w-4 h-4" />
              </button>
            </>
          )}

          {/* Image counter for mobile */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Dots indicator for mobile */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile thumbnail strip below main image */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((image, idx) => (
              <div
                key={image}
                className={`relative w-16 h-12 flex-shrink-0 rounded cursor-pointer border-2 transition-all ${idx === currentImageIndex ? "border-blue-500" : "border-transparent"
                  }`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal with slider */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
          {/* Close button */}
          <button
            onClick={handleCloseFullscreen}
            className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50 bg-black/60 p-2 lg:p-3 rounded-full hover:bg-black/80 transition-colors"
            aria-label="Close full screen"
          >
            <CloseIcon className="text-white w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 lg:left-10 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 lg:p-3 rounded-full hover:bg-black/80 transition-colors z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="text-white w-6 h-6 lg:w-8 lg:h-8" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 lg:right-10 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 lg:p-3 rounded-full hover:bg-black/80 transition-colors z-50"
            aria-label="Next image"
          >
            <ChevronRight className="text-white w-6 h-6 lg:w-8 lg:h-8" />
          </button>

          {/* Image counter in fullscreen */}
          <div className="absolute top-4 lg:top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-full z-50">
            <span className="font-medium text-sm lg:text-base">{currentImageIndex + 1} of {images.length}</span>
          </div>

          {/* Main fullscreen image */}
          <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-20">
            <Image
              src={images[currentImageIndex]}
              alt={`Property Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              onClick={handleCloseFullscreen}
            />
          </div>

          {/* Thumbnail strip at bottom */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/60 p-3 rounded-lg max-w-screen-lg overflow-x-auto">
            {images.map((image, idx) => (
              <div
                key={image}
                className={`relative w-16 h-12 rounded cursor-pointer border-2 transition-all ${idx === currentImageIndex ? "border-white" : "border-transparent hover:border-gray-400"
                  }`}
                onClick={() => setCurrentImageIndex(idx)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviews;