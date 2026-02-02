"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getSliders } from "../../../services/slider";
import { Slider } from "../../../types/slider";
import HeroSearch from "./HeroSearch";
import { useAuth } from "../../context/AuthContext"; // your context for logged-in user

const HomeSlider = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [current, setCurrent] = useState(0);

  const { user } = useAuth(); // get logged-in user

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const sliders = await getSliders();
        setSliders(sliders);
      } catch (error) {
        console.error("Failed to load sliders", error);
      }
    };

    fetchSliders();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!sliders.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  if (!sliders.length) return null;

  return (
    <div className="relative w-full h-[90vh] md:h-[80vh] overflow-hidden">
      {/* Slider images */}
      {sliders.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt="Hero slider"
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Hero Search + Greeting */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center text-white">
        {/* Personalized greeting */}
        {user && (
          <p className="text-xl md:text-2xl font-medium mb-2">
            Hi, {user.name}! 👋
          </p>
        )}

        {/* Hero headline */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl">
          Explore unforgettable experiences around the world
        </h1>
        <p className="text-md md:text-lg mb-8 max-w-2xl">
          Book tours, activities, and adventures with trusted providers.
        </p>

        {/* Search + filters */}
        <HeroSearch />
      </div>
    </div>
  );
};

export default HomeSlider;
