"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
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
  FiMenu,
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
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); // real API later

  const notificationRef = useRef<HTMLDivElement>(null);

  // Protect route
  useEffect(() => {
    if (!loading && user?.role !== "operator") {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9f7ef] to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0f8a2d] border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== "operator") return null;

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/operator/dashboard", icon: FiHome },
    { label: "My Tours", href: "/operator/tours", icon: FiMap },
    { label: "Bookings", href: "/operator/bookings", icon: FiCalendar, badge: 5 },
    { label: "Messages", href: "/operator/messages", icon: FiMessageSquare, badge: 2 },
    { label: "Analytics", href: "/operator/analytics", icon: FiTrendingUp },
    { label: "Settings", href: "/operator/settings", icon: FiSettings }
  ];

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const getUserInitials = () =>
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "OP";

  const getUserName = () =>
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Operator";

  return (
    <div className={styles.operatorLayout}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR (UNCHANGED) */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.logoSection}>
          <Link href="/operator/dashboard" className={styles.logoContainer}>
            <div className={styles.logoImage}>
              <Image src="/logo/logos.png" alt="GoVista" fill className="object-contain" />
            </div>
            <div className={styles.logoSubtitle}>OPERATOR PANEL</div>
          </Link>
        </div>

        <nav className={styles.navContainer}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
              >
                <Icon className={styles.navIcon} />
                {item.label}
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
                {active && <FiChevronRight className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </nav>

        <Link href="/operator/tours/create" className={styles.createTourButton}>
          <FiPlus /> Create New Tour
        </Link>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{getUserInitials()}</div>
            <div className={styles.userText}>
              <div className={styles.userName}>{getUserName()}</div>
              <div className={styles.userRole}>Tour Operator</div>
            </div>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className={styles.menuButton}>
              <FiMenu />
            </button>
          </div>

          <div className={styles.rightActions}>
            {/* 🔔 Notification (same position, floating dropdown) */}
            <div ref={notificationRef} style={{ position: "relative" }}>
              <button
                className={styles.notificationButton}
                onClick={() => notifications.length && setNotificationOpen(v => !v)}
              >
                <FiBell />
                {notifications.some(n => n.unread) && (
                  <span className={styles.notificationDot} />
                )}
              </button>

              {notificationOpen && (
                <div className={styles.notificationDropdown}>
                  <div className={styles.notificationHeader}>Notifications</div>

                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`${styles.notificationItem} ${n.unread ? styles.unread : ""}`}
                    >
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.quickStats}>
              <div className={styles.statBadge}>
                <FiUsers /> <span>24 Active</span>
              </div>
              <div className={styles.statBadge}>
                <FiDollarSign /> <span>$5.2K</span>
              </div>
            </div>

            <div className={styles.mobileAvatar}>{getUserInitials()}</div>
          </div>
        </header>

        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
