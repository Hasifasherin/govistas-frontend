"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { tourAPI } from "../../../services/tour";
import { Tour } from "../../../types/tour";

import UserTourCard from "./UserTourCard";
import LoginModal from "../common/LoginModal"; 

export default function FeaturedTours() {
  const router = useRouter();

  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 login modal state
  const [loginOpen, setLoginOpen] = useState(false);

  // 👉 fake auth check (replace with your real auth logic / redux / context)
  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const fetchFeaturedTours = async () => {
    setLoading(true);
    try {
      const res = await tourAPI.getFeaturedTours();
      setFeaturedTours(res.data.tours || []);
    } catch (err) {
      console.error("Failed to fetch featured tours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedTours();
  }, []);

  // ✅ CARD CLICK HANDLER
  const handleCardClick = (id: string) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    router.push(`user/tours/${id}`);
  };

  const handleWishlist = (id: string) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    console.log("Add to wishlist:", id);
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-6">
        Loading featured tours...
      </p>
    );

  if (featuredTours.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Featured Tours</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTours.map((tour) => (
          <div
            key={tour._id}
            onClick={() => handleCardClick(tour._id)}
            className="cursor-pointer"
          >
            <UserTourCard
              tour={tour}
              onView={handleCardClick}      
              onWishlist={handleWishlist}
            />
          </div>
        ))}
      </div>

      {/* 🔐 LOGIN MODAL */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </div>
  );
}
