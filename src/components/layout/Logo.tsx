import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official 2026 lockup, never redrawn. Gold on light, white on dark (the dark header and footer). The lockup is stacked (tree over a thin wordmark), so it
 * needs real height to read: 52–64px in the header, 120–150px in the footer; clear space equal to the tree's height is kept by the surrounding padding.
 */
export function Logo({
  variant = "gold",
  height = 44,
  className,
  priority,
  responsive,
}: {
  /** "header": the gold lockup graded to read on the white bar (richer gold, firmer strokes; same artwork). */
  variant?: "gold" | "white" | "header";
  height?: number;
  className?: string;
  priority?: boolean;
  /** When true, the height comes from className (e.g. "h-[52px] lg:h-[64px]"); `height` only sizes the file. */
  responsive?: boolean;
}) {
  // Both lockups are trimmed to their edges and exported at 1200×845 (scripts/brand-build.mjs).
  const ratio = 1200 / 845;
  const width = Math.round(height * ratio);
  // Client, 17 Nov: the leaves move a little. The header and white lockups are SVGs built from the official artwork by
  // scripts/logo-leaves.py: each leaf cut from the original pixels, swinging about its branch with a breeze across the
  // tree (SVG's own animation, so it runs in every browser, Safari included). Reduced motion gets the still PNG.
  if (variant !== "gold") {
    const still = variant === "header" ? "/brand/ora-world-logo-gold-header.png" : "/brand/ora-world-logo-white.png";
    const moving = variant === "header" ? "/brand/ora-world-logo-gold-header-leaves.svg" : "/brand/ora-world-logo-white-leaves.svg";
    return (
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet={still} />
        <img
          src={moving}
          alt="ORA World · Puerto Rico"
          width={width}
          height={height}
          fetchPriority={priority ? "high" : undefined}
          data-logo-leaves
          className={cn("w-auto", !responsive && "h-auto", className)}
          style={responsive ? { width: "auto" } : { height, width: "auto" }}
        />
      </picture>
    );
  }
  return (
    <Image
      src="/brand/ora-world-logo-gold.png"
      alt="ORA World · Puerto Rico"
      width={width}
      height={height}
      priority={priority}
      className={cn("w-auto", !responsive && "h-auto", className)}
      style={responsive ? { width: "auto" } : { height, width: "auto" }}
    />
  );
}
