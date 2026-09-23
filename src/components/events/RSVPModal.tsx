"use client";

import React from "react";
import { X, CheckCircle, Clock, Calendar, Download, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RunningEvent, CLUB_LINKS } from "@/lib/data";
import { useRSVP } from "@/lib/useRSVP";

interface RSVPModalProps {
  event: RunningEvent;
  isOpen: boolean;
  onClose: () => void;
}

export function RSVPModal({ event, isOpen, onClose }: RSVPModalProps) {
  const {
    step,
    rsvpStatus,
    errorMessage,
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    downloadIcs,
    googleCalUrl,
    reset,
  } = useRSVP(event);

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-telemetry text-neutral-500 font-semibold">
              Event Registration • RSVP
            </span>
            <h3 className="text-xl font-bold font-sans tracking-tight text-asphalt-black mt-0.5">
              {event.title}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-asphalt-black hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block">TIME & LOCATION</span>
                  <span className="font-bold text-asphalt-black">
                    {event.displayDate} @ {event.time}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-500 block">DISTANCE</span>
                  <span className="font-bold text-asphalt-black">{event.distanceKm} KM</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Caner Yılmaz"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-asphalt-black focus:ring-1 focus:ring-asphalt-black outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    ÖzÜ Email *
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

              {event.paceGroups && event.paceGroups.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Choose Your Pace Pack *
                  </label>
                  <div className="space-y-2">
                    {event.paceGroups.map((pg) => (
                      <label
                        key={pg.name}
                        className={`flex items-center justify-between p-3 rounded-xl border text-sm cursor-pointer transition-all ${
                          formData.paceGroup === pg.name
                            ? "border-club-navy bg-club-navy/5 ring-1 ring-club-navy"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="paceGroup"
                            checked={formData.paceGroup === pg.name}
                            onChange={() => setFormData({ ...formData, paceGroup: pg.name })}
                            className="w-4 h-4 text-club-navy accent-club-navy"
                          />
                          <span className="font-semibold text-ink">{pg.name}</span>
                        </div>
                        <span className="text-xs font-mono text-neutral-500">{pg.pace}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration Error / Notice Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold block mb-0.5">Registration Notice</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="crimson"
                  className="w-full h-12 text-sm font-bold tracking-tight shadow-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Securing Spot..." : "Confirm RSVP (Free)"}
                </Button>
                <p className="text-[11px] text-neutral-500 text-center mt-2.5">
                  Free community run. Certified pacers and hydration support included.
                </p>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 space-y-5">
              {rsvpStatus === "confirmed" ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold font-sans tracking-tight text-asphalt-black">
                      You are on the list, {formData.fullName.split(" ")[0]}!
                    </h4>
                    <p className="text-sm text-neutral-600 mt-2 max-w-sm mx-auto">
                      We have saved your spot for <span className="font-semibold text-asphalt-black">{event.title}</span>. 
                      Meet at <span className="font-semibold text-asphalt-black">{event.meetingPoint}</span> at {event.time}.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-2xl font-bold font-sans tracking-tight text-asphalt-black">
                      Added to Waitlist!
                    </h4>
                    <p className="text-sm text-neutral-600 mt-2 max-w-sm mx-auto">
                      This session is currently at full capacity. You are registered on the priority waitlist and will be notified if a spot opens up.
                    </p>
                  </div>
                </>
              )}

              {/* Calendar Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={downloadIcs}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-50 transition-colors"
                >
                  <Download className="w-4 h-4 text-neutral-700" />
                  <span>Apple / .ICS File</span>
                </button>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/80 text-left text-xs text-neutral-600">
                <span className="font-bold text-asphalt-black block mb-1">
                  Next Step: Join the Run WhatsApp Chat
                </span>
                Get real-time weather updates and pacer announcements prior to the run.
                <a
                  href={CLUB_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-600 font-bold mt-2 hover:underline"
                >
                  <span>Open WhatsApp Group</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="w-full text-xs font-bold"
              >
                Close & Return to Site
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
