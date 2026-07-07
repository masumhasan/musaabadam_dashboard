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

function Stars() {
  return (
    <div className="flex items-center gap-1 mb-5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const reviews = [
  {
    quote:
      "I've tried every live shopping app and BidsRush is on another level. The auctions are exciting, the sellers are legit, and I've scored deals I'd never find elsewhere.",
    name: "Marcus J.",
    role: "Sneaker Collector, London",
    avatarColor: "bg-blue-500",
  },
  {
    quote:
      "As a seller, BidsRush completely changed my business. I went from £500/month on other platforms to £8,000 in my first month here. The live format just works.",
    name: "Sarah K.",
    role: "Verified Seller, Manchester",
    avatarColor: "bg-yellow-400",
  },
  {
    quote:
      "The giveaways and flash sales make every stream exciting. I got a PSA 10 Charizard for £90 in a flash sale. The community here is incredible and super active.",
    name: "Liam T.",
    role: "Card Collector, Birmingham",
    avatarColor: "bg-teal-500",
  },
];

export default function Testimonials() {
  const { ref, inView } = useInView(0.05);

  return (
    // bg-white
    <div className="bg-white w-full">
      <section className="  py-16 max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <div
          ref={ref}
          className={`mb-10 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-px bg-teal-500" />
            <span className="text-xs font-semibold tracking-widest text-teal-500 uppercase">
              Trusted by Thousands
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tight leading-tight">
            <span className="text-gray-900">What Our </span>
            <span className="text-teal-500">Community Says</span>
          </h2>

          {/* Underline accent */}
          <div className="mt-3 w-10 h-1 rounded-full bg-gradient-to-r from-blue-500 to-orange-400" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              className={`bg-blue-50 rounded-2xl p-6 flex flex-col justify-between
              border border-blue-100
              hover:shadow-lg hover:-translate-y-1
              transition-all duration-500
              ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              {/* Stars */}
              <Stars />

              {/* Quote */}
              <p className="text-gray-700 text-sm leading-relaxed italic flex-1 mb-6">
                {review.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-blue-100">
                <div
                  className={`w-9 h-9 rounded-full ${review.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-bold leading-tight">
                    {review.name}
                  </p>
                  <p className="text-gray-400 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
