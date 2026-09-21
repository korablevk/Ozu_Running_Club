import React from "react";
import Link from "next/link";
import { ArrowUpRight, Navigation, ShieldCheck, Heart } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { ClubLogo } from "@/components/ui/ClubLogo";

export function Footer() {
  return (
    <footer className="bg-club-deepNavy text-white pt-16 pb-24 lg:pb-16 border-t border-club-navy/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top 12-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-club-navy/60">
          {/* Brand Col (lg:span 4) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <ClubLogo size="default" variant="light" />
              <p className="mt-4 text-sm text-neutral-300 leading-relaxed max-w-sm">
                The official student running community of Özyeğin University, Istanbul. 
                Bridging morning campus loops, weekly interval sessions, and city endurance races. 
                Inclusive to all levels — from complete beginners to marathon competitors.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-telemetry text-club-burgundy font-bold">
                Çekmeköy Campus
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-xs font-mono uppercase tracking-telemetry text-neutral-300">
                Istanbul, TR
              </span>
            </div>
          </div>

          {/* Quick Links (lg:span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-mono uppercase tracking-telemetry text-neutral-400 mb-4">
              Training & Events
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/events" className="text-neutral-300 hover:text-white transition-colors">
                  Upcoming Runs
                </Link>
              </li>
              <li>
                <Link href="/#pace-groups" className="text-neutral-300 hover:text-white transition-colors">
                  Pace Groups (A/B/C/D)
                </Link>
              </li>
              <li>
                <Link href="/#disciplines" className="text-neutral-300 hover:text-white transition-colors">
                  Campus Loops
                </Link>
              </li>
              <li>
                <Link href="/#disciplines" className="text-neutral-300 hover:text-white transition-colors">
                  Track Interval Sessions
                </Link>
              </li>
              <li>
                <Link href="/#disciplines" className="text-neutral-300 hover:text-white transition-colors">
                  City Coastline 10Ks
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Club (lg:span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-telemetry text-neutral-400 mb-4">
              Club & Community
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/join" className="text-club-crimson hover:underline flex items-center gap-1 font-semibold">
                  <span>Join the Club (Application)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/recaps" className="text-neutral-300 hover:text-white transition-colors">
                  Photo Recaps & Results
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">
                  About ÖzÜ RC & Pacers
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-neutral-300 hover:text-white transition-colors">
                  Runaway Zone Partnership
                </Link>
              </li>
              <li>
                <a
                  href="https://www.ozyegin.edu.tr/en/campus-life/sports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>ÖzÜ Sports Directorate</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Connect & Social (lg:span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-telemetry text-neutral-400 mb-4">
              Connect With The Pack
            </h4>
            <div className="space-y-3">
              <a
                href="https://www.strava.com/clubs/2269492"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-club-navy/40 rounded-lg hover:bg-club-navy/70 transition-colors border border-club-navy/60"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Navigation className="w-4 h-4 text-orange-500" />
                  <span>Strava Club</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-club-navy/40 rounded-lg hover:bg-club-navy/70 transition-colors border border-club-navy/60"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <InstagramIcon className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              </a>

              <div className="p-3 bg-club-navy/30 rounded-lg border border-club-navy/40 text-xs text-neutral-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Campus Athletic Safety: Certified pacers with first-aid training present on all official club outings.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <span>© 2026 ÖzÜ Running Club</span>
            <span>•</span>
            <span>Özyeğin University Student Community</span>
          </div>

          <div className="flex items-center gap-1 text-neutral-300">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-club-crimson fill-club-crimson" />
            <span>for Istanbul runners</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
