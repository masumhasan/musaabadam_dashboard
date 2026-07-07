"use client";

import { useEffect, useRef, useState } from "react";

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

const categories = [
  { emoji: "👟", label: "Sneakers", count: "12.4K" },
  { emoji: "⌚", label: "Watches", count: "8.7K" },
  { emoji: "👜", label: "Bags", count: "9.2K" },
  { emoji: "💎", label: "Jewelry", count: "15.6K" },
  { emoji: "🃏", label: "Trading Cards", count: "22.1K" },
  { emoji: "🧸", label: "Collectibles", count: "18.4K" },
  { emoji: "👕", label: "Clothing", count: "31K" },
  { emoji: "📱", label: "Electronics", count: "7.8K" },
  { emoji: "🎮", label: "Gaming", count: "11.2K" },
  { emoji: "🖼️", label: "Art", count: "4.3K" },
  { emoji: "📚", label: "Books & Comics", count: "6.5K" },
  { emoji: "✨", label: "More →", count: "100+", isMore: true },
];

export default function Categories() {
  const { ref, inView } = useInView(0.05);

  return (
    <section className="bg-[#EBF3FB] px-8 md:px-16 py-14">
      <div ref={ref} className="max-w-7xl mx-auto">
        {/* Header Row */}
        <div
          ref={ref}
          className={`flex items-end justify-between mb-8 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Left: label + title */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-px bg-blue-500" />
              <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
                Browse
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              <span className="text-gray-900 italic">Shop Every </span>
              <span className="text-orange-400 italic">Category</span>
            </h2>
          </div>

          {/* Right: View all */}
          <a
            href="#"
            className="text-blue-500 text-sm font-semibold hover:underline whitespace-nowrap mb-1 transition-colors duration-200"
          >
            View all categories →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              className={`bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer
              border border-transparent
              hover:border-blue-200 hover:shadow-lg hover:-translate-y-1
              transition-all duration-500
              ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
              style={{
                transitionDelay: `${100 + i * 60}ms`,
              }}
            >
              {/* Emoji icon */}
              <div className="text-4xl leading-none select-none">
                {cat.emoji}
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className={`font-bold text-sm leading-tight ${
                    cat.isMore ? "text-gray-900" : "text-gray-900"
                  }`}
                >
                  {cat.label}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
