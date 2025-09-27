"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type RotatorItem = { src: string; leftText: string; rightText: string };

export default function ClientImageRotator({
  items,
  intervalMs = 8000,
  fadeMs = 800,
}: {
  items: RotatorItem[];
  intervalMs?: number;
  fadeMs?: number;
}) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(() => {
      setFade(false);
      const t = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setFade(true);
      }, fadeMs);
      return () => clearTimeout(t);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [items, intervalMs, fadeMs]);

  const item = items[current];

  return (
    <div className="relative w-full h-screen">
      {/* Background image */}
      <div className={`fixed top-0 left-0 w-full h-screen z-[-1] transition-opacity`} style={{ transitionDuration: `${fadeMs}ms` }}>
        <Image
          key={item.src}
          src={item.src}
          alt="Background"
          fill
          priority
          className={`object-cover ${fade ? "opacity-100" : "opacity-0"}`}
          sizes="100vw"
        />
      </div>

      {/* Edge texts */}
      <div className="relative z-10 w-full h-full">
        <div className="absolute inset-0 flex items-center">
          {/* Left text */}
          <h2
            className={`absolute left-1 top-1/2 -translate-y-1/2 ml-5 text-mtoko-light font-bold text-xl sm:text-3xl lg:text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform`}
            style={{ transform: `translateY(-50%) ${fade ? "translateX(0)" : "translateX(-20px)"}` }}
          >
            {item.leftText}
          </h2>
          {/* Right text */}
          <h2
            className={`absolute right-1 top-1/2 -translate-y-1/2 mr-5 text-mtoko-light font-bold text-xl sm:text-3xl lg:text-5xl text-right drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform`}
            style={{ transform: `translateY(-50%) ${fade ? "translateX(0)" : "translateX(20px)"}` }}
          >
            {item.rightText}
          </h2>
        </div>
      </div>
    </div>
  );
}
