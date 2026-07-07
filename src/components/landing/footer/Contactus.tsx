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

const contactMethods = [
  {
    icon: "💬",
    title: "Live Chat",
    desc: "Chat with our support team in real-time. Available Mon–Fri, 9am–6pm GMT.",
    action: "Start Chat",
    color: "bg-blue-50 border-blue-100",
    btnColor: "bg-blue-500 hover:bg-blue-600",
  },
  {
    icon: "✉️",
    title: "Email Support",
    desc: "Send us a message and we'll respond within 24 hours on business days.",
    action: "Send Email",
    color: "bg-orange-50 border-orange-100",
    btnColor: "bg-orange-400 hover:bg-orange-500",
  },
  {
    icon: "📞",
    title: "Phone Support",
    desc: "Talk to a specialist directly. Available for verified sellers and Pro accounts.",
    action: "Request Call",
    color: "bg-teal-50 border-teal-100",
    btnColor: "bg-teal-500 hover:bg-teal-600",
  },
];

const topics = [
  "General Enquiry",
  "Buying / Bidding",
  "Selling / Payouts",
  "Account & Security",
  "Technical Issue",
  "Report a User",
  "Press & Media",
  "Other",
];

export default function ContactUs() {
  const { ref, inView } = useInView();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

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
              Get in Touch
            </span>
            <div className="w-6 h-px bg-blue-500" />
          </div>
          <h1
            className={`text-5xl md:text-6xl font-black italic tracking-tight mb-4 transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-gray-900">We're Here </span>
            <span className="text-blue-400">to Help</span>
          </h1>
          <p
            className={`text-gray-500 text-base max-w-lg mx-auto transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Choose how you'd like to reach us. Our team is ready to assist with
            any questions or issues.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="px-8 md:px-16 py-14 max-w-5xl mx-auto">
        <ContactCards />

        {/* Form */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <FormSection
            submitted={submitted}
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
          />

          {/* Side info */}
          <SideInfo />
        </div>
      </section>
    </main>
  );
}

function ContactCards() {
  const { ref, inView } = useInView(0.01);
  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {contactMethods.map((m, i) => (
        <div
          key={m.title}
          className={`border rounded-2xl p-6 flex flex-col gap-4 ${m.color} transition-all duration-500 hover:-translate-y-1 hover:shadow-md ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <span className="text-3xl">{m.icon}</span>
          <div>
            <p className="font-bold text-gray-900 mb-1">{m.title}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
          </div>
          <button
            className={`self-start text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${m.btnColor}`}
          >
            {m.action}
          </button>
        </div>
      ))}
    </div>
  );
}

function FormSection({
  submitted,
  form,
  setForm,
  handleSubmit,
}: {
  submitted: boolean;
  form: { name: string; email: string; topic: string; message: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  const { ref, inView } = useInView(0.01);
  return (
    <div
      ref={ref}
      className={`lg:col-span-3 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <h2 className="text-2xl font-black italic text-gray-900 mb-6">
        Send a Message
      </h2>

      {submitted ? (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-bold text-gray-900 text-lg mb-1">
            Message Received!
          </p>
          <p className="text-gray-400 text-sm">
            We'll get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Marcus Johnson"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Topic
            </label>
            <select
              required
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white"
            >
              <option value="" disabled>
                Select a topic…
              </option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your issue or question in detail…"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
            />
          </div>
          <button
            type="submit"
            className="self-start bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg shadow-blue-100"
          >
            Send Message →
          </button>
        </form>
      )}
    </div>
  );
}

function SideInfo() {
  const { ref, inView } = useInView(0.01);
  return (
    <div
      ref={ref}
      className={`lg:col-span-2 flex flex-col gap-5 transition-all duration-700 delay-150 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Response Times
        </p>
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Live Chat", time: "~2 min", color: "text-teal-500" },
            { label: "Email", time: "< 24 hrs", color: "text-blue-500" },
            { label: "Phone", time: "< 1 hr", color: "text-orange-400" },
          ].map((r) => (
            <div
              key={r.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-600">{r.label}</span>
              <span className={`font-bold ${r.color}`}>{r.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Office Hours
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Monday – Friday
          <br />
          <span className="font-bold text-gray-900">9:00 AM – 6:00 PM GMT</span>
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Email support available 24/7
        </p>
      </div>
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
          Quick Links
        </p>
        {["Help Center", "FAQ", "Buyer Protection", "Seller Guide"].map(
          (link) => (
            <a
              key={link}
              href="#"
              className="block text-sm text-blue-500 hover:text-blue-700 py-1 transition-colors duration-150"
            >
              → {link}
            </a>
          ),
        )}
      </div>
    </div>
  );
}
