import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official 2026 lockup, never redrawn. Gold on light, white on dark. The lockup is stacked (tree over a thin wordmark), so it
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
      className={cn("w-auto", !responsive && "h-auto", className)}
      style={responsive ? { width: "auto" } : { height, width: "auto" }}
    />
  );
}
