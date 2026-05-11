import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { CursorGlow } from "@/components/CursorGlow";
import { Hero } from "@/components/sections/Hero";
import { MarketOverview } from "@/components/sections/MarketOverview";
import { PredictionDashboard } from "@/components/sections/PredictionDashboard";
import { Analytics } from "@/components/sections/Analytics";
import { Insights } from "@/components/sections/Insights";
import { Portfolio } from "@/components/sections/Portfolio";
import { Features } from "@/components/sections/Features";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRADER AI — Predict Smarter. Trade Better." },
      {
        name: "description",
        content:
          "AI-powered stock analytics, forecasting and intelligent recommendations. Built for the next generation of investors.",
      },
      { property: "og:title", content: "TRADER AI — Predict Smarter. Trade Better." },
      {
        property: "og:description",
        content:
          "AI-powered stock analytics, forecasting and intelligent recommendations.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticlesBackground />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <MarketOverview />
        <PredictionDashboard />
        <Analytics />
        <Insights />
        <Portfolio />
        <Features />
        <About />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
