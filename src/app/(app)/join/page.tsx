"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Navigation, MessageCircle, Tag } from "lucide-react";

export default function JoinPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    phone: "",
    faculty: "",
    studentRole: "undergraduate",
    experienceLevel: "beginner",
    preferredStreams: ["campus_social"],
    weeklyKmTarget: "10-25",
    motivation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleStream = (stream: string) => {
    setFormData((prev) => {
      const exists = prev.preferredStreams.includes(stream);
      return {
        ...prev,
        preferredStreams: exists
          ? prev.preferredStreams.filter((s) => s !== stream)
          : [...prev.preferredStreams, stream],
      };
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((step + 1) as 2 | 3);
    } else if (step === 3) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(4);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-canvas-subtle">
      <DesktopHeader />
      <MobileTopBar />

      <main className="flex-1 pt-24 lg:pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          {/* Top Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <Badge variant="burgundy" size="sm" className="mb-3">
              Official Membership
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight text-ink">
              Join The Club
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
              ÖzÜ Running Club is 100% free for Özyeğin University students and alumni. 
              Fill out your runner profile to unlock pacers, race shuttles, and partner perks.
            </p>

            {/* Step Indicators */}
            {step < 4 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center transition-colors ${
                        step === num
                          ? "bg-club-deepNavy text-white"
                          : step > num
                          ? "bg-emerald-500 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {step > num ? "✓" : num}
                    </div>
                    {num < 3 && <div className="w-8 h-[2px] bg-neutral-300" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-xl">
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="border-b border-neutral-100 pb-4">
                  <h2 className="text-xl font-bold font-sans tracking-tight text-asphalt-black">
                    Step 1: Student & Contact Details
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Basic information for emergency rosters and campus verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Caner Yılmaz"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      ÖzÜ Student Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name.surname@ozu.edu.tr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Student ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="S012345"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+90 5XX XXX XX XX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Faculty / Major *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science, Business"
                      value={formData.faculty}
                      onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" size="default" className="gap-2">
                    <span>Next: Running Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="border-b border-neutral-100 pb-4">
                  <h2 className="text-xl font-bold font-sans tracking-tight text-asphalt-black">
                    Step 2: Running Experience & Streams
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Help our pacers pair you with the perfect stride group.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Current Running Experience *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "beginner", title: "Couch to 5K", desc: "Just starting out or returning to cardio." },
                      { id: "intermediate", title: "Regular 5-10K", desc: "Comfortable running 5K in 25-35 mins." },
                      { id: "advanced", title: "Half / Full Marathon", desc: "Weekly long runs & race targeting." },
                    ].map((exp) => (
                      <label
                        key={exp.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          formData.experienceLevel === exp.id
                            ? "border-asphalt-black bg-neutral-50 ring-1 ring-asphalt-black"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="experience"
                          checked={formData.experienceLevel === exp.id}
                          onChange={() => setFormData({ ...formData, experienceLevel: exp.id })}
                          className="sr-only"
                        />
                        <span className="font-bold text-sm text-asphalt-black block mb-1">
                          {exp.title}
                        </span>
                        <span className="text-xs text-neutral-500 leading-snug block">
                          {exp.desc}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Which sessions are you interested in?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: "campus_social", label: "Thursday Morning Campus Loops (7:30 AM)" },
                      { id: "track_interval", label: "Tuesday Night Track Intervals (6:30 PM)" },
                      { id: "city_social", label: "Weekend Caddebostan 10K Socials" },
                      { id: "trail_nature", label: "Belgrad Forest Trail Outings" },
                    ].map((item) => {
                      const selected = formData.preferredStreams.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleStream(item.id)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                            selected
                              ? "bg-club-deepNavy text-white border-club-deepNavy"
                              : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <span>{item.label}</span>
                          {selected && <span className="w-2 h-2 rounded-full bg-club-plum" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => setStep(1)}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                  <Button type="submit" variant="primary" size="default" className="gap-2">
                    <span>Next: Goals</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div className="border-b border-neutral-100 pb-4">
                  <h2 className="text-xl font-bold font-sans tracking-tight text-asphalt-black">
                    Step 3: What Drives You?
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Tell us what you want to achieve with the pack this season.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Personal Running Goal / Motivation
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Build cardiovascular endurance, train for my first 10K race, meet other student runners on campus..."
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none"
                  />
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-xs text-neutral-600">
                  <span className="font-bold text-asphalt-black block mb-1">
                    Club Code of Conduct
                  </span>
                  ÖzÜ Running Club is built on mutual respect, encouragement, safety, and inclusivity. 
                  We leave no runner behind on any campus or city route.
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => setStep(2)}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    type="submit"
                    variant="crimson"
                    size="lg"
                    disabled={isSubmitting}
                    className="font-extrabold text-sm sm:text-base tracking-tight shadow-md"
                  >
                    {isSubmitting ? "Enrolling Member..." : "Submit Application & Join"}
                  </Button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-telemetry text-white bg-club-burgundy px-3 py-1 rounded-full font-bold">
                    Official Welcome
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-asphalt-black mt-3">
                    Welcome to the Pack, {formData.fullName.split(" ")[0]}!
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
                    Your membership application has been accepted. You are officially part of ÖzÜ Running Club!
                  </p>
                </div>

                {/* Next Actions Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto pt-2">
                  <a
                    href="https://chat.whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 hover:bg-emerald-100/70 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <MessageCircle className="w-6 h-6 text-emerald-600 mb-2" />
                      <h4 className="font-bold text-sm text-asphalt-black">
                        1. Join Member WhatsApp
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Get real-time announcements, weather updates, and daily social chatter.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 mt-3 flex items-center gap-1">
                      Join WhatsApp Chat <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  <a
                    href="https://www.strava.com/clubs/ozu-running-club"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 bg-orange-50 rounded-2xl border border-orange-200 hover:bg-orange-100/70 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <Navigation className="w-6 h-6 text-orange-600 mb-2" />
                      <h4 className="font-bold text-sm text-asphalt-black">
                        2. Connect on Strava
                      </h4>
                      <p className="text-xs text-neutral-600 mt-1">
                        Track kilometers, view the club leaderboard, and sync GPX route files.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-orange-700 mt-3 flex items-center gap-1">
                      Open Strava Club <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>

                {/* Partner Perk Code */}
                <div className="max-w-xl mx-auto p-5 bg-club-deepNavy text-white rounded-2xl border border-white/10 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-club-crimson" />
                    <div>
                      <span className="text-xs font-mono uppercase text-club-burgundy font-bold block">
                        Runaway Zone Member Perk
                      </span>
                      <span className="text-sm font-bold">20% Off Footwear & Singlets</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded bg-white/15 text-white">
                    CODE: OZU20
                  </span>
                </div>

                <div className="pt-4">
                  <Button href="/events" variant="primary" size="default">
                    Browse Upcoming Runs & RSVP
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
