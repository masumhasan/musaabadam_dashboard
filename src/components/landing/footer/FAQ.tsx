"use client";

import React, { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.05) {
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
  {
    label: "Buying",
    emoji: "🛒",
    items: [
      {
        q: "How do I place a bid on BidsRush?",
        a: "Simply tap the bid button during any live stream. You can set a max bid and our auto-bid system will compete on your behalf up to your limit. You'll be notified instantly if you're outbid.",
      },
      {
        q: "Is buyer protection included on every order?",
        a: "Yes. Every purchase on BidsRush is covered by our Buyer Protection guarantee. If an item doesn't arrive or isn't as described, we'll refund you in full — no questions asked.",
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept all major credit/debit cards, Apple Pay, Google Pay, and PayPal. All transactions are encrypted and processed securely via Stripe.",
      },
      {
        q: "Can I return an item after winning?",
        a: "Returns are accepted within 3 days of delivery if the item significantly differs from its description. Contact our support team with photos and we'll handle it promptly.",
      },
    ],
  },
  {
    label: "Selling",
    emoji: "🏪",
    items: [
      {
        q: "How do I become a seller on BidsRush?",
        a: "Apply via the 'Become a Seller' page. Our team reviews every application within 24 hours. Once approved, you can start scheduling live auctions immediately.",
      },
      {
        q: "Are there any listing fees?",
        a: "Zero listing fees. We only charge a small success fee when your item sells. This keeps it risk-free for sellers of all sizes.",
      },
      {
        q: "How and when do I get paid?",
        a: "Payouts are processed within 2 business days after a successful sale and delivery confirmation. Funds are sent directly to your linked bank account or PayPal.",
      },
      {
        q: "What categories can I sell in?",
        a: "Sneakers, Watches, Bags, Jewelry, Trading Cards, Collectibles, Clothing, Electronics, Gaming, Art, Books & Comics, and more. Contact us if you'd like to sell in an unlisted category.",
      },
    ],
  },
  {
    label: "Account",
    emoji: "👤",
    items: [
      {
        q: "How do I reset my password?",
        a: "Go to the login page and tap 'Forgot Password'. Enter your email address and we'll send a reset link within a few minutes. Check your spam folder if it doesn't arrive.",
      },
      {
        q: "Can I have multiple accounts?",
        a: "No. Each user is permitted one account. Multiple accounts violate our terms of service and may result in a permanent ban from the platform.",
      },
      {
        q: "How do I delete my account?",
        a: "Navigate to Settings → Privacy → Delete Account. Note that account deletion is permanent and cannot be reversed. All purchase history and seller data will be removed.",
      },
    ],
  },
];

function AccordionItem({
  q,
  a,
  delay,
  inView,
}: {
  q: string;
  a: string;
  delay: number;
  inView: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-500 hover:border-blue-200 hover:shadow-sm ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left group"
      >
        <span className="text-gray-900 font-semibold text-sm pr-4 group-hover:text-blue-500 transition-colors duration-200">
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-300 ${
            open ? "rotate-45 bg-blue-500 border-blue-500 text-white" : ""
          }`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { ref, inView } = useInView();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#EBF3FB] px-8 md:px-16 py-20 text-center">
        <div ref={ref}>
          <div
            className={`flex items-center justify-center gap-2 mb-4 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-6 h-px bg-blue-500" />
            <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
              Support
            </span>
            <div className="w-6 h-px bg-blue-500" />
          </div>
          <h1
            className={`text-5xl md:text-6xl font-black italic tracking-tight mb-4 transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-gray-900">Frequently Asked </span>
            <span className="text-blue-400">Questions</span>
          </h1>
          <p
            className={`text-gray-500 text-base max-w-lg mx-auto transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Everything you need to know about buying, selling, and managing your
            BidsRush account.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="px-8 md:px-16 py-14 max-w-4xl mx-auto">
        {/* Category Tabs */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                activeTab === i
                  ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-100"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <CategorySection key={activeTab} items={categories[activeTab].items} />

        {/* Still need help */}
        <div className="mt-14 bg-blue-50 rounded-3xl p-8 text-center border border-blue-100">
          <p className="text-gray-900 font-bold text-lg mb-1">
            Still have questions?
          </p>
          <p className="text-gray-400 text-sm mb-5">
            Our support team is available 7 days a week.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-7 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Contact Support →
          </a>
        </div>
      </section>
    </main>
  );
}

function CategorySection({ items }: { items: { q: string; a: string }[] }) {
  const { ref, inView } = useInView(0.01);
  return (
    <div ref={ref} className="flex flex-col gap-3">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          q={item.q}
          a={item.a}
          delay={i * 70}
          inView={inView}
        />
      ))}
    </div>
  );
}
