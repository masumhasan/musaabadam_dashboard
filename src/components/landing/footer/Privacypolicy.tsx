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

const principles = [
  {
    emoji: "🔒",
    title: "We don't sell your data",
    desc: "Your personal information is never sold to third parties, ever.",
  },
  {
    emoji: "👁️",
    title: "Full transparency",
    desc: "We tell you exactly what we collect and why in plain language.",
  },
  {
    emoji: "⚙️",
    title: "You're in control",
    desc: "You can request, export, or delete your data at any time.",
  },
  {
    emoji: "🛡️",
    title: "Secure by default",
    desc: "All data is encrypted in transit and at rest using AES-256.",
  },
];

const sections = [
  {
    id: "collect",
    title: "1. What We Collect",
    content: `We collect information you provide directly to us, such as your name, email address, phone number, billing details, and any information you submit when creating an account, completing a purchase, or contacting support. We also automatically collect certain technical data when you use our Platform, including your IP address, browser type, device identifiers, pages visited, and interactions with live streams and auctions. This is used to improve platform performance and security.`,
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    content: `Your information is used to: operate and improve the BidsRush Platform; process transactions and send related communications; verify your identity and prevent fraud; personalise your experience and recommend relevant auctions; send promotional communications (with your consent); comply with legal obligations; and resolve disputes and enforce our agreements. We process your data on the legal bases of contract performance, legitimate interests, and your consent where required.`,
  },
  {
    id: "sharing",
    title: "3. Information Sharing",
    content: `We do not sell, rent, or trade your personal information to third parties. We may share your data with: trusted service providers who assist us in operating the Platform (payment processors, cloud hosting, analytics); sellers, limited to what is necessary to fulfil your order (e.g., delivery address); law enforcement or regulators where required by law; and successor entities in the event of a merger or acquisition. All third-party partners are bound by data processing agreements.`,
  },
  {
    id: "cookies",
    title: "4. Cookies & Tracking",
    content: `We use cookies and similar technologies to keep you logged in, remember your preferences, analyse usage patterns, and deliver targeted advertising (only with your consent). You can manage your cookie preferences at any time via our Cookie Settings page. Disabling non-essential cookies will not affect your ability to use core Platform features. We use Google Analytics and similar tools in an anonymised or aggregated form where possible.`,
  },
  {
    id: "retention",
    title: "5. Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide services. If you close your account, we will delete or anonymise your data within 90 days, except where we are required by law to retain it (e.g., transaction records for tax purposes, which are kept for 7 years). Backup copies may persist for up to 30 additional days before being purged from all systems.`,
  },
  {
    id: "rights",
    title: "6. Your Rights",
    content: `Under GDPR and applicable data protection laws, you have the right to: access your personal data; correct inaccurate data; request deletion of your data ('right to be forgotten'); restrict or object to processing; data portability (receiving your data in a machine-readable format); and withdraw consent at any time without affecting prior processing. To exercise any of these rights, contact privacy@bidsrush.com. We will respond within 30 days.`,
  },
  {
    id: "children",
    title: "7. Children's Privacy",
    content: `BidsRush is not directed at children under the age of 18. We do not knowingly collect personal data from minors. If we become aware that a child has provided us with personal information, we will take immediate steps to delete it. If you believe a child has submitted data to us, please contact us immediately at privacy@bidsrush.com.`,
  },
  {
    id: "security",
    title: "8. Security Measures",
    content: `We implement industry-standard security measures including TLS encryption for data in transit, AES-256 encryption for data at rest, regular penetration testing, multi-factor authentication options, and strict internal access controls. Despite these measures, no system can guarantee absolute security. In the event of a data breach that poses a high risk to your rights, we will notify you and relevant authorities within 72 hours as required by law.`,
  },
  {
    id: "changes",
    title: "9. Policy Changes",
    content: `We may update this Privacy Policy from time to time. If we make material changes, we will notify you via email and display a prominent notice on the Platform at least 14 days before the changes take effect. Your continued use of BidsRush after the effective date constitutes acceptance of the updated policy. We encourage you to review this policy periodically.`,
  },
  {
    id: "contact",
    title: "10. Contact & DPO",
    content: `Our Data Protection Officer (DPO) can be reached at privacy@bidsrush.com. You also have the right to lodge a complaint with your local data protection authority. In the UK, this is the Information Commissioner's Office (ICO) at ico.org.uk. Our registered address is: BidsRush Ltd, 20 Finsbury Street, London, EC2Y 9AQ, United Kingdom.`,
  },
];

export default function PrivacyPolicy() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState("collect");

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
            <div className="w-6 h-px bg-teal-500" />
            <span className="text-xs font-semibold tracking-widest text-teal-500 uppercase">
              Legal
            </span>
          </div>
          <h1
            className={`text-5xl md:text-6xl font-black italic tracking-tight mb-4 transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-gray-900">Privacy </span>
            <span className="text-teal-500">Policy</span>
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

      {/* Principles */}
      <section className="px-8 md:px-16 py-10 bg-white border-b border-gray-100">
        <PrinciplesGrid />
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
                        ? "bg-teal-500 text-white font-semibold"
                        : "text-gray-500 hover:text-teal-500 hover:bg-teal-50"
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
            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
              <p className="text-teal-700 text-sm leading-relaxed">
                <strong>Your privacy matters to us.</strong> This policy
                explains what data we collect, how we use it, and the choices
                you have. We're committed to being fully transparent.
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

function PrinciplesGrid() {
  const { ref, inView } = useInView(0.01);
  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto"
    >
      {principles.map((p, i) => (
        <div
          key={p.title}
          className={`flex flex-col gap-2 transition-all duration-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <span className="text-2xl">{p.emoji}</span>
          <p className="font-bold text-gray-900 text-sm">{p.title}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
        </div>
      ))}
    </div>
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
