import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type Tone = "brass" | "basalt" | "ghost" | "bone";
const cls = (tone: Tone, className?: string) => cn("pill", `pill-${tone}`, className);

export function PillLink({ tone = "brass", className, ...props }: ComponentProps<typeof Link> & { tone?: Tone }) {
  return <Link className={cls(tone, className)} {...props} />;
}
export function PillButton({ tone = "brass", className, type = "button", ...props }: ComponentProps<"button"> & { tone?: Tone }) {
  return <button type={type} className={cls(tone, className)} {...props} />;
}
export function PillAnchor({ tone = "brass", className, ...props }: ComponentProps<"a"> & { tone?: Tone }) {
  return <a className={cls(tone, className)} {...props} />;
}
