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
  variant?: "gold" | "white";
  height?: number;
  className?: string;
  priority?: boolean;
  /** When true, the height comes from className (e.g. "h-[52px] lg:h-[64px]"); `height` only sizes the file. */
  responsive?: boolean;
}) {
  // Both lockups are trimmed to their edges and exported at 1200×845 (scripts/brand-build.mjs).
  const ratio = 1200 / 845;
  const width = Math.round(height * ratio);
  return (
    <Image
      src={variant === "gold" ? "/brand/ora-world-logo-gold.png" : "/brand/ora-world-logo-white.png"}
      alt="ORA World · Puerto Rico"
      width={width}
      height={height}
      priority={priority}
      className={cn("w-auto", !responsive && "h-auto", className)}
      style={responsive ? { width: "auto" } : { height, width: "auto" }}
    />
  );
}
