import React from "react";
import Image from "next/image";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { getPublishedPartners } from "@/lib/dal";
import { ArrowUpRight, Tag, ShieldCheck, ShoppingBag, Calendar, Trophy, Mail } from "lucide-react";

export default async function PartnersPage() {
  const partners = await getPublishedPartners();
  const featuredPartner = partners.find((p) => p.name.toLowerCase().includes("runaway")) || partners[0];
  const secondaryPartners = featuredPartner 
    ? partners.filter((p) => p.id !== featuredPartner.id)
    : partners;

  return (
    <div className="flex flex-col min-h-screen bg-canvas-subtle">
      <DesktopHeader />
      <MobileTopBar />

      <main className="flex-1 pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="py-8 sm:py-14 border-b border-neutral-200">
            <Badge variant="burgundy" size="sm" className="mb-3">
              Partnership & Perks
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Our Partners & Sponsors
            </h1>
            <p className="mt-4 text-base sm:text-xl text-neutral-600 max-w-3xl leading-relaxed">
              We collaborate with premier athletic brands and campus departments to equip our student runners with high-performance footwear, coaching, and race experiences.
            </p>
          </div>

          {/* Featured Sponsor Spotlight */}
          {featuredPartner && (
            <div className="py-12 sm:py-16">
              <div className="bg-club-deepNavy text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Subtle Plum accent glow */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-club-plum/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono uppercase tracking-telemetry text-white bg-club-burgundy px-3 py-1 rounded font-bold">
                        {featuredPartner.tier || "Official Title Partner"}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        {featuredPartner.websiteUrl ? new URL(featuredPartner.websiteUrl).hostname : ""}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase">
                      {featuredPartner.name}
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                      {featuredPartner.perkDescription}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <Tag className="w-5 h-5 text-club-crimson mb-2" />
                        <span className="text-xs font-bold block text-white">
                          {featuredPartner.discountCode ? `Code: ${featuredPartner.discountCode}` : "Exclusive Perks"}
                        </span>
                        <span className="text-[11px] text-neutral-400">Member Discount</span>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <ShoppingBag className="w-5 h-5 text-white mb-2" />
                        <span className="text-xs font-bold block text-white">Custom Club Kit</span>
                        <span className="text-[11px] text-neutral-400">Official ÖzÜ Gear</span>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <Calendar className="w-5 h-5 text-white mb-2" />
                        <span className="text-xs font-bold block text-white">Joint Events Hub</span>
                        <span className="text-[11px] text-neutral-400">Shared Istanbul races</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      {featuredPartner.websiteUrl && (
                        <a
                          href={featuredPartner.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-club-crimson text-white font-extrabold text-sm hover:bg-club-crimson/90 transition-colors shadow-md"
                        >
                          <span>Explore {featuredPartner.name}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl bg-neutral-900">
                      <Image
                        src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80"
                        alt={`${featuredPartner.name} Running Gear`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-neutral-300">
                        ÖzÜ athletes testing new footwear at Çekmeköy campus loop.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Partners Grid */}
          {secondaryPartners.length > 0 && (
            <div className="py-12 border-t border-neutral-200">
              <h2 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-asphalt-black mb-8">
                University & Regional Network
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryPartners.map((partner) => {
                  const isOzu = partner.name.toLowerCase().includes("özyeğin") || partner.tier.toLowerCase().includes("directorate");
                  return (
                    <div key={partner.id} className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono uppercase tracking-telemetry text-club-navy font-bold">
                            {partner.tier}
                          </span>
                          {isOzu ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Trophy className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-asphalt-black mb-2">
                          {partner.name}
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {partner.perkDescription}
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-500 uppercase">{partner.tier}</span>
                        {partner.websiteUrl && (
                          <a
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-asphalt-black hover:underline flex items-center gap-1"
                          >
                            <span>Visit Site</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Become a Partner CTA */}
          <div className="py-12 border-t border-neutral-200">
            <div className="bg-neutral-100 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border border-neutral-200">
              <div>
                <h3 className="text-2xl font-bold text-asphalt-black">
                  Interested in Sponsoring ÖzÜ Running Club?
                </h3>
                <p className="text-sm text-neutral-600 mt-2 max-w-xl">
                  Connect with hundreds of engaged university athletes and Istanbul runners through footwear demos, race sponsorship, or hydration support.
                </p>
              </div>
              <a
                href="mailto:running@ozu.edu.tr"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-club-deepNavy text-white text-sm font-bold hover:bg-club-navy transition-colors shrink-0 shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Athletics Board</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
