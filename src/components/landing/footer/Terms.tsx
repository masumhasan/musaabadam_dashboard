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

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using BidsRush ("Platform", "we", "us", or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Platform. We reserve the right to modify these Terms at any time, and your continued use of the Platform following any changes constitutes acceptance of those changes. We will notify registered users of material changes via email.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to create an account and use BidsRush. By using the Platform, you represent and warrant that you are 18 or older and have the legal capacity to enter into binding agreements. Accounts created on behalf of minors are strictly prohibited and will be permanently terminated upon discovery.`,
  },
  {
    id: "accounts",
    title: "3. Account Registration",
    content: `Each user may register only one account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify BidsRush immediately of any unauthorized use of your account. BidsRush reserves the right to terminate accounts that violate our policies, including duplicate accounts, fraudulent accounts, or accounts engaged in abusive behaviour.`,
  },
  {
    id: "buying",
    title: "4. Buying & Bidding",
    content: `All bids placed on BidsRush are legally binding offers to purchase. Winning a bid creates a binding contract between you and the seller. You are obligated to complete payment within the time specified after winning. Failure to pay may result in suspension of bidding privileges. BidsRush Buyer Protection covers every transaction — if an item is not received or materially differs from its description, you are entitled to a full refund.`,
  },
  {
    id: "selling",
    title: "5. Selling",
    content: `Sellers must be approved by BidsRush before listing items. By listing an item, you represent that you have the legal right to sell it, that all descriptions are accurate, and that the item will be shipped promptly upon sale. Misrepresentation of items is a serious violation and will result in account termination and potential legal action. BidsRush charges a success fee on completed sales as detailed in our Fee Schedule.`,
  },
  {
    id: "prohibited",
    title: "6. Prohibited Items & Conduct",
    content: `The following are strictly prohibited on BidsRush: counterfeit, stolen, or illegal goods; firearms, explosives, or controlled substances; adult content; items that infringe intellectual property rights; and any item restricted by applicable law. Users may not engage in shill bidding, feedback manipulation, harassment of other users, or any activity that disrupts the integrity of the marketplace. Violations will result in immediate account suspension and reporting to relevant authorities where required.`,
  },
  {
    id: "payments",
    title: "7. Payments & Fees",
    content: `BidsRush uses third-party payment processors including Stripe. By using the Platform, you agree to their terms of service. All prices are displayed in the currency shown at checkout. BidsRush is not responsible for currency conversion fees charged by your bank or card issuer. Our commission structure is available on the Fee Schedule page and may be updated with 30 days' notice to sellers.`,
  },
  {
    id: "limitation",
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by law, BidsRush shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Platform. Our total liability to you for any claim arising from these Terms shall not exceed the amount you paid to BidsRush in the 12 months preceding the claim.`,
  },
  {
    id: "governing",
    title: "9. Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales. If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.`,
  },
  {
    id: "contact",
    title: "10. Contact",
    content: `If you have questions about these Terms, please contact our legal team at legal@bidsrush.com or by writing to: BidsRush Legal, 20 Finsbury Street, London, EC2Y 9AQ, United Kingdom.`,
  },
];

export default function Terms() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState("acceptance");

  function scrollTo(id: string) {
    setActive(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-[#EBF3FB] px-8 md:px-16 py-20">
        <div ref={ref} className="max-w-5xl mx-auto">
          <div
            className={`flex items-center gap-2 mb-4 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-6 h-px bg-blue-500" />
            <span className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
              Legal
            </span>
          </div>
          <h1
            className={`text-5xl md:text-6xl font-black italic tracking-tight mb-4 transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-gray-900">Terms of </span>
            <span className="text-blue-400">Service</span>
          </h1>
          <p
            className={`text-gray-500 text-sm transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Last updated: 1 April 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="px-8 md:px-16 py-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Contents
              </p>
              <nav className="flex flex-col gap-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`text-left text-xs py-1.5 px-2 rounded-lg transition-all duration-150 ${
                      active === s.id
                        ? "bg-blue-500 text-white font-semibold"
                        : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <p className="text-orange-700 text-sm leading-relaxed">
                <strong>Please read these Terms carefully</strong> before using
                BidsRush. They contain important information about your legal
                rights, remedies, and obligations.
              </p>
            </div>

            {sections.map((s, i) => (
              <SectionBlock key={s.id} section={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionBlock({
  section,
  index,
}: {
  section: { id: string; title: string; content: string };
  index: number;
}) {
  const { ref, inView } = useInView(0.01);
  return (
    <div
      id={section.id}
      ref={ref}
      className={`scroll-mt-8 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <h2 className="text-lg font-black text-gray-900 mb-3 pb-3 border-b border-gray-100">
        {section.title}
      </h2>
      <p className="text-gray-500 text-sm leading-7">{section.content}</p>
    </div>
  );
}
