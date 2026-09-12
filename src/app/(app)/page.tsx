import React from "react";
import { DesktopHeader } from "@/components/layout/DesktopHeader";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { Footer } from "@/components/layout/Footer";
import { Ticker } from "@/components/ui/Ticker";
import { HeroSection } from "@/components/home/HeroSection";
import { PaceStreamsGrid } from "@/components/home/PaceStreamsGrid";
import { DisciplineSplit } from "@/components/home/DisciplineSplit";
import { UpcomingRunsCarousel } from "@/components/home/UpcomingRunsCarousel";
import { RunnerStories } from "@/components/home/RunnerStories";
import { RecapsGrid } from "@/components/home/RecapsGrid";
import { PartnersSection } from "@/components/home/PartnersSection";
import { JoinCtaBanner } from "@/components/home/JoinCtaBanner";
import { getPublishedEvents, getPublishedPartners } from "@/lib/dal";

export default async function HomePage() {
  const [events, partners] = await Promise.all([
    getPublishedEvents(),
    getPublishedPartners(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bars */}
      <DesktopHeader />
      <MobileTopBar />

      {/* Main Page Flow */}
      <main className="flex-1">
        <HeroSection />
        <Ticker />
        <PaceStreamsGrid />
        <DisciplineSplit />
        <UpcomingRunsCarousel events={events} />
        <RunnerStories />
        <RecapsGrid />
        <PartnersSection partners={partners} />
        <JoinCtaBanner />
      </main>

      {/* Global Footer & Mobile Navigation */}
      <Footer />
      <MobileBottomBar />
    </div>
  );
}
