"use client";

import React, { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
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

// Pulsing live dot
function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
      </span>
      Live
    </span>
  );
}

const shows = [
  {
    bg: "bg-blue-100",
    emoji: "👟",
    viewers: "2.4k",
    avatarColor: "bg-blue-500",
    seller: "JordanKicks_Official",
    title: "🔥 Rare Jordan 1 OG Black Toe — Deadstock Size 10",
    category: "Sneakers",
    starting: "$150",
  },
  {
    bg: "bg-yellow-100",
    emoji: "⌚",
    viewers: "1.1k",
    avatarColor: "bg-yellow-400",
    seller: "WatchCollectors_UK",
    title: "🎖 Rolex Datejust 1601 — Unpolished All Original",
    category: "Watches",
    starting: "$800",
  },
  {
    bg: "bg-green-100",
    emoji: "🃏",
    viewers: "3.7k",
    avatarColor: "bg-teal-500",
    seller: "CardBreaks_Vault",
    title: "✨ Pokémon 151 Booster Box Break — PSA 10 Pulls!",
    category: "Trading Cards",
    starting: "$35 per spot",
  },
];

export default function LiveNow() {
  const { ref, inView } = useInView(0.05);

  return (
    <div className="bg-white w-full">
      <section className="bg-white  py-14 max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <div
          ref={ref}
          className={`flex items-end justify-between mb-8 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-blue-500" />
              <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
                Happening Now
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              <span className="text-red-500 italic">Live </span>
              <span className="text-gray-900">Right Now</span>
            </h2>
          </div>
          <a
            href="#"
            className="text-blue-500 text-sm font-semibold hover:underline whitespace-nowrap mb-1"
          >
            See all live shows →
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {shows.map((show, i) => (
            <div
              key={show.seller}
              className={`rounded-2xl border border-gray-100 overflow-hidden shadow-sm
              hover:shadow-xl hover:-translate-y-1 transition-all duration-500
              ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
              style={{ transitionDelay: `${150 + i * 120}ms` }}
            >
              {/* Image area */}
              <div
                className={`relative ${show.bg} h-52 flex items-center justify-center`}
              >
                {/* LIVE badge */}
                <div className="absolute top-3 left-3">
                  <LiveBadge />
                </div>

                {/* Viewer count */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-800/70 text-white text-[11px] font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                  <svg
                    className="w-3 h-3 opacity-80"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {show.viewers}
                </div>

                {/* Emoji product */}
                <span className="text-7xl select-none drop-shadow-md">
                  {show.emoji}
                </span>
              </div>

              {/* Card body */}
              <div className="bg-white px-4 pt-4 pb-4">
                {/* Seller row */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-full ${show.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                  >
                    {show.seller[0]}
                  </div>
                  <span className="text-gray-500 text-sm font-medium">
                    {show.seller}
                  </span>
                </div>

                {/* Title */}
                <p className="text-gray-900 font-bold text-sm leading-snug mb-3">
                  {show.title}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs">
                    {show.category} • Starting at {show.starting}
                  </span>
                  <a
                    href="#"
                    className="text-blue-500 text-sm font-semibold hover:underline whitespace-nowrap"
                  >
                    Join →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
