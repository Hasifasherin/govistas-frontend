"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { operatorAPI } from "../../../services/operator";
import { OperatorTour } from "../../../types/operator";
import TourTopBar from "../../components/tour/TourTopBar";
import TourCard from "../../components/tour/TourCard";
import AddTourForm from "../../components/tour/AddTourForm";
import { FiAlertCircle, FiFolderPlus } from "react-icons/fi";

export default function MyToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<OperatorTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
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
        setError("Failed to load tours. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load tours. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTour = (id: string) => router.push(`/tours/${id}`);
  const handleEditTour = (id: string) => router.push(`/operator/tours/${id}/edit`);
  
  const handleDeleteTour = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tour? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await operatorAPI.deleteTour(id);
      if (res.success) {
        setTours(tours.filter((t) => t._id !== id));
      } else {
        setError("Failed to delete tour. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete tour.");
    }
  };

  const filteredTours = tours.filter((tour) => {
    if (filter === "all") return true;
    if (filter === "active") return tour.isActive && tour.status === "approved";
    if (filter === "pending") return tour.status === "pending";
    if (filter === "inactive") return !tour.isActive;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <TourTopBar
          filter={filter}
          setFilter={setFilter}
          onAddTourClick={() => setShowForm(true)}
        />

        {showForm && (
          <AddTourForm
            onClose={() => setShowForm(false)}
            onTourAdded={fetchTours}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tours Grid */}
        {loading ? (
          <div className="py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[var(--green-light)] 
                  border-t-[var(--green-primary)] rounded-full animate-spin" />
              </div>
              <p className="text-gray-600 font-inter">Loading your tours...</p>
            </div>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center 
                justify-center mx-auto mb-6">
                <FiFolderPlus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                No tours found
              </h3>
              <p className="text-gray-600 mb-8 font-inter">
                {filter === "all" 
                  ? "You haven't created any tours yet. Get started by creating your first tour!"
                  : `No tours match the "${filter}" filter. Try a different filter.`
                }
              </p>
              {filter === "all" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--green-primary)] 
                    to-[var(--green-accent)] text-white font-semibold rounded-xl
                    hover:from-[var(--green-dark)] hover:to-[var(--green-primary)]
                    transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Create Your First Tour
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-inter">
                Showing <span className="font-semibold">{filteredTours.length}</span> tours
              </p>
              <p className="text-sm text-gray-600 font-inter">
                Total: <span className="font-semibold">{tours.length}</span> tours
              </p>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <TourCard
                  key={tour._id}
                  tour={tour}
                  onView={handleViewTour}
                  onEdit={handleEditTour}
                  onDelete={handleDeleteTour}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}