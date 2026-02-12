"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiUser, FiChevronDown, FiHeart, FiHelpCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [userOpen, setUserOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
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
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 max-w-screen-xl mx-auto px-6 flex items-center justify-between">

        {/* Left: Logo + Discover */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image src="/logo/logos.png" alt="Logo" width={160} height={50} />
          </Link>

          <div ref={discoverRef} className="relative">
            <button
              onClick={() => setDiscoverOpen(!discoverOpen)}
              className="flex items-center gap-1 font-medium text-gray-800 hover:text-green-600 transition"
            >
              Discover <FiChevronDown />
            </button>

            {discoverOpen && (
              <div className="absolute top-10 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                <Link href="/components/tour" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Tours
                </Link>
                <Link href="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Activities
                </Link>
                <Link href="/categories" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Categories
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: User Icon fully right */}
        <div className="flex items-center ml-auto" ref={userRef}>
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full bg-white hover:bg-gray-100 transition"
          >
            <FiUser size={20} />
          </button>

          {userOpen && (
            <div className="absolute top-12 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-fadeIn z-50">
              {!user ? (
                <Link href="/auth/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Log in / Sign up
                </Link>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">{user.email}</div>
                  <div className="border-t border-gray-200" />
                  <div
                    onClick={logout}
                    className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100"
                  >
                    Log out
                  </div>
                </>
              )}

              <div className="border-t border-gray-200" />

              <Link href="/wishlist" className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100">
                <FiHeart /> Wishlists
              </Link>
              <Link href="/help" className="flex items-center gap-2 px-4 py-2 text-gray-800 hover:bg-gray-100">
                <FiHelpCircle /> Help
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
