"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

// ─── Floating Stat Card ───────────────────────────────────────────────────────
function FloatCard({
  label,
  price,
  sub,
  priceColor,
  className = "",
}: {
  label: string;
  price: string;
  sub: string;
  priceColor: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute bg-white rounded-2xl shadow-2xl px-4 py-3 min-w-[152px] z-20 ${className}`}
    >
      <p className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase mb-1">
        {label}
      </p>
      <p className={`text-3xl font-black leading-none ${priceColor}`}>
        {price}
      </p>
      <p className="text-[11px] text-slate-500 mt-1">{sub}</p>
    </div>
  );
}

// ─── Auction App Mockup ───────────────────────────────────────────────────────
function AuctionApp() {
  const [totalSec, setTotalSec] = useState(201);

  useEffect(() => {
    const id = setInterval(() => setTotalSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const mm = pad(Math.floor(totalSec / 60));
  const ss = pad(totalSec % 60);

  return (
    <div className="relative w-[300px] bg-white rounded-[36px] shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-visible pb-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-0 bg-gradient-to-b from-[#c8d8ec] to-[#eaf3ff] rounded-t-[36px]">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
        <span className="text-[13px] font-bold text-slate-800 flex-1">
          JordanKicks_Live
        </span>
        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          ● LIVE
        </span>
        <span className="bg-slate-200 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
          👁 2.4k
        </span>
      </div>

      {/* ── Product image ── */}
      <div className="bg-gradient-to-b from-[#d6e8fa] to-[#eef5ff] flex items-center justify-center py-6 px-4 min-h-[150px]">
        <Image
          src="/catch.png"
          alt="Air Jordan 1 Retro High"
          width={150}
          height={100}
          className="object-contain drop-shadow-xl"
          style={{ transform: "rotate(-12deg)" }}
        />
      </div>

      {/* ── Bid row ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <p className="text-[13px] font-bold text-slate-800">
            Air Jordan 1 Retro High
          </p>
          <p className="text-[12px] text-slate-400">
            14 bids — <span className="text-amber-500 font-bold">$247</span>
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold px-3 py-2 rounded-lg transition-colors">
          BID NOW
        </button>
      </div>

      {/* ── Timer ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 border-b border-amber-100">
        <span className="text-[11px] font-semibold text-amber-900 tracking-wide">
          ⏳ ENDS IN
        </span>
        <div className="flex items-center gap-1">
          {["00", mm, ss].map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="text-xl font-black text-amber-500 leading-none">
                  :
                </span>
              )}
              <span className="text-xl font-black text-amber-500 tabular-nums w-7 text-center leading-none">
                {seg}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Chat ── */}
      <div className="px-4 pt-3 pb-1 flex flex-col gap-2">
        {[
          {
            dot: "bg-blue-500",
            name: "mike_b",
            nameColor: "text-blue-500",
            msg: "Let's go! 🔥",
          },
          {
            dot: "bg-amber-500",
            name: "sneakerhead",
            nameColor: "text-amber-500",
            msg: "Placing my max bid now",
          },
          {
            dot: "bg-teal-500",
            name: "jordan_fan",
            nameColor: "text-teal-500",
            msg: "These are clean!",
          },
        ].map(({ dot, name, nameColor, msg }) => (
          <div
            key={name}
            className="flex items-center gap-2 text-[12px] text-slate-700"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
            <span className={`font-bold ${nameColor}`}>{name}</span>
            <span className="text-slate-500">{msg}</span>
          </div>
        ))}
      </div>

      {/* ── Input ── */}
      <div className="flex items-center gap-2 px-4 pt-2">
        <input
          readOnly
          placeholder="Say something..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-[12px] text-slate-400 outline-none"
        />
        <button className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center flex-shrink-0">
          ▶
        </button>
      </div>

      {/* ── Floating cards ── */}
      <FloatCard
        label="🔥 Hot Bid"
        price="$247"
        sub="Nike Air Jordan 1 Retro"
        priceColor="text-amber-500"
        className="-left-[110px] top-[90px] [animation:floatA_3s_ease-in-out_infinite]"
      />
      <FloatCard
        label="⏰ Ending Soon"
        price="04:17"
        sub="Rolex Submariner"
        priceColor="text-blue-600"
        className="-right-[120px] top-[50px] [animation:floatB_3.5s_ease-in-out_infinite]"
      />
      <FloatCard
        label="✅ Just Sold"
        price="$890"
        sub="Vintage Comic #52"
        priceColor="text-emerald-500"
        className="-left-[90px] bottom-[50px] [animation:floatC_4s_ease-in-out_infinite]"
      />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes floatA {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-9px); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.5; transform:scale(1.4); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .animate-pulse-dot  { animation: pulseDot 1.4s ease-in-out infinite; }
        .fade-up-0 { animation: fadeUp .6s ease both .05s; }
        .fade-up-1 { animation: fadeUp .6s ease both .18s; }
        .fade-up-2 { animation: fadeUp .6s ease both .32s; }
        .fade-up-3 { animation: fadeUp .6s ease both .46s; }
        .fade-up-4 { animation: fadeUp .6s ease both .58s; }
        .font-barlow { font-family: 'Barlow Condensed', sans-serif; }
        .font-dm     { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <section
        className="font-dm relative  bg-[#f0f4f8] overflow-hidden
                          flex items-center gap-12 px-20 py-16
                          lg:px-12
                          md:flex-col md:px-10 md:py-14 md:text-center
                          sm:px-6"
      >
        {/* radial bg blob */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_85%_40%,#d9eaff,transparent)]" />

        {/* content */}
        <div className=" container flex flex-col md:flex-row">
          {/* ── LEFT: Copy ── */}
          <div className="relative z-10 flex-1 max-w-[500px] md:max-w-full">
            {/* Live pill */}
            <div
              className="fade-up-0 inline-flex items-center gap-2 bg-slate-200/80 border border-slate-300/60
                          rounded-full px-4 py-1.5 text-[12px] font-semibold text-slate-500 tracking-wide mb-7"
            >
              <span className="animate-pulse-dot inline-block w-2 h-2 rounded-full bg-red-500" />
              2,400+ LIVE AUCTIONS RIGHT NOW
            </div>

            {/* Headline */}
            <h1
              className="font-barlow fade-up-1 flex flex-col font-black leading-[.93] mb-6 md:items-center"
              style={{ fontSize: "clamp(72px, 9vw, 108px)" }}
            >
              <span className="text-slate-900">BID.</span>
              <span className="text-amber-400">WIN.</span>
              <span className="text-slate-800">RUSH.</span>
            </h1>

            {/* Body copy */}
            <p className="fade-up-2 text-[16px] leading-relaxed text-slate-500 max-w-[420px] mb-9 md:mx-auto">
              The ultimate live auction marketplace. Shop, bid, and connect with
              sellers in real-time across thousands of categories — from
              sneakers to collectibles.
            </p>

            {/* CTAs */}
            <div className="fade-up-3 flex items-center gap-5 flex-wrap mb-12 md:justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white
                         text-[15px] font-semibold px-7 py-3.5 rounded-xl
                         shadow-lg shadow-blue-200 transition-all duration-200 whitespace-nowrap"
              >
                Start Shopping →
              </button>
              <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 text-[14px] font-medium transition-colors">
                <span className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                  ▶
                </span>
                Watch a Live Drop
              </button>
            </div>

            {/* Stats */}
            <div className="fade-up-4 flex gap-10 flex-wrap md:justify-center">
              {[
                {
                  num: "4.8M+",
                  label: "Active Buyers",
                  color: "text-blue-600",
                },
                {
                  num: "50K+",
                  label: "Verified Sellers",
                  color: "text-amber-500",
                },
                {
                  num: "98%",
                  label: "Satisfaction Rate",
                  color: "text-cyan-600",
                },
              ].map(({ num, label, color }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span
                    className={`font-barlow font-black text-[32px] leading-none ${color}`}
                  >
                    {num}
                  </span>
                  <span className="text-[13px] text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Mockup ── */}
          <div
            className="relative z-10 flex-1 flex justify-center items-center
                     py-16
                     md:w-full md:py-20 md:px-24
                     sm:px-16
                     xs:px-4"
          >
            <AuctionApp />
          </div>
        </div>
      </section>
    </>
  );
}
