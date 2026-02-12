"use client";

import React from "react";
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiHeart } from "react-icons/fi";
import { Tour } from "../../../types/tour";

interface Props {
  tour: Tour;
  onView: (id: string) => void;
  onWishlist?: (id: string) => void;
  small?: boolean;
  onCardClick?: (id: string) => void; // NEW: full card click
}

const UserTourCard: React.FC<Props> = ({ tour, onView, onWishlist, small, onCardClick }) => {
  return (
    <div
      onClick={() => onCardClick?.(tour._id)} // full card click
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer
        ${small ? "max-w-xs mx-auto" : ""}`}
    >
      {/* Tour Image */}
      <div className={`relative overflow-hidden ${small ? "h-40" : "h-64"}`}>
        {tour.image ? (
          <img
            src={tour.image}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <FiMapPin className="text-gray-400 mx-auto mb-3" size={small ? 32 : 48} />
            <p className={`text-gray-500 font-medium ${small ? "text-sm" : "text-base"}`}>Tour Image</p>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg">
          <div className="flex items-center gap-1">
            <FiDollarSign className="text-green-600" size={small ? 12 : 16} />
            <span className={`font-bold ${small ? "text-sm" : "text-lg"} text-gray-900`}>
              {tour.price}
            </span>
          </div>
          <p className={`text-gray-500 mt-1 ${small ? "text-xs" : "text-sm"}`}>per person</p>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
          <div className="flex items-center gap-1">
            <FiCalendar size={small ? 10 : 14} />
            <span className="text-xs">{tour.duration} Days</span>
          </div>
        </div>
      </div>

      {/* Tour Content */}
      <div className={`p-4 ${small ? "text-sm" : "p-6"}`}>
        {/* Title & Location */}
        <div className="mb-2">
          <h3 className={`font-bold text-gray-900 line-clamp-1 ${small ? "text-sm" : "text-xl"}`}>
            {tour.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <FiMapPin size={small ? 12 : 16} className="text-green-600 flex-shrink-0" />
            <span className="truncate">{tour.location}</span>
          </div>
        </div>

        {/* Description */}
        {tour.description && (
          <p className={`text-gray-600 line-clamp-2 ${small ? "text-xs mb-2" : "text-sm mb-5"}`}>
            {tour.description}
          </p>
        )}

        {/* Max Group Size & Status */}
        <div className="flex justify-between items-center mb-3">
          {tour.maxGroupSize && (
            <div className="flex items-center gap-2">
              <FiUsers className="text-blue-600" size={small ? 14 : 18} />
              <span className={`text-gray-900 font-semibold ${small ? "text-xs" : "text-sm"}`}>
                {tour.maxGroupSize} Travelers
              </span>
            </div>
          )}
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                tour.isActive && tour.status === "approved" ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-gray-700 text-xs">
              {tour.isActive && tour.status === "approved" ? "Active" : "Pending"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering card click
              onView(tour._id);
            }}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-1.5 rounded-lg transition-colors text-xs flex items-center justify-center gap-1"
          >
            View
          </button>
          {onWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWishlist(tour._id);
              }}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-1.5 rounded-lg transition-colors text-xs flex items-center justify-center gap-1"
            >
              <FiHeart size={12} /> Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTourCard;
