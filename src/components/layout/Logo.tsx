import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official 2026 lockup, never redrawn. Gold on light, white on dark. Minimum 44px tall in the header,
 * 96px in the footer; clear space equal to the tree's height is kept by the surrounding padding.
 */
export function Logo({ variant = "gold", height = 44, className, priority }: { variant?: "gold" | "white"; height?: number; className?: string; priority?: boolean }) {
  // Gold lockup is 1200×845 after trimming; the white SVG is 2048×1152.
  const ratio = variant === "gold" ? 1200 / 845 : 2048 / 1152;
  const width = Math.round(height * ratio);
  return (
    <Image
      src={variant === "gold" ? "/brand/ora-world-logo-gold.png" : "/brand/ora-world-logo-white.svg"}
      alt="ORA World · Puerto Rico"
      width={width}
      height={height}
      priority={priority}
      unoptimized={variant === "white"}
      className={cn("h-auto w-auto", className)}
      style={{ height, width: "auto" }}
    />
  );
}
