import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImage1 from "../../assets/book1.png";
import heroImage2 from "../../assets/book1.png";
import heroImage3 from "../../assets/book1.png";
import { toast } from "react-hot-toast"; // if you want to keep feedback

const images = [heroImage1];

export default function Hero() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentIndex(index);

  const handleClick = () => {
    toast.success("Redirecting to all books ");
    setTimeout(() => navigate("/all"), 800);
  };

  return (
    <div className="relative w-full min-h-[80vh] overflow-hidden font-sans">
      {/* Slides */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out transform ${
            i === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      {/* Hero Text */}
      <div className="relative z-20 flex flex-col justify-center h-full px-6 md:px-16 text-white">
        <div className="max-w-xl mt-44 md:mt-64 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md">
           The BookHub - Books, World of books, Where to buy book
          </h1>
          {/* <p className="text-base md:text-lg font-light text-gray-100 drop-shadow-sm">
          The BookHub - Books, World of books, Where to buy book <span className="text-blue-300 font-medium">BookHuB</span>.
          </p> */}
          <button
            onClick={handleClick}
            className="inline-block bg-blue-500 text-white font-semibold text-sm md:text-base px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Navigation Dots */}
      {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-blue-400 scale-125 shadow-md"
                : "bg-white/40 hover:bg-blue-300"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
}
