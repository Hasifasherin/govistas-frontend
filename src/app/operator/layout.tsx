// app/operator/layout.tsx - USING CSS MODULE
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiMap,
  FiCalendar,
  FiMessageSquare,
  FiBell,
  FiLogOut,
  FiUser,
  FiMenu,
  FiX,
  FiTrendingUp,
  FiSettings,
  FiPlus,
  FiChevronRight,
  FiDollarSign,
  FiUsers
} from "react-icons/fi";
import styles from "./styles/OperatorLayout.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function OperatorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protect route - only operators allowed
  useEffect(() => {
    if (!loading && user?.role !== "operator") {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9f7ef] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0f8a2d] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Operator Panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "operator") {
    return null;
  }

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/operator/dashboard", icon: FiHome },
    { label: "My Tours", href: "/operator/tours", icon: FiMap },
    { label: "Bookings", href: "/operator/bookings", icon: FiCalendar, badge: 5 },
    { label: "Messages", href: "/operator/messages", icon: FiMessageSquare, badge: 2 },
    { label: "Analytics", href: "/operator/analytics", icon: FiTrendingUp },
    { label: "Settings", href: "/operator/settings", icon: FiSettings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return "OP";
  };

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email?.split("@")[0] || "Operator";
  };

  return (
    <div className={styles.operatorLayout}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        {/* Logo */}
        <div className={styles.logoSection}>
          <Link href="/operator/dashboard" className={styles.logoContainer}>
            <div className={styles.logoImage}>
              <Image
                src="/logo/logos.png"
                alt="GoVista Tours"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className={styles.logoSubtitle}>OPERATOR PANEL</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.navContainer}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${styles.fadeIn} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={styles.navIcon} />
                <span>{item.label}</span>
                
                {item.badge && item.badge > 0 && (
                  <span className={`${styles.badge} ${isActive ? styles.activeBadge : ''}`}>
                    {item.badge}
                  </span>
                )}
                
                {isActive && (
                  <div className={styles.activeIndicator}>
                    <FiChevronRight className="w-4 h-4" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Create Tour Button */}
        <Link
          href="/operator/tours/create"
          className={styles.createTourButton}
          onClick={() => setSidebarOpen(false)}
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Create New Tour
        </Link>

        {/* User Profile */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {getUserInitials()}
            </div>
            <div className={styles.userText}>
              <div className={styles.userName}>{getUserName()}</div>
              <div className={styles.userRole}>Tour Operator</div>
            </div>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className={styles.menuButton}
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            <div className="ml-4">
              <h1 className={styles.pageTitle}>
                {navItems.find(item => pathname.startsWith(item.href))?.label || "Dashboard"}
              </h1>
              <p className={styles.pageSubtitle}>
                Welcome back, {user?.firstName || "Operator"}! Manage your tours efficiently.
              </p>
            </div>
          </div>

          <div className={styles.rightActions}>
            <button className={styles.notificationButton}>
              <FiBell className="w-6 h-6" />
              <span className={styles.notificationDot}></span>
            </button>

            <div className={styles.quickStats}>
              <div className={styles.statBadge}>
                <FiUsers className="w-4 h-4 mr-2 text-[#0f8a2d]" />
                <span className={styles.statText}>24 Active</span>
              </div>
              <div className={`${styles.statBadge} bg-blue-50 border-blue-100`}>
                <FiDollarSign className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">$5.2K</span>
              </div>
            </div>

            <div className={styles.mobileAvatar}>
              {getUserInitials()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}