"use client";

import React, { useEffect, useRef, useState } from "react";

// Animated number component
function AnimatedStep({
  number,
  isActive,
}: {
  number: string;
  isActive: boolean;
}) {
  return (
    <span
      className={`font-black text-5xl leading-none transition-colors duration-500 ${
        isActive ? "text-blue-200" : "text-gray-200"
      }`}
    >
      {number}
    </span>
  );
}

// Hook for intersection observer
function useInView(threshold = 0.15) {
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

const steps = [
  {
    number: "01",
    title: "Sign Up & Set Preferences",
    desc: "Create your free account, choose your favourite categories — Shoes, Watches, Bags, Collectibles and more.",
    active: true,
  },
  {
    number: "02",
    title: "Join Live Auction Streams",
    desc: "Browse hundreds of live shows happening right now. Watch, chat with the seller, and place your bid in real-time.",
    active: false,
  },
  {
    number: "03",
    title: "Win & Get It Delivered",
    desc: "Win the auction, pay securely, and receive your item with buyer protection guaranteed on every order.",
    active: false,
  },
];

const features = [
  {
    icon: "🎯",
    iconBg: "bg-red-100",
    title: "Real-Time Bidding",
    desc: "Watch bids come in live. Set a max bid and let BidsRush auto-bid for you up to your limit.",
  },
  {
    icon: "🔒",
    iconBg: "bg-yellow-100",
    title: "Secure Payments",
    desc: "All transactions are encrypted and protected. Your money is held safely until delivery confirmed.",
  },
  {
    icon: "🎁",
    iconBg: "bg-orange-100",
    title: "Flash Sales & Giveaways",
    desc: "Sellers run exclusive flash deals and giveaways only available during live streams.",
  },
  {
    icon: "✅",
    iconBg: "bg-green-100",
    title: "Verified Sellers Only",
    desc: "Every seller on BidsRush goes through an approval process. Shop with total confidence.",
  },
];

export default function HowItWorks() {
  const { ref: sectionRef, inView } = useInView(0.1);

  return (
    <div className="bg-white w-full">
      <section
        ref={sectionRef}
        className="bg-white py-16 lg:px-20 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 justify-center items-center">
          {/* LEFT COLUMN */}
          <div>
            {/* HOW IT WORKS label */}
            <div
              className={`flex items-center gap-2 mb-5 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="w-6 h-px bg-blue-500" />
              <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                How It Works
              </span>
            </div>

            {/* Headline */}
            <div
              className={`mb-4 transition-all duration-700 delay-100 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <h2 className="text-5xl md:text-6xl font-black leading-tight text-gray-900 tracking-tight">
                Live
                <br />
                Shopping,
              </h2>
              <h2 className="text-5xl md:text-6xl font-black leading-tight italic text-blue-400 tracking-tight">
                Reimagined
              </h2>
            </div>

            {/* Subtitle */}
            <p
              className={`text-gray-500 text-base leading-relaxed mb-10 max-w-sm transition-all duration-700 delay-200 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Experience the thrill of live auctions from your phone. Join
              thousands of buyers scoring incredible deals every day.
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-1">
              {steps.map((step, i) => (
                <div
                  key={step.number}
                  className={`flex items-start gap-5 rounded-2xl px-5 py-4 transition-all duration-700 ${
                    inView
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-8"
                  } ${step.active ? "bg-blue-50 border border-blue-100" : "bg-transparent"}`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <AnimatedStep number={step.number} isActive={step.active} />
                  <div className="pt-1">
                    <h3
                      className={`font-bold text-base mb-1 ${
                        step.active ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        step.active ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className={`bg-gray-50 rounded-2xl p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-500 ${
                  inView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${400 + i * 120}ms` }}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${feat.iconBg}`}
                >
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
