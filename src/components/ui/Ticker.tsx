import React from "react";
import { NEXT_RUN_TICKER } from "@/lib/data";

interface TickerProps {
  items?: string[];
  className?: string;
}

export function Ticker({ items = NEXT_RUN_TICKER, className }: TickerProps) {
  const repeated = [...items, ...items, ...items];

  return (
    <div
      className={`overflow-hidden whitespace-nowrap bg-club-deepNavy text-white py-2.5 border-y border-white/10 ${className || ""}`}
      aria-hidden="true"
    >
      <div className="animate-ticker flex items-center gap-8 text-xs font-mono tracking-telemetry uppercase select-none">
        {repeated.map((text, i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="text-neutral-200/90 hover:text-club-crimson transition-colors duration-150">
              {text}
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-club-burgundy/80" />
          </div>
        ))}
      </div>
    </div>
  );
}

