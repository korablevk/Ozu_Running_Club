"use client";

import { useState } from "react";
import { RunningEvent } from "@/lib/data";
import { generateGoogleCalendarUrl, generateIcsData } from "@/lib/utils";

export interface RSVPFormData {
  fullName: string;
  email: string;
  studentId: string;
  phone: string;
  paceGroup: string;
}

export function useRSVP(event: RunningEvent) {
  const [step, setStep] = useState<"form" | "confirmed">("form");
  const [rsvpStatus, setRsvpStatus] = useState<"confirmed" | "waitlist">("confirmed");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RSVPFormData>({
    fullName: "",
    email: "",
    studentId: "",
    phone: "",
    paceGroup: event.paceGroups?.[0]?.name || "Open Pace",
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/events/${event.slug}/rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error || "Failed to submit RSVP. Please try again.");
        setIsSubmitting(false);
        return false;
      }

      setRsvpStatus(result.status || "confirmed");
      setIsSubmitting(false);
      setStep("confirmed");
      return true;
    } catch {
      setErrorMessage("Network error occurred. Please check your internet connection and try again.");
      setIsSubmitting(false);
      return false;
    }
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

  const reset = () => {
    setStep("form");
    setRsvpStatus("confirmed");
    setErrorMessage(null);
    setIsSubmitting(false);
    setFormData({
      fullName: "",
      email: "",
      studentId: "",
      phone: "",
      paceGroup: event.paceGroups?.[0]?.name || "Open Pace",
    });
  };

  return {
    step,
    setStep,
    rsvpStatus,
    errorMessage,
    setErrorMessage,
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
    downloadIcs,
    googleCalUrl,
    reset,
  };
}
