"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ImagePreviews = ({ images }: ImagePreviewsProps) => {
  const [currentIndex, setCurrentImageIndex] = useState(0);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return <div className="relative w-full h-[450px]">
    {images.map((image, index) => (
        <div
        key={image}
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
        }`}
        >
            <Image
            src={image}
            alt={`Property Image ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover cursor-pointer transition-transform duration-500 ease-in-out"
            />

        </div>
    ))}
    <button
    onClick={handlePrev}
    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary-700/50 rounded-full focus:outline-none focus:ring focus:ring-secondary-300"
    aria-label="Previous Image"
    >
        <ChevronLeft className="text-white" />
    </button>
    <button
    onClick={handleNext}
    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary-700/50 rounded-full focus:outline-none focus:ring focus:ring-secondary-300"
    aria-label="Previous Image"
    >
        <ChevronRight className="text-white" />
    </button>
  </div>;
};

export default ImagePreviews;
