"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * The phone menu used on every version (client, 24 Nov: "on mobile I like Version 2's navigation best; have it on all
 * three"): under the header (which keeps the logo, Inquire and the close button), a bone panel with the pages in large
 * serif type and the language switch under them. Escape closes it; the page behind does not scroll while it is open. It sits above the cookie banner (z 70) so the last links stay reachable.
 */
export function MobileMenu({
  open,
  onClose,
  links,
  top,
  footer,
  id = "mobile-menu",
  label,
}: {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  top: string;
  footer?: React.ReactNode;
  id?: string;
  label: string;
}) {
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-lenis-prevent
      className={cn(
        "fixed inset-x-0 bottom-0 z-[75] overflow-y-auto overscroll-contain bg-bone px-5 pt-6 pb-10 xl:hidden",
        top,
      )}
    >
      <ul className="grid gap-1">
        {links.map((l, k) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onClose}
              autoFocus={k === 0}
              className="block py-3 font-[family-name:var(--font-display)] text-[34px] leading-tight text-charcoal"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      {footer && (
        <div className="mt-8 flex gap-6 text-[11px] tracking-[0.22em] text-charcoal uppercase">{footer}</div>
      )}
    </div>
  );
}

/** Two thin lines that turn into a cross (Version 2's menu button). */
export function MenuToggle({
  open,
  onClick,
  label,
  className,
}: {
  open: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={label}
      className={cn("grid size-11 shrink-0 place-items-center xl:hidden", className)}
    >
      <span aria-hidden className="grid gap-1.5">
        <span
          className={cn(
            "block h-px w-6 bg-current transition-transform",
            open && "translate-y-[3.5px] rotate-45",
          )}
        />
        <span
          className={cn(
            "block h-px w-6 bg-current transition-transform",
            open && "-translate-y-[3.5px] -rotate-45",
          )}
        />
      </span>
    </button>
  );
}
