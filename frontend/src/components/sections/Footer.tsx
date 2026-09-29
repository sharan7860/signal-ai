import { Activity } from "lucide-react";
import { MagneticButton } from "../MagneticButton";

export function Footer() {
  return (
    <footer className="border-t border-glass-border py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass-card mb-10 rounded-3xl p-5 text-center sm:mb-12 sm:p-10">
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">
            Start with a ticker. <span className="text-gradient">Explore the evidence.</span>
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Review price history and technical signals, then ask the assistant to explain unfamiliar
            concepts.
          </p>
          <div className="mt-6 flex justify-center">
            <MagneticButton
              onClick={() =>
                document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Analyze a stock
            </MagneticButton>
          </div>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-8">
          <div className="flex items-center gap-2 font-display text-lg">
            <Activity className="h-5 w-5 text-electric" /> Signal AI
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
            <a href="#dashboard">Analysis</a>
            <a href="#analytics">Indicators</a>
            <a href="#insights">Insights</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#about">About</a>
          </nav>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          © 2026 Signal AI. Educational research tools. Quotes may be delayed; projections are
          illustrative. Holdings are stored locally in this browser. Chat messages are sent to the
          configured AI provider to generate responses.
        </p>
      </div>
    </footer>
  );
}
