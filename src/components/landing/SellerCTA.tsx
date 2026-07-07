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

// Animated counter hook
function useCounter(target: number, inView: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

const perks = [
  "Zero listing fees",
  "Fast payouts",
  "Seller protection",
  "Dedicated support",
];

function StatItem({
  value,
  label,
  color,
  inView,
  delay,
}: {
  value: string;
  label: string;
  color: string;
  inView: boolean;
  delay: number;
}) {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className={`text-2xl font-black ${color}`}>{value}</span>
      <span className="text-gray-500 text-xs mt-0.5">{label}</span>
    </div>
  );
}

export default function SellerCTA() {
  const { ref, inView } = useInView(0.1);

  return (
    <section className="bg-[#EBF3FB] px-6 md:px-14 py-10">
      {/* Outer card with gradient */}
      <div
        ref={ref}
        className={`relative max-w-7xl mx-auto rounded-3xl overflow-hidden transition-all duration-700 ${
          inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          background:
            "linear-gradient(120deg, #dce9f8 0%, #e8eef7 40%, #f5ede0 75%, #f0e4cc 100%)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-10 md:px-16 py-14 ">
          {/* LEFT */}
          <div className="flex flex-col justify-center">
            {/* Label */}
            <div
              className={`flex items-center gap-2 mb-5 transition-all duration-700 delay-100 ${
                inView
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-6"
              }`}
            >
              <div className="w-6 h-px bg-orange-400" />
              <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">
                For Sellers
              </span>
            </div>

            {/* Headline */}
            <div
              className={`mb-5 transition-all duration-700 delay-150 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tight leading-[1.05]">
                <span className="text-gray-900">Turn Your</span>
                <br />
                <span className="text-orange-400">Passion</span>
                <br />
                <span className="text-gray-900">Into Profit</span>
              </h2>
            </div>

            {/* Subtitle */}
            <p
              className={`text-gray-500 text-sm leading-relaxed mb-7 max-w-xs transition-all duration-700 delay-200 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Join thousands of sellers turning their passion into income. Start
              streaming your auctions today.
            </p>

            {/* Perks */}
            <div
              className={`flex flex-wrap gap-x-5 gap-y-2 transition-all duration-700 delay-300 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-1.5">
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-orange-400">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-600 text-xs font-medium">
                    {perk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-center justify-center gap-6">
            {/* CTA Button */}
            <div
              className={`w-full max-w-xs transition-all duration-700 delay-200 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <button className="w-full bg-orange-400 hover:bg-orange-500 active:scale-95 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all duration-200">
                Become a Seller →
              </button>
              <p className="text-center text-gray-400 text-xs mt-2">
                Free to apply • Approved in 24hrs
              </p>
            </div>

            {/* Stats */}
            <div
              className={`flex items-center gap-10 transition-all duration-700 delay-350 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <StatItem
                value="50K+"
                label="Active Sellers"
                color="text-orange-400"
                inView={inView}
                delay={400}
              />
              <StatItem
                value="$12M"
                label="Paid Out Monthly"
                color="text-orange-400"
                inView={inView}
                delay={500}
              />
              <div
                className={`flex flex-col items-center transition-all duration-700 ${
                  inView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <span className="text-2xl font-black text-teal-500 flex items-center gap-1">
                  4.9
                  <svg
                    className="w-5 h-5 text-teal-400 fill-teal-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
                <span className="text-gray-500 text-xs mt-0.5">
                  Seller Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
