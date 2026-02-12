"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { tourAPI } from "../../../services/tour";
import { Tour } from "../../../types/tour";
import UserTourCard from "./UserTourCard";
import LoginModal from "../common/LoginModal"; // adjust path if needed

interface Category {
  _id: string;
  name: string;
}

export default function CategoryTours() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [toursByCategory, setToursByCategory] = useState<
    Record<string, Tour[]>
  >({});
  const [loading, setLoading] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    try {
      const res = await tourAPI.getCategories();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // ---------------- FETCH TOURS ----------------
  const fetchToursByCategory = async () => {
    setLoading(true);
    try {
      const newToursByCat: Record<string, Tour[]> = {};

      for (const category of categories) {
        const res = await tourAPI.searchTours({
          category: category._id,
          limit: 6,
        });

        newToursByCat[category._id] = res.data.tours || [];
      }

      setToursByCategory(newToursByCat);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchToursByCategory();
    }
  }, [categories]);

  // ---------------- CARD CLICK ----------------
  const handleCardClick = (id: string) => {
    if (user) {
      router.push(`user/tours/${id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  // ---------------- VIEW BUTTON ----------------
  const handleView = (id: string) => {
    handleCardClick(id);
  };

  const handleWishlist = (id: string) => {
    console.log("Wishlist:", id);
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-6">
        Loading tours...
      </p>
    );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {categories.map((category) => {
          const tours = toursByCategory[category._id] || [];
          if (tours.length === 0) return null;

          return (
            <div key={category._id} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">
                {category.name}
              </h2>

              {/* SAME SIZE / WIDTH GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <UserTourCard
                    key={tour._id}
                    tour={tour}
                    onView={handleView}
                    onWishlist={handleWishlist}
                    onCardClick={handleCardClick} // FULL CARD CLICK
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* LOGIN MODAL */}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
