"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const LeadForm = dynamic(() => import("./LeadForm").then((m) => m.LeadForm), {
  ssr: false,
  loading: () => <div className="h-72 animate-pulse rounded-[20px] bg-travertine/60" aria-hidden />,
});

/** Lazy-loads react-hook-form + zod only when a form is actually on screen. */
export function LeadFormLazy(props: ComponentProps<typeof LeadForm>) {
  return <LeadForm {...props} />;
}
