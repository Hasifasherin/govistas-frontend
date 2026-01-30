"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  FiUser,
  FiChevronDown,
  FiHeart,
  FiHelpCircle,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();

  const [userOpen, setUserOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
      if (discoverRef.current && !discoverRef.current.contains(e.target as Node)) {
        setDiscoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.container}>

        {/* LEFT */}
        <div className={styles.row}>
          <Link href="/">
            <Image
              src="/logo/logos.png"
              alt="Logo"
              width={160}
              height={50}
            />
          </Link>

          <div ref={discoverRef} style={{ position: "relative" }}>
            <button
              className={styles.discoverBtn}
              onClick={() => setDiscoverOpen(!discoverOpen)}
            >
              Discover <FiChevronDown />
            </button>

            {discoverOpen && (
              <div className={`${styles.dropdown} ${styles.dropdownLeft}`}>
                <Link href="/tours" className={styles.dropdownItem}>Tours</Link>
                <Link href="/activities" className={styles.dropdownItem}>Activities</Link>
                <Link href="/destinations" className={styles.dropdownItem}>Destinations</Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.row}>
          <div ref={userRef} style={{ position: "relative" }}>
            <button
              className={`${styles.iconBtn} ${styles.userBtn}`}
              onClick={() => setUserOpen(!userOpen)}
            >
              <FiUser size={18} />
            </button>

            {userOpen && (
              <div className={styles.dropdown}>

                {!user ? (
                  <Link href="/auth/login" className={styles.dropdownItem}>
                    Log in / Sign up
                  </Link>
                ) : (
                  <>
                    <div className={styles.email}>{user.email}</div>
                    <div className={styles.divider} />
                    <div
                      onClick={logout}
                      className={styles.dropdownItem}
                      style={{ color: "red" }}
                    >
                      Log out
                    </div>
                  </>
                )}

                <div className={styles.divider} />

                <Link href="/wishlist" className={styles.dropdownItem}>
                  <FiHeart /> Wishlists
                </Link>
                <Link href="/help" className={styles.dropdownItem}>
                  <FiHelpCircle /> Help
                </Link>

              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
