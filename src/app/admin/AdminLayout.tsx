"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../hooks/useAdminRedux";
import { logout } from "../../redux/slices/adminSlice";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.admin.user);
  const [mounted, setMounted] = useState(false);

  /* ================= HYDRATION SAFE ================= */
  useEffect(() => setMounted(true), []);

  /* ================= ADMIN GUARD ================= */
  useEffect(() => {
    if (mounted && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [mounted, user, router]);

  if (!mounted) return null;

  /* ================= COMPLETE LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    router.replace("/");
  };

  /* ================= MENU ITEMS ================= */
  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Operators", href: "/admin/operators" },
    { label: "Tours", href: "/admin/tours" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Slider", href: "/admin/sliders" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Upcoming Trips", href: "/admin/upcoming-trips" },
  ];

  return (
    <div className="min-h-screen bg-green-50 text-green-900">
      {/* ================= SIDEBAR ================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-green-900 text-green-50 flex flex-col z-50">
        <div className="p-6 text-center font-bold text-xl border-b border-green-50/20">
          Admin Panel
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-4 py-2 rounded transition hover:bg-green-600 ${
                  pathname === item.href ? "bg-green-600" : ""
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <div
                key={item.label}
                className="block px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition"
                title="No redirect"
              >
                {item.label}
              </div>
            )
          )}
        </nav>

        {/* ================= SIDEBAR FOOTER ================= */}
        <div className="p-4 border-t border-green-50/20">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {user?.name || user?.email} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 min-h-screen p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
