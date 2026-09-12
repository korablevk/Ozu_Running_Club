import React from "react";
import type { Partner } from "@/lib/data";
import { ArrowUpRight, Tag, ShieldCheck } from "lucide-react";

export function PartnersSection({ partners = [] }: { partners?: Partner[] }) {
  if (partners.length === 0) return null;

  const featuredPartner = partners.find((p) => p.name.includes("Runaway")) || partners[0];
  const secondaryPartners = partners.filter((p) => p.id !== featuredPartner.id);

  return (
    <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 bg-canvas-subtle border-t border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2 font-sans">
            05 • Ecosystem & Support
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-sans tracking-tight text-asphalt-black">
            Partners & Sponsors
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
            Backed by leading athletic brands and university organizations to keep our runners equipped, fueled, and racing.
          </p>
        </div>

        {/* Primary / Featured Partner: Runaway Zone */}
        <div className="relative rounded-xl overflow-hidden bg-club-deepNavy text-white border border-white/10 p-8 sm:p-12 shadow-xl mb-6 sm:mb-8 group">
          {/* Subtle brand atmosphere glow */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-club-plum/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-white bg-club-burgundy px-3 py-1 rounded-full">
                  Official Running Partner
                </span>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  runawayzone.com
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
                {featuredPartner.logoText}
              </h3>

              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                {featuredPartner.perkDescription}
              </p>

              {featuredPartner.discountCode && (
                <div className="inline-flex items-center gap-2 text-xs font-mono bg-white/10 border border-white/15 px-3 py-1.5 rounded-full self-start mt-1">
                  <Tag className="w-3.5 h-3.5 text-club-crimson" />
                  <span className="text-neutral-300">Member Discount:</span>
                  <span className="font-bold text-white tracking-wider">CODE {featuredPartner.discountCode}</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center pt-2 lg:pt-0">
              <a
                href={featuredPartner.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-pill bg-white text-ink font-bold text-sm hover:bg-neutral-100 transition-all shadow-md group-hover:shadow-lg"
              >
                <span>Visit Partner Store</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Secondary / Supporting & Institutional Partners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryPartners.map((partner) => {
            const isOzu = partner.name.includes("Özyeğin");
            return (
              <div
                key={partner.id}
                className="relative rounded-xl p-6 sm:p-8 bg-white border border-neutral-200/80 hover:border-club-navy/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-sans">
                      {isOzu ? "Institutional Directorate" : "Community Alliance"}
                    </span>
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${partner.name}`}
                      className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  <h4 className="text-2xl font-black font-display tracking-tight text-asphalt-black uppercase">
                    {partner.logoText}
                  </h4>

                  <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 leading-relaxed">
                    {partner.perkDescription}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-sans">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Affiliate</span>
                  </div>
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-ink hover:text-club-navy transition-colors underline underline-offset-4"
                  >
                    Learn More
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

