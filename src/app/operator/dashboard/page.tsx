// app/operator/dashboard/page.tsx - PROFESSIONAL WITH REAL DATA
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { operatorAPI } from "../../../services/operator";
import { OperatorStats, OperatorBooking } from "../../../types/operator";
import styles from "../styles/OperatorDashboard.module.css";
import {
  FiEye,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDollarSign,
  FiMap,
  FiUsers
} from "react-icons/fi";

export default function OperatorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OperatorStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<OperatorBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats from backend
      const statsData = await operatorAPI.getDashboardStats();
      setStats(statsData);
      
      // Fetch recent bookings
      const bookingsResponse = await operatorAPI.getMyBookings();
      if (bookingsResponse.success && bookingsResponse.bookings) {
        setRecentBookings(bookingsResponse.bookings.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      await operatorAPI.updateBookingStatus(bookingId, status);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getOperatorName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    return "Operator";
  };

  return (
    <div className={styles.dashboard}>
      {/* WELCOME HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {getOperatorName()}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your business today.</p>
      </div>

      {/* STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className={styles.statLabel}>Total Tours</p>
              <p className={styles.statValue}>{stats?.totalTours || 0}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-600 text-sm font-medium">Active</span>
              </div>
            </div>
            <div className={`${styles.statIcon} ${styles.statIconTours}`}>
              <FiMap size={24} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className={styles.statLabel}>Total Bookings</p>
              <p className={styles.statValue}>{stats?.totalBookings || 0}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-600 text-sm font-medium">All time</span>
              </div>
            </div>
            <div className={`${styles.statIcon} ${styles.statIconBookings}`}>
              <FiCalendar size={24} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className={styles.statLabel}>Pending Requests</p>
              <p className={styles.statValue}>{stats?.pendingBookings || 0}</p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-600 text-sm font-medium">Requires attention</span>
              </div>
            </div>
            <div className={`${styles.statIcon} ${styles.statIconPending}`}>
              <FiUsers size={24} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className={styles.statLabel}>Total Revenue</p>
              <p className={styles.statValue}>{formatCurrency(stats?.totalRevenue || 0)}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-600 text-sm font-medium">8% growth</span>
              </div>
            </div>
            <div className={`${styles.statIcon} ${styles.statIconRevenue}`}>
              <FiDollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Booking Requests</h2>
            <Link href="/operator/bookings" className="text-green-600 hover:text-green-700 font-medium text-sm">
              View All →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading bookings...</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-500">No booking requests yet</p>
              <p className="text-gray-400 text-sm mt-1">Your booking requests will appear here</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{booking.tourId?.title || "Unknown Tour"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.userId?.firstName} {booking.userId?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{booking.userId?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{formatDate(booking.bookingDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {booking.participants} people
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <FiCheck className="mr-1" size={12} />
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiX className="mr-1" size={12} />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={`/operator/bookings/${booking._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiEye className="mr-1" size={12} />
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}