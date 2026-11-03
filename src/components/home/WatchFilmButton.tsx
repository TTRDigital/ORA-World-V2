"use client";

import { Play } from "@/components/ui/Icons";

/** Opens the film lightbox owned by HeroStage (so the basalt panel can stay a server component). */
export function WatchFilmButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("ora2:film"))}
      className="pill pill-ghost min-h-12 gap-2 px-5"
      data-track="watch_film"
    >
      <Play className="text-brass-light" width={16} height={16} />
      {label}
    </button>
  );
}
