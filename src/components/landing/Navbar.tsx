"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    "Explore",
    "Live Now",
    "Categories",
    "How It Works",
    "Sell on BidsRush",
  ];

  // Handle scroll effect for navbar elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 w-full bg-white/95 backdrop-blur-sm font-sans z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-gray-200 shadow-lg shadow-gray-200/20"
            : "border-b border-gray-100 shadow-sm"
        }`}
      >
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[70px] max-w-[1600px] mx-auto">
          {/* =======================Logo */}

          <Link
            href="/"
            className="flex items-center flex-shrink-0 group transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="BidsRush Logo"
              width={120}
              height={40}
              loading="eager"
              style={{ height: "auto", width: "auto" }}
            />
          </Link>

          {/* Desktop Nav Links with animated underline */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-9 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                href="/"
                key={link}
                className="relative text-sm font-semibold text-gray-700 whitespace-nowrap transition-all duration-200 hover:text-[#1877F2] group"
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#1877F2] to-[#F5A623] transition-all duration-300 ease-out ${
                    hoveredLink === link ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Action Buttons with scale & glow effects */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <button className="relative overflow-hidden group border border-gray-300 rounded-lg px-5 py-2 text-sm font-bold text-gray-700 bg-white transition-all duration-200 hover:border-[#1877F2] hover:text-[#1877F2] hover:shadow-md">
              <span className="relative z-10">Log In</span>
            </button>
            <button className="relative overflow-hidden group bg-[#1877F2] rounded-lg px-5 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1560cc] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
              <span className="relative z-10">Sign Up Free</span>
            </button>
            <button className="relative overflow-hidden group bg-[#F5A623] rounded-lg px-4 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-[#e0961a] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5">
              <span className="relative z-10">Become a Seller</span>
            </button>
          </div>

          {/* Tablet: show only buttons */}
          <div className="hidden md:flex lg:hidden items-center gap-2 flex-shrink-0">
            <button className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white transition-all duration-200 hover:border-[#1877F2] hover:text-[#1877F2]">
              Log In
            </button>
            <button className="bg-[#1877F2] rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1560cc] hover:shadow-md">
              Sign Up Free
            </button>
            <button className="bg-[#F5A623] rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#e0961a] hover:shadow-md">
              Become a Seller
            </button>
          </div>

          {/* Mobile Right: Log In + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white transition-all duration-200 hover:border-[#1877F2] hover:text-[#1877F2]">
              Log In
            </button>
            {/* Animated Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="relative flex flex-col justify-center items-center w-10 h-10 rounded-xl border border-gray-200 hover:border-[#1877F2] transition-all duration-200 gap-1.5 bg-white hover:shadow-md group"
              aria-label="Open menu"
            >
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-200 group-hover:bg-[#1877F2] group-hover:w-6`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-200 group-hover:bg-[#1877F2] group-hover:w-6`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 rounded-full transition-all duration-200 group-hover:bg-[#1877F2] group-hover:w-6`}
              />
            </button>
          </div>
        </div>

        {/* Tablet: Nav Links Row with scroll animation */}
        <div className="hidden md:flex lg:hidden items-center gap-6 px-6 py-3 border-t border-gray-100 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
          {navLinks.map((link, idx) => (
            <Link
              href="/"
              key={link}
              className="text-sm font-medium text-gray-700 whitespace-nowrap transition-all duration-200 hover:text-[#1877F2] hover:scale-105"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {link}
            </Link>
          ))}
        </div>
      </header>

      {/* Backdrop with blur and fade animation */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-400 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Side Drawer with smooth slide-in animation */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[360px] bg-white z-50 shadow-2xl flex flex-col transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header with animated close button */}
        <div className="flex items-center justify-between px-6 h-[70px] border-b border-gray-100">
          <Link href="/" className="flex items-center group">
            <span className="font-black text-[22px] tracking-tight text-[#F5A623] transition-all duration-300 group-hover:text-[#e0961a]">
              BIDS
            </span>
            <span className="font-black text-[22px] tracking-tight text-[#1877F2] transition-all duration-300 group-hover:text-[#1365d1]">
              RUSH
            </span>
          </Link>
          {/* Close Button with rotate animation */}
          <button
            onClick={() => setMenuOpen(false)}
            className=""
            aria-label="Close menu"
          >
            <IoMdClose size={28} color="gray-700" />
          </button>
        </div>

        {/* Drawer Nav Links with staggered fade-in */}
        <nav className="flex flex-col px-5 py-6 gap-2 flex-1">
          {navLinks.map((link, idx) => (
            <Link
              href="/"
              key={link}
              className="flex items-center text-base font-semibold text-gray-700 py-3.5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 hover:text-[#1877F2] transition-all duration-200 hover:translate-x-2 group"
              onClick={() => setMenuOpen(false)}
              style={{
                animation: menuOpen
                  ? `slideInFromRight 0.3s ease-out ${idx * 0.05}s forwards`
                  : "none",
                opacity: 0,
                transform: "translateX(20px)",
              }}
            >
              <span>{link}</span>
              <svg
                className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Drawer Footer Buttons with hover lift effect */}
        <div className="flex flex-col gap-3 px-5 py-6 border-t border-gray-100">
          <button className="w-full border border-gray-300 rounded-xl py-3 text-sm font-bold text-gray-700 bg-white transition-all duration-200 hover:border-[#1877F2] hover:text-[#1877F2] hover:shadow-md hover:-translate-y-0.5">
            Log In
          </button>
          <button className="w-full bg-[#1877F2] rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#1560cc] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5">
            Sign Up Free
          </button>
          <button className="w-full bg-[#F5A623] rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-[#e0961a] hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5">
            Become a Seller
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .transition-all-400 {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 400ms;
        }

        .duration-400 {
          transition-duration: 400ms;
        }

        /* Custom scrollbar for tablet nav */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Add padding to body to prevent content from hiding under fixed navbar */}
    </>
  );
}
