"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { operatorAPI } from "../../../services/operator";
import { OperatorStats, OperatorBooking } from "../../../types/operator";
import styles from "../styles/OperatorDashboard.module.css";
import { FiEye, FiCheck, FiX, FiCalendar, FiDollarSign, FiMap, FiUsers } from "react-icons/fi";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function OperatorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<OperatorStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<OperatorBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === "operator") loadDashboard();
  }, [authLoading, user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // ✅ Fetch stats from backend
      const statsRes = await operatorAPI.getDashboardStats();
      if (statsRes.success) setStats(statsRes.stats);

      // ✅ Fetch recent bookings
      const bookingsRes = await operatorAPI.getMyBookings();
      if (bookingsRes.success) setRecentBookings(bookingsRes.bookings.slice(0, 5));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: "accepted" | "rejected") => {
    try {
      await operatorAPI.updateBookingStatus(bookingId, status);
      setRecentBookings(prev => prev.map(b => (b._id === bookingId ? { ...b, status } : b)));
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (authLoading || loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full" />
      </div>
    );

  if (!user || user.role !== "operator")
    return <div className="text-center py-20 text-gray-600">Unauthorized access</div>;

  // ================= CHART DATA =================
  const revenueData = {
    labels: stats?.monthlyRevenue?.map(m => m.month) || [],
    datasets: [
      { label: "Revenue", data: stats?.monthlyRevenue?.map(m => m.amount) || [], borderColor: "#22c55e", backgroundColor: "rgba(34,197,94,0.2)", tension: 0.3 },
    ],
  };

  const bookingsData = {
    labels: stats?.monthlyBookings?.map(m => m.month) || [],
    datasets: [{ label: "Bookings", data: stats?.monthlyBookings?.map(m => m.count) || [], backgroundColor: "rgba(59,130,246,0.7)" }],
  };

  const categoriesData = {
    labels: stats?.tourCategories?.map(c => c.category) || [],
    datasets: [{ label: "Tours", data: stats?.tourCategories?.map(c => c.count) || [], backgroundColor: ["#10B981","#3B82F6","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#F43F5E"] }],
  };

  return (
    <div className={styles.dashboard}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <StatCard label="Total Tours" value={stats?.totalTours} icon={<FiMap />} />
        <StatCard label="Total Bookings" value={stats?.totalBookings} icon={<FiCalendar />} />
        <StatCard label="Pending Requests" value={stats?.pendingBookings} icon={<FiUsers />} highlight />
        <StatCard label="Revenue" value={formatCurrency(stats?.totalRevenue)} icon={<FiDollarSign />} />
        <StatCard label="Active Tours" value={stats?.activeTours} icon={<FiMap />} />
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}><h3 className={styles.chartTitle}>Revenue Overview</h3><Line data={revenueData} /></div>
        <div className={styles.chartContainer}><h3 className={styles.chartTitle}>Monthly Bookings</h3><Bar data={bookingsData} /></div>
        <div className={styles.chartContainer}><h3 className={styles.chartTitle}>Tour Categories</h3><Doughnut data={categoriesData} /></div>
      </div>

      {/* Recent Bookings Table */}
      <div className={styles.recentBookingsContainer}>
        <div className={styles.recentBookingsHeader}>
          <h2>Recent Booking Requests</h2>
          <Link href="/operator/bookings">View all →</Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className={styles.recentBookingsEmpty}>No booking requests yet</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                {["Tour", "Customer", "Date", "People", "Status", "Actions"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b._id}>
                  <td>{b.tourId?.title}</td>
                  <td>
                    {b.userId?.firstName} {b.userId?.lastName}
                    <div className="text-sm text-gray-500">{b.userId?.email}</div>
                  </td>
                  <td>{formatDate(b.bookingDate)}</td>
                  <td>{b.participants}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    {b.status === "pending" ? (
                      <div className="flex gap-2">
                        <ActionBtn label="Accept" color="green" icon={<FiCheck />} onClick={() => handleUpdateStatus(b._id, "accepted")} />
                        <ActionBtn label="Reject" color="red" icon={<FiX />} onClick={() => handleUpdateStatus(b._id, "rejected")} />
                      </div>
                    ) : (
                      <Link href={`/operator/bookings/${b._id}`} className="text-sm text-gray-700 inline-flex items-center">
                        <FiEye className="mr-1" /> View
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
  );
}

/* ================= SMALL UI COMPONENTS ================= */
const StatCard = ({ label, value, icon, highlight }: any) => (
  <div className={`${styles.statCard} ${highlight ? "border-l-4 border-red-500" : ""}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue}>{value ?? 0}</p>
        {highlight && <p className={styles.statHighlight}>Needs attention</p>}
      </div>
      <div className={styles.statIcon}>{icon}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status === "pending" ? "bg-yellow-100 text-yellow-800" : status === "accepted" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
    {status.toUpperCase()}
  </span>
);

const ActionBtn = ({ label, color, icon, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center px-3 py-1 text-sm font-medium rounded-md ${color === "green" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}`}>
    {icon} <span className="ml-1">{label}</span>
  </button>
);
