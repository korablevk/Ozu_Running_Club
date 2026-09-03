"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowUpRight, MessageCircle, Navigation } from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const mainLinks = [
    { label: "Runs & Events", href: "/events", badge: "Weekly" },
    { label: "Pace Groups", href: "/#pace-groups" },
    { label: "Disciplines", href: "/#disciplines" },
    { label: "Recaps & Gallery", href: "/recaps" },
    { label: "About ÖzÜ RC", href: "/about" },
    { label: "Partners & Perks", href: "/partners", badge: "20% Off" },
    { label: "Join the Club", href: "/join", highlight: true },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200 lg:hidden overflow-y-auto">
      {/* Top Header inside Drawer */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-1.5 focus:outline-none"
        >
          <span className="font-extrabold text-2xl tracking-tighter font-display text-asphalt-black">
            ÖZÜ
          </span>
          <span className="text-volt font-black text-2xl">RC</span>
        </Link>

        <button
          onClick={onClose}
          aria-label="Close menu"
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-asphalt-black hover:bg-neutral-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Nav Links (Large Editorial Grotesque like On.com) */}
      <nav className="my-8 flex flex-col gap-4">
        {mainLinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between text-2xl sm:text-3xl font-bold font-sans tracking-tight transition-all duration-150 py-1.5",
                item.highlight
                  ? "text-asphalt-black"
                  : isActive
                  ? "text-ozu-blue"
                  : "text-neutral-900 hover:text-ozu-blue"
              )}
            >
              <span className="flex items-center gap-3">
                {item.highlight && (
                  <span className="w-2.5 h-2.5 rounded-full bg-volt inline-block" />
                )}
                {item.label}
              </span>
              {item.badge && (
                <span className="text-[10px] font-mono tracking-telemetry uppercase bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Utilities & Socials */}
      <div className="border-t border-neutral-200 pt-6 flex flex-col gap-4">
        <div className="text-xs font-mono uppercase tracking-telemetry text-neutral-500">
          Community & Channels
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
          <a
            href="https://www.strava.com/clubs/ozu-running-club"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <Navigation className="w-4 h-4 text-orange-500" />
            <span>Strava Club</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-pink-500" />
            <span>Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
          </a>
          <a
            href="https://chat.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 flex items-center gap-2 p-2.5 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Official WhatsApp Community</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
          </a>
        </div>

        <div className="text-[11px] text-neutral-500 mt-2">
          Özyeğin University Athletic Center, Çekmeköy Campus, Istanbul.
        </div>
      </div>
    </div>
  );
}
