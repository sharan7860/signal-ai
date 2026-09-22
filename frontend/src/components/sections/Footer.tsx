import { Activity } from "lucide-react";
import { MagneticButton } from "../MagneticButton";

export function Footer() {
  return (
    <footer className="border-t border-glass-border py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="glass-card mb-12 rounded-3xl p-10 text-center">
          <h3 className="font-display text-3xl font-semibold">
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
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center gap-2 font-display text-lg">
            <Activity className="h-5 w-5 text-electric" /> TRADER AI
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a href="#dashboard">Analysis</a>
            <a href="#analytics">Indicators</a>
            <a href="#insights">Insights</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#about">About</a>
          </nav>
        </div>
        <p className="mt-10 text-xs text-muted-foreground">
          © 2026 TRADER AI. Educational research tools. Quotes may be delayed; projections are
          illustrative. Holdings are stored locally in this browser. Chat messages are sent to the
          configured AI provider to generate responses.
        </p>
      </div>
    </footer>
  );
}
