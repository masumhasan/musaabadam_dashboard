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

const features = [
  { emoji: "🔔", label: "Live bid alerts" },
  { emoji: "⚡", label: "Instant notifications" },
  { emoji: "💳", label: "One-tap checkout" },
  { emoji: "📦", label: "Order tracking" },
];

// Apple logo SVG
function AppleLogo() {
  return (
    <svg viewBox="0 0 814 1000" className="w-5 h-5 fill-current">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.3-142.9-98.7C69.3 688 26.5 583.5 26.5 482c0-198.4 131.4-303.3 260.5-303.3 66.6 0 121.9 43.5 163.6 43.5 39.5 0 101.7-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
}

// Google Play logo SVG
function PlayLogo() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M3.18 23.76A2 2 0 0 1 2 22V2A2 2 0 0 1 3.18.24l11.25 11.75-11.25 11.77zM21.54 10.27l-3.06-1.75L15.2 12l3.28 3.48 3.06-1.74a2 2 0 0 0 0-3.47zM5.07 1.1L17.1 10.8 14 12l-8.93-10.9zM5.07 22.9L14 12l3.1 1.2L5.07 22.9z" />
    </svg>
  );
}

export default function DownloadApp() {
  const { ref, inView } = useInView(0.05);

  return (
    <section className="bg-[#F2F4F7] px-8 md:px-16 py-16   ">
      <div
        ref={ref}
        className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-6xl max-w-7xl mx-auto"
      >
        {/* LEFT */}
        <div>
          {/* Label */}
          <div
            className={`flex items-center gap-2 mb-4 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-6 h-px bg-blue-500" />
            <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
              Get the App
            </span>
          </div>

          {/* Headline */}
          <div
            className={`mb-5 transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="text-5xl md:text-6xl font-black italic tracking-tight leading-[1.05]">
              <span className="text-gray-900">Download</span>
              <br />
              <span className="text-blue-400">BidsRush</span>
              <br />
              <span className="text-gray-900">Today</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p
            className={`text-gray-500 text-sm leading-relaxed mb-8 max-w-sm transition-all duration-700 delay-150 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Take BidsRush anywhere. Never miss a deal with instant notifications
            and one-tap bidding.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            {features.map((feat, i) => (
              <div
                key={feat.label}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  inView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: `${250 + i * 80}ms` }}
              >
                {/* Icon pill */}
                <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                  {feat.emoji}
                </div>
                <span className="text-gray-700 text-sm font-medium">
                  {feat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div
          className={`flex flex-col gap-5 transition-all duration-700 delay-200 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* QR card */}
          <div className="bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-gray-100">
            {/* QR placeholder — blue gradient square */}
            <div className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden">
              <div
                className="w-full h-full rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
                }}
              />
            </div>
            <div>
              <p className="text-gray-900 font-bold text-base mb-1">
                Scan to Download
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Point your camera at the QR code to install BidsRush on iOS or
                Android
              </p>
            </div>
          </div>

          {/* Store buttons */}
          <div className="flex items-center gap-4">
            {/* App Store */}
            <a
              href="#"
              className="flex items-center gap-3 border border-gray-200 bg-white rounded-xl px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex-1"
            >
              <AppleLogo />
              <div className="leading-tight">
                <p className="text-gray-400 text-[10px]">Download on the</p>
                <p className="text-gray-900 font-bold text-sm">App Store</p>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="#"
              className="flex items-center gap-3 border border-gray-200 bg-white rounded-xl px-5 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex-1"
            >
              <PlayLogo />
              <div className="leading-tight">
                <p className="text-gray-400 text-[10px]">Get it on</p>
                <p className="text-gray-900 font-bold text-sm">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
