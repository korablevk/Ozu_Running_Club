import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PACE_GROUPS } from "@/lib/data";
import { Check, Compass, Shield, Users, Heart, Sparkles } from "lucide-react";

export default function AboutPage() {
  const leadership = [
    {
      name: "Caner Yılmaz",
      role: "Club President & Long Run Captain",
      major: "Industrial Engineering '26",
      pr: "Half Marathon: 1:28:40",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Zeynep Kaya",
      role: "Vice President & Campus Pacer",
      major: "Business Administration '27",
      pr: "10K: 46:15",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Emir Acar",
      role: "Track & Speed Director",
      major: "Mechanical Engineering '26",
      pr: "5K: 17:35",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Derin Taner",
      role: "Community & Beginner Lead",
      major: "Psychology '27",
      pr: "Couch to 10K Finisher",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const faqs = [
    {
      q: "Is ÖzÜ Running Club really 100% free?",
      a: "Yes! As an official student community at Özyeğin University, all regular campus loops, track sessions, and training plans are completely free for all students, alumni, and faculty.",
    },
    {
      q: "I am a complete beginner who gets winded after 500 meters. Can I join?",
      a: "Absolutely. Our Couch to 5K group is specifically designed for you. We alternate jogging and walking intervals with zero pressure and zero ego. No runner is ever left behind.",
    },
    {
      q: "What equipment or gear do I need?",
      a: "All you need to start is a comfortable pair of running shoes and sportswear. Thanks to our partner Runaway Zone, all club members receive a 20% discount on shoes, technical socks, and moisture-wicking singlets.",
    },
    {
      q: "Where do we meet for campus runs?",
      a: "Our primary campus meeting point is the ÖzÜ Athletic Center Steps. For weekend city runs (Caddebostan, Belgrad Forest), we organize free shuttle pickups from the campus main gate.",
    },
    {
      q: "How do pace groups work during workouts?",
      a: "Every session features assigned student pacers running steady splits (Pace A: 4:30/km, Pace B: 5:15/km, Pace C: 6:00/km, Pace D: walk/run intervals). You pick the pack that matches how you feel that day.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-canvas-subtle">
      <DesktopHeader />
      <MobileTopBar />

      <main className="flex-1 pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Header Banner */}
          <div className="py-8 sm:py-14 border-b border-neutral-200">
            <Badge variant="volt" size="sm" className="mb-3">
              Our Manifesto
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight text-asphalt-black">
              Built on Discipline, <br />
              Connected by Stride.
            </h1>
            <p className="mt-4 text-base sm:text-xl text-neutral-600 max-w-3xl leading-relaxed">
              ÖzÜ Running Club was founded with a clear mission: to make running an accessible, invigorating, 
              and socially transformative part of campus life at Özyeğin University.
            </p>
          </div>

          {/* 3 Pillars Section */}
          <div className="py-12 sm:py-16">
            <h2 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-asphalt-black mb-8">
              The Three Pillars of ÖzÜ RC
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-volt flex items-center justify-center text-asphalt-black font-bold mb-6">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-sans text-asphalt-black mb-2">
                    1. Inclusive Cadence
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Running is for everybody. We welcome complete beginners attempting their first kilometer 
                    alongside varsity cross-country competitors. Every pace is honored.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 text-xs font-mono text-neutral-500">
                  PACE GROUPS A THROUGH D
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-ozu-blue flex items-center justify-center text-white font-bold mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-sans text-asphalt-black mb-2">
                    2. Campus & City Grit
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Özyeğin’s Çekmeköy campus offers nature trails, sharp inclines, and clean forest air. 
                    We pair campus hill workouts with weekend coastal runs across Istanbul.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 text-xs font-mono text-neutral-500">
                  ÇEKMEKÖY • CADDEBOSTAN • BELGRAD
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-asphalt-black flex items-center justify-center text-white font-bold mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-sans text-asphalt-black mb-2">
                    3. Lifelong Pack
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Beyond kilometers and split times, we are a social family. Post-run breakfasts, race trips, 
                    study sessions, and friendships that outlast university degrees.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-100 text-xs font-mono text-neutral-500">
                  COMMUNITY FIRST
                </div>
              </div>
            </div>
          </div>

          {/* Leadership & Pacers */}
          <div className="py-12 border-t border-neutral-200">
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-telemetry text-neutral-500 font-semibold block mb-1">
                Student Leadership
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-asphalt-black">
                Meet Your Pacers & Board
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((leader) => (
                <div
                  key={leader.name}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group"
                >
                  <div className="relative h-64 w-full bg-neutral-900">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold font-sans text-asphalt-black">
                      {leader.name}
                    </h3>
                    <p className="text-xs text-ozu-blue font-semibold mt-0.5">
                      {leader.role}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {leader.major}
                    </p>
                    <div className="mt-3 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-600 font-bold">
                      {leader.pr}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="py-12 border-t border-neutral-200 max-w-3xl">
            <h2 className="text-2xl sm:text-4xl font-bold font-sans tracking-tight text-asphalt-black mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm"
                >
                  <h3 className="text-base font-bold text-asphalt-black mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-asphalt-black text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold">Have another question?</h4>
                <p className="text-xs text-neutral-300 mt-1">
                  Reach out to the board on Instagram @ozurunning or join our WhatsApp.
                </p>
              </div>
              <Button href="/join" variant="volt" size="sm" className="shrink-0 font-bold">
                Join the Club
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
