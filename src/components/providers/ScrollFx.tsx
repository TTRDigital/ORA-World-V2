"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-linked motion for whole sections (transform and opacity only, one rAF per frame, active only while
 * elements are near the viewport):
 *
 *  - Sections: every panel in <main> and the footer rises (140px desktop, 72px phones) and scales up from 0.9 over
 *    most of a viewport of scroll as it enters, and settles back (scale 0.95, a touch of fade) as it leaves the top, so the page reads as stacked cards. At rest the
 *    transform is removed entirely, so nothing becomes a containing block for fixed children.
 *  - Image parallax: frames whose focal point sits below 30% drift ±4% inside a 1.12 scale (6% overscan each
 *    side), so travel never exceeds the overscan. Top-anchored renders (the towers, focal y ≤ 30%) stay still so
 *    their tops never crop. Small thumbnails and carousels are skipped.
 *  - Marquee: [data-marquee] tracks slide sideways with scroll position.
 *
 * Off under reduced motion. Sections holding a pinned element (the resilience dial) skip the section transform,
 * because a transformed ancestor would break the pin. While a dialog has the page scroll-locked, every
 * transform is cleared so fixed overlays inside sections position correctly.
 */
export function ScrollFx() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const rise = mobile ? 72 : 140;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section.panel, main > div > div > section.panel, body > footer.panel, footer.panel")).filter(
      (el, i, all) => all.indexOf(el) === i && !el.parentElement?.closest("section.panel"),
    );
    const frames = Array.from(document.querySelectorAll<HTMLElement>("main .frame[data-focal]")).filter((f) => {
      const y = parseFloat((f.dataset.focal || "50% 50%").split(" ")[1] || "50");
      const inCarousel = !!f.closest(".swiper, [aria-roledescription=carousel], [role=dialog], [data-no-parallax]");
      return y > 30 && !inCarousel && f.getBoundingClientRect().width >= 260 && f.querySelector("img");
    });
    frames.forEach((f) => f.classList.add("fx-parallax"));
    const marquees = Array.from(document.querySelectorAll<HTMLElement>("[data-marquee]"));

    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement))),
      { rootMargin: "35% 0px 35% 0px" },
    );
    [...sections, ...frames, ...marquees].forEach((el) => io.observe(el));

    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const locked = html.classList.contains("lenis-stopped");
      for (const el of visible) {
        if (el.classList.contains("fx-parallax")) {
          const r = el.getBoundingClientRect();
          const p = clamp((vh - r.top) / (vh + r.height));
          el.style.setProperty("--py", `${((0.5 - p) * 8).toFixed(2)}%`);
          continue;
        }
        if (el.dataset.marquee !== undefined) {
          const speed = Number(el.dataset.marquee) || 0.3;
          const half = el.scrollWidth / 2;
          const x = half ? (window.scrollY * speed) % half : 0;
          el.style.transform = `translate3d(${(el.dataset.direction === "right" ? x - half : -x).toFixed(1)}px,0,0)`;
          continue;
        }
        // Sections
        if (locked || el.querySelector(".pin-spacer") || el.id === "resilience") {
          el.style.transform = "";
          el.style.opacity = "";
          continue;
        }
        const r = el.getBoundingClientRect();
        const enter = clamp((vh - r.top) / (vh * 0.85));
        const exit = clamp((vh * 0.45 - r.bottom) / (vh * 0.45));
        if (enter >= 1 && exit <= 0) {
          el.style.transform = "";
          el.style.opacity = "";
        } else {
          const e = 1 - Math.pow(1 - enter, 2);
          const scale = 0.9 + 0.1 * e - 0.05 * exit;
          el.style.transform = `translate3d(0,${((1 - e) * rise).toFixed(1)}px,0) scale(${scale.toFixed(4)})`;
          el.style.opacity = exit > 0 ? (1 - exit * 0.45).toFixed(3) : "";
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Sections start in their resting state for the first paint; the first update aligns them to the scroll.
    sections.forEach((s) => (s.dataset.fxSection = ""));
    update();
    requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const mo = new MutationObserver(onScroll);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      sections.forEach((s) => {
        s.style.transform = "";
        s.style.opacity = "";
        delete s.dataset.fxSection;
      });
      frames.forEach((f) => f.classList.remove("fx-parallax"));
    };
  }, [pathname]);
  return null;
}
