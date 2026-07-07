"use client";
import { useState } from "react";

const items = [
  {
    name: "Louis Vuitton Speedy",
    price: "$680",
    color: "text-green-500",
    dot: "bg-green-500",
  },
  {
    name: "Vintage Marvel Comics",
    price: "$120",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  {
    name: "Adidas Yeezy 350",
    price: "$380",
    color: "text-orange-400",
    dot: "bg-orange-400",
  },
  {
    name: "KAWS Companion Figure",
    price: "$550",
    color: "text-green-500",
    dot: "bg-green-500",
  },
  {
    name: "Chanel Flap Bag",
    price: "$2,100",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  {
    name: "Nike Air Jordan 1",
    price: "$890",
    color: "text-orange-400",
    dot: "bg-orange-400",
  },
  {
    name: "Rolex Submariner",
    price: "$12,400",
    color: "text-green-500",
    dot: "bg-green-500",
  },
  {
    name: "Supreme Box Logo Tee",
    price: "$320",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  {
    name: "Pokémon Charizard PSA 10",
    price: "$890",
    color: "text-orange-400",
    dot: "bg-orange-400",
  },
];

export default function ContinuousSlider() {
  const [paused, setPaused] = useState(false);

  // Duplicate items for seamless loop
  const loopItems = [...items, ...items, ...items];

  return (
    <div className="w-full bg-white border-b border-gray-200 overflow-hidden select-none">
      <div
        className="flex items-center"
        style={{
          // Pause animation on hover
          animationPlayState: paused ? "paused" : "running",
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex items-center whitespace-nowrap"
          style={{
            animation: "marquee 30s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loopItems.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-6 py-2.5"
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dot}`}
              />
              <span className="text-gray-800 text-sm font-medium tracking-tight">
                {item.name}
              </span>
              <span className={`text-sm font-bold ${item.color}`}>
                {item.price}
              </span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}
