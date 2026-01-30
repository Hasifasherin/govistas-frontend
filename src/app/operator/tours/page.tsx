// app/operator/tours/page.tsx - FIXED VERSION
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { operatorAPI } from "../../../services/operator";
import { OperatorTour } from "../../../types/operator";
import { FiEdit, FiTrash2, FiEye, FiPlus, FiMap, FiCalendar, FiUsers, FiDollarSign, FiCheck, FiX } from "react-icons/fi";

export default function MyToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<OperatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await operatorAPI.getMyTours();
      if (response.success) {
        setTours(response.tours || []);
      } else {
        setError("Failed to load tours");
      }
    } catch (error: any) {
      console.error("Error fetching tours:", error);
      setError(error.message || "Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    try {
      const response = await operatorAPI.deleteTour(tourId);
      if (response.success) {
        setTours(tours.filter(tour => tour._id !== tourId));
        setDeleteConfirm(null);
      } else {
        setError("Failed to delete tour");
      }
    } catch (error: any) {
      console.error("Error deleting tour:", error);
      setError(error.message || "Failed to delete tour");
    }
  };

  const handleEditTour = (tourId: string) => {
    router.push(`/operator/tours/${tourId}/edit`);
  };

  const handleViewTour = (tourId: string) => {
    router.push(`/tours/${tourId}`);
  };

  const filteredTours = tours.filter(tour => {
    if (filter === "all") return true;
    if (filter === "active") return tour.isActive && tour.status === "approved";
    if (filter === "pending") return tour.status === "pending";
    if (filter === "inactive") return !tour.isActive;
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
          Inactive
        </span>
      );
    }
    
    switch (status) {
      case "approved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tours</h1>
          <p className="text-gray-600">Manage your tour listings and packages</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* FILTER BUTTONS */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["all", "active", "pending", "inactive"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${
                  filter === f ? "bg-white text-gray-800 shadow" : "text-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          {/* ADD TOUR BUTTON */}
          <Link
            href="/operator/tours/create"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors"
          >
            <FiPlus size={18} />
            <span>Add New Tour</span>
          </Link>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TOURS GRID */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMap className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No tours found</h3>
          <p className="text-gray-500 mb-6">
            {filter === "all" 
              ? "Create your first tour to start receiving bookings" 
              : `No ${filter} tours found`}
          </p>
          <Link
            href="/operator/tours/create"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FiPlus size={18} />
            Create Your First Tour
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* TOUR IMAGE */}
                <div className="h-48 overflow-hidden relative bg-gray-100">
                  {tour.image ? (
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                      <FiMap className="text-gray-400" size={48} />
                    </div>
                  )}
                  
                  {/* STATUS BADGE */}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(tour.status, tour.isActive)}
                  </div>
                </div>

                {/* TOUR DETAILS */}
                <div className="p-5">
                  {/* TITLE & PRICE */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{tour.title}</h3>
                    <span className="font-bold text-green-700 whitespace-nowrap">
                      {formatCurrency(tour.price)}
                    </span>
                  </div>
                  
                  {/* LOCATION */}
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <span className="truncate">{tour.location}</span>
                  </div>
                  
                  {/* TOUR STATS */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      <span>{(tour as any).duration || "N/A"} days</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <FiUsers size={14} />
                      <span>Max {(tour as any).maxGroupSize || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <FiDollarSign size={14} />
                      <span>{tour.bookingsCount || 0} bookings</span>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewTour(tour._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      <FiEye size={16} />
                      View
                    </button>
                    
                    <button
                      onClick={() => handleEditTour(tour._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      <FiEdit size={16} />
                      Edit
                    </button>
                    
                    {deleteConfirm === tour._id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteTour(tour._id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 px-3 rounded-lg font-medium"
                        >
                          <FiCheck size={14} />
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 flex items-center justify-center gap-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium"
                        >
                          <FiX size={14} />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(tour._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        <FiTrash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* TOUR COUNT */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Showing {filteredTours.length} of {tours.length} tours
              {filter !== "all" && ` (filtered by ${filter})`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}