"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { tourAPI } from "../../../services/tour";
import { Tour } from "../../../types/tour";
import UserTourCard from "./UserTourCard";

export default function AllTours() {
  const { user } = useAuth();
  const router = useRouter();

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      const res = await tourAPI.searchTours({
        limit: 100,
      });

      if (res.data && Array.isArray(res.data.tours)) {
        setTours(res.data.tours);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.error("Failed to fetch tours:", err);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleView = (id: string) => {
    if (user) {
      router.push(`/user/tours/${id}`);
    } else {
      router.push("/login");
    }
  };

  const handleWishlist = (id: string) => {
    console.log("Add to wishlist:", id);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 font-sans">
      
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-[var(--green-dark)]">
          Explore All Tours
        </h1>
        <p className="text-gray-600 mt-3">
          Discover curated experiences from trusted local operators.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading tours...</p>
      )}

      {/* Empty State */}
      {!loading && tours.length === 0 && (
        <p className="text-center text-gray-500">
          No tours available at the moment.
        </p>
      )}

      {/* Tours Grid */}
      {!loading && tours.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <UserTourCard
              key={tour._id}
              tour={tour}
              onView={handleView}
              onWishlist={handleWishlist}
              onCardClick={handleView}
            />
          ))}
        </div>
      )}
      
    </div>
  );
}
