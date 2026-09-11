"use client";

import React, { useState } from "react";
import { RunningEvent } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Calendar, Download, ArrowRight, ShieldCheck } from "lucide-react";
import { generateGoogleCalendarUrl, generateIcsData } from "@/lib/utils";

export function EventDetailsRSVP({ event }: { event: RunningEvent }) {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    phone: "",
    paceGroup: event.paceGroups[0]?.name || "Group B",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("confirmed");
    }, 600);
  };

  const downloadIcs = () => {
    const icsContent = generateIcsData({
      title: event.title,
      description: `${event.subtitle}\nMeeting at: ${event.meetingPoint}\nTarget Pace: ${event.targetPace}`,
      location: event.meetingPoint,
      startDate: event.date,
      durationMinutes: event.estimatedDurationMin,
    });
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const googleCalUrl = generateGoogleCalendarUrl({
    title: event.title,
    description: `${event.subtitle}\nMeeting at: ${event.meetingPoint}\nTarget Pace: ${event.targetPace}`,
    location: event.meetingPoint,
    startDate: event.date,
    durationMinutes: event.estimatedDurationMin,
  });

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xl">
      <div className="border-b border-neutral-100 pb-5 mb-6">
        <span className="text-xs font-mono uppercase tracking-telemetry text-neutral-500 font-bold block mb-1">
          Instant RSVP • 100% Free
        </span>
        <h3 className="text-2xl font-extrabold font-sans tracking-tight text-asphalt-black">
          Secure Your Spot
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Open to all Özyeğin University students, alumni, and faculty.
        </p>
      </div>

      {step === "form" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Zeynep Kaya"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              ÖzÜ Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@ozyegin.edu.tr"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Student ID
              </label>
              <input
                type="text"
                placeholder="S012345"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Select Pace Pack *
            </label>
            <div className="space-y-2">
              {event.paceGroups.map((pg) => (
                <label
                  key={pg.name}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                    formData.paceGroup === pg.name
                      ? "border-asphalt-black bg-neutral-50 ring-1 ring-asphalt-black"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paceGroupInline"
                      checked={formData.paceGroup === pg.name}
                      onChange={() => setFormData({ ...formData, paceGroup: pg.name })}
                      className="w-4 h-4 text-asphalt-black"
                    />
                    <span className="font-semibold text-asphalt-black">{pg.name}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{pg.pace}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="crimson"
              className="w-full h-12 text-sm font-bold tracking-tight shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Securing Spot..." : "Confirm RSVP (Free)"}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-500 justify-center pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Campus security safety check-in included</span>
          </div>
        </form>
      ) : (
        <div className="text-center py-4 space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-xl font-bold font-sans tracking-tight text-asphalt-black">
              RSVP Confirmed!
            </h4>
            <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto">
              Your name is added to the pack. See you at {event.meetingPoint} on {event.displayDate}.
            </p>
          </div>

          {/* Calendar Sync Buttons */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={downloadIcs}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              <Download className="w-4 h-4 text-neutral-700" />
              <span>Download .ICS File (Apple)</span>
            </button>
          </div>

          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left text-xs text-neutral-600">
            <span className="font-bold text-asphalt-black block mb-1">
              Join the Run WhatsApp Thread
            </span>
            Real-time weather, locker locations, and pacer updates:
            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 font-bold mt-2 hover:underline"
            >
              <span>Open WhatsApp Group</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
