import React from "react";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { getPublishedEvents } from "@/lib/dal";
import { EventsCatalogClient } from "@/components/events/EventsCatalogClient";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <div className="flex flex-col min-h-screen bg-canvas-subtle">
      <DesktopHeader />
      <MobileTopBar />

      <EventsCatalogClient initialEvents={events} />

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
