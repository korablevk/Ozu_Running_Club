import React from "react";
import { PARTNERS } from "@/lib/data";
import { ArrowUpRight, Tag, ShieldCheck } from "lucide-react";

export function PartnersSection() {
  return (
    <section className="py-16 sm:py-24 bg-canvas-subtle border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <span className="text-xs font-mono uppercase tracking-telemetry text-neutral-500 font-semibold block mb-2">
            05 • Ecosystem & Support
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
            Partners & Sponsors
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
            Backed by leading athletic brands and university organizations to keep our runners equipped, fueled, and racing.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PARTNERS.map((partner) => {
            const isRunaway = partner.name.includes("Runaway");
            return (
              <div
                key={partner.id}
                className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-300 hover:shadow-lg ${
                  isRunaway
                    ? "bg-asphalt-black text-white border-neutral-800"
                    : "bg-white text-asphalt-black border-neutral-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-telemetry font-bold px-2.5 py-1 rounded ${
                        isRunaway
                          ? "bg-volt text-asphalt-black"
                          : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {partner.tier}
                    </span>

                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isRunaway
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-2xl font-black font-display tracking-tight uppercase">
                    {partner.logoText}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm mt-3 leading-relaxed ${
                      isRunaway ? "text-neutral-300" : "text-neutral-600"
                    }`}
                  >
                    {partner.perkDescription}
                  </p>
                </div>

                {/* Perk Badge / Action */}
                <div className="mt-8 pt-4 border-t border-current/10 flex items-center justify-between">
                  {partner.discountCode ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <Tag className="w-3.5 h-3.5 text-volt" />
                      <span className="font-bold text-volt">CODE: {partner.discountCode}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Official Affiliate</span>
                    </div>
                  )}

                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-xs font-bold font-sans underline underline-offset-4 ${
                      isRunaway ? "text-white hover:text-volt" : "text-asphalt-black hover:opacity-75"
                    }`}
                  >
                    Visit Partner
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
