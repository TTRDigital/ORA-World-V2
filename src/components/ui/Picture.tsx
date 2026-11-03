import Image from "next/image";
import type { ImageRef, Locale } from "@/content/types";
import { cn } from "@/lib/utils";

type Props = {
  image: ImageRef;
  locale: Locale;
  /** Must match the real rendered width; the image audit test checks natural width ≥ 1.5× displayed width. */
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Aspect ratio for the frame, e.g. "16/10". The image covers it from its focal point. */
  ratio?: string;
  fill?: boolean;
  reveal?: boolean;
  rounded?: "sm" | "lg" | "none";
};

/**
 * next/image over a travertine ground. No blur placeholder, ever. object-position comes from the image's
 * focal point so tower tops stay in frame at every crop. WebP only at quality 80 (next.config.ts).
 */
export function Picture({ image, locale, sizes, priority, className, imgClassName, ratio = "16/10", fill = true, reveal = true, rounded = "sm" }: Props) {
  const alt = image.alt[locale] || image.alt.en;
  return (
    <div
      className={cn("frame", rounded === "lg" && "frame-lg", rounded === "none" && "rounded-none", className)}
      style={fill ? { aspectRatio: ratio } : undefined}
      data-reveal={reveal ? "image" : undefined}
      data-focal={image.focal}
    >
      {fill ? (
        <Image src={image.src} alt={alt} fill sizes={sizes} quality={80} priority={priority} loading={priority ? "eager" : undefined} className={cn("object-cover", imgClassName)} style={{ objectPosition: image.focal }} />
      ) : (
        <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes={sizes} quality={80} priority={priority} className={imgClassName} style={{ objectPosition: image.focal }} />
      )}
    </div>
  );
}
