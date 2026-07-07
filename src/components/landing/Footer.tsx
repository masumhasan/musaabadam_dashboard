"use client";

import React, { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.05) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const navColumns = [
  {
    heading: "BIDSRUSH",
    links: [
      { name: "About Us", href: "#" },

      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Affiliates", href: "#" },
    ],
  },
  {
    heading: "BUY",
    links: [
      { name: "How to Bid", href: "#" },
      { name: "Buyer Protection", href: "#" },
      { name: "Order Tracking", href: "#" },
      { name: "Returns", href: "#" },
      { name: "Payment Options", href: "#" },
    ],
  },
  {
    heading: "HELP",
    links: [
      { name: "Help Center", href: "#" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact Us", href: "/contactus" },
      { name: "Shipping & Delivery", href: "#" },
      { name: "Trust & Safety", href: "#" },
    ],
  },
];

const socialIcons = [
  {
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L2.25 2.25h6.988l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
      </svg>
    ),
  },
  {
    label: "Music",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
      </svg>
    ),
  },
];

const bottomLinks = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacypolicy" },
  { name: "Cookie Settings", href: "#" },
  { name: "Accessibility", href: "#" },
];

export default function Footer() {
  const { ref, inView } = useInView(0.05);

  return (
    <div className="w-full bg-[#FFFF]">
      <footer
        ref={ref}
        className="bg-white border-t border-gray-100  pt-14 pb-8 max-w-7xl mx-auto"
      >
        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div
            className={`transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Logo */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xl font-black tracking-tight text-gray-900 uppercase">
                BIDS
              </span>
              <span className="text-xl font-black text-yellow-400">★</span>
              <span className="text-xl font-black tracking-tight text-gray-900 uppercase">
                RUSH
              </span>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[200px]">
              The ultimate live auction marketplace connecting buyers and
              sellers in real-time across thousands of categories.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialIcons.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:scale-110 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navColumns.map((col, colIdx) => (
            <div
              key={col.heading}
              className={`transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${100 + colIdx * 80}ms` }}
            >
              <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase mb-5">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.name} className="text-gray-400 text-sm">
                    <a
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-gray-900 transition-colors duration-150"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className={`border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-400 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Copyright */}
          <p className="text-gray-400 text-xs">
            © 2026 BidsRush Inc. All rights reserved.
          </p>

          {/* Bottom links + language */}
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {bottomLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 text-xs hover:text-gray-900 transition-colors duration-150"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <span>🌐</span>
              <span className="font-medium text-gray-700">English</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
