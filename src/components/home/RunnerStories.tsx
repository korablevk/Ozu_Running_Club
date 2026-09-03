import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function RunnerStories() {
  return (
    <section className="py-16 sm:py-24 bg-canvas-subtle border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Authentic Portrait */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[440px] sm:h-[500px] border border-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80"
                alt="ÖzÜ Student Runner"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <span className="text-xs font-mono uppercase tracking-telemetry text-volt block">
                    Athlete Spotlight
                  </span>
                  <span className="text-lg font-bold font-sans">
                    Derin K. • Class of &apos;27
                  </span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono">
                  0 to 21.1 KM in 8 Months
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Quote & Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <Badge variant="navy" size="sm" className="self-start mb-6">
              Voices of ÖzÜ
            </Badge>

            <Quote className="w-10 h-10 text-neutral-300 mb-4" />

            <blockquote className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-asphalt-black leading-snug">
              &ldquo;I thought running at university would just be cardio on a treadmill. 
              ÖzÜ Running Club transformed it into a ritual of sunrise miles, mental clarity before exams, 
              and a crew that cheers for you whether you run a 4-minute pace or a 7-minute pace.&rdquo;
            </blockquote>

            <div className="mt-8 pt-6 border-t border-neutral-200 grid grid-cols-3 gap-4 text-center font-mono">
              <div>
                <span className="text-[10px] uppercase text-neutral-500 block">FIRST RUN</span>
                <span className="text-sm sm:text-base font-bold text-asphalt-black">2.4 KM</span>
              </div>
              <div className="border-x border-neutral-200">
                <span className="text-[10px] uppercase text-neutral-500 block">CURRENT PR</span>
                <span className="text-sm sm:text-base font-bold text-ozu-blue">1:48:12 (Half)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 block">DISCIPLINE</span>
                <span className="text-sm sm:text-base font-bold text-asphalt-black">Tempo Group B</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
