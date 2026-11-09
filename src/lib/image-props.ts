import { getImageProps } from "next/image";
import type { ImageRef, Locale } from "@/content/types";

/**
 * Optimised URLs (WebP, quality 80, srcset) for components that render a plain <img>, such as the vendored
 * carousels. Uses next/image's getImageProps so they get the same pipeline as <Image>.
 */
export function optimisedImage(image: ImageRef, locale: Locale, sizes: string) {
  const { props } = getImageProps({ src: image.src, alt: image.alt[locale] || image.alt.en, width: image.width, height: image.height, sizes, quality: 80 });
  return { src: props.src, srcSet: props.srcSet, sizes: props.sizes, alt: props.alt, objectPosition: image.focal };
}
