"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { togglePick, writePicks } from "@/lib/finish-selection";
import { usePicks } from "./usePicks";

/**
 * The visitor's finish selection (client, 18 Nov: "make it easier to show and pull for the user"): a small bar at the
 * bottom of the Finishes page once anything is picked, opening to the list; "Send with my inquiry" carries it into the
 * inquiry form's message.
 */
export function SelectionTray({ labels }: { labels: { mine: string; send: string; clear: string; remove: string; show: string; hide: string } }) {
  const picks = usePicks();
  const [open, setOpen] = useState(false);
  if (!picks.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
      <div className="pointer-events-auto mx-auto max-w-[760px] rounded-[20px] bg-basalt text-bone shadow-[0_20px_60px_-20px_rgb(28_24_18/0.7)] ring-1 ring-bone/10">
        {open && (
          <ul className="max-h-[40dvh] overflow-y-auto border-b border-bone/10 px-4 py-3">
            {picks.map((p) => (
              <li key={`${p.group}-${p.name}`} className="flex items-center justify-between gap-3 py-1.5 text-[14px]">
                <span>
                  <span className="text-bone/60">{p.group} · </span>
                  {p.name}
                </span>
                <button type="button" onClick={() => togglePick(p)} className="min-h-9 rounded-full px-3 text-[11px] tracking-[0.14em] text-bone/70 uppercase ring-1 ring-bone/20 hover:text-bone" aria-label={`${labels.remove}: ${p.name}`}>
                  {labels.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mr-auto inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold">
            <span className="grid size-7 place-items-center rounded-full bg-brass text-[12px] text-basalt tabular-nums">{picks.length}</span>
            {labels.mine}
            <span className="text-[11px] font-normal tracking-[0.14em] text-bone/60 uppercase">{open ? labels.hide : labels.show}</span>
          </button>
          <button type="button" onClick={() => writePicks([])} className="min-h-11 rounded-full px-4 text-[11px] tracking-[0.14em] text-bone/70 uppercase hover:text-bone">
            {labels.clear}
          </button>
          <Link href="/#inquire" className="cta min-h-11 px-5 text-[11px]" data-track="cta_inquire" data-track-label="finishes-selection">
            {labels.send}
          </Link>
        </div>
      </div>
    </div>
  );
}
