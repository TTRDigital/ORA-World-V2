import imageUrlBuilder from "@sanity/image-url";
import type { ImageRef, L } from "@/content/types";
import { dataset, projectId } from "./env";

type SanityFigure = {
  asset?: { _ref?: string; url?: string; metadata?: { dimensions?: { width: number; height: number } } };
  hotspot?: { x: number; y: number };
  alt?: L;
  caption?: L;
  rendering?: boolean;
  placeholder?: boolean;
  credit?: string;
};

/** Sanity figure → ImageRef. The hotspot becomes the CSS focal point; no LQIP is ever read. */
export function figureToImageRef(f: SanityFigure | null | undefined): ImageRef | null {
  if (!f?.asset) return null;
  const builder = imageUrlBuilder({ projectId, dataset });
  const dims = f.asset.metadata?.dimensions;
  const width = Math.min(dims?.width ?? 2560, 2560);
  const height = dims ? Math.round(dims.height * (width / dims.width)) : Math.round(width * 0.5625);
  const url = builder.image(f.asset as never).width(width).fit("max").auto("format").quality(80).url();
  const focal = f.hotspot ? `${Math.round(f.hotspot.x * 100)}% ${Math.round(f.hotspot.y * 100)}%` : "50% 50%";
  return {
    src: url,
    width,
    height,
    focal,
    alt: f.alt ?? { en: "", es: "" },
    caption: f.caption,
    rendering: f.rendering,
    placeholder: f.placeholder,
    credit: f.credit,
  };
}
