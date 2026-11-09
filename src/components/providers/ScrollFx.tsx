"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-linked motion for whole sections (transform and opacity only, one rAF per frame, active only while
 * elements are near the viewport):
 *
 *  - Sections: every panel in <main> and the footer rises a little (48px desktop, 24px phones) as it enters. Kept
 *    deliberately calm after client feedback that the site felt busy. At rest the
 *    transform is removed entirely, so nothing becomes a containing block for fixed children.
 *  - Image parallax: frames whose focal point sits below 30% drift ±4% inside a 1.12 scale (6% overscan each
 *    side), so travel never exceeds the overscan. Top-anchored renders (the towers, focal y ≤ 30%) stay still so
 *    their tops never crop. Small thumbnails and carousels are skipped.
 *  - Fly-ins: [data-fly="left|right|up"] blocks travel in from that side (with a slight tilt and scale) and land
 *    in place as they scroll in; the motion is tied to scroll position, so it reverses when scrolling back up.
 *    data-fly-order staggers blocks within a group.
 *
 * Off under reduced motion. Sections holding a pinned or sticky element (the resilience dial, the room tour) skip the section transform,
 * because a transformed ancestor would break the pin. While a dialog has the page scroll-locked, every
 * transform is cleared so fixed overlays inside sections position correctly.
 */
export function ScrollFx() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const rise = mobile ? 24 : 48;

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
    const flyers = Array.from(document.querySelectorAll<HTMLElement>("[data-fly]"));
    // Inline transforms change every frame, so the reveal's transform transition must not ease them.
    flyers.forEach((f) => (f.style.transition = "opacity 800ms var(--ease-out)"));

    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement))),
      { rootMargin: "35% 0px 35% 0px" },
    );
    [...sections, ...frames, ...marquees, ...flyers].forEach((el) => io.observe(el));

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
        if (el.dataset.fly !== undefined) {
          if (locked) {
            el.style.transform = "";
            continue;
          }
          const r = el.getBoundingClientRect();
          const order = Number(el.dataset.flyOrder || 0);
          // Longer, gentler range: cards are still travelling while they sit in the lower two thirds of the screen.
          const p = clamp((vh * 1.0 - r.top) / (vh * 0.72) - order * 0.08);
          if (p >= 1) {
            el.style.transform = "";
            continue;
          }
          const e = 1 - Math.pow(1 - p, 2);
          const far = 1 - e;
          // Calm, professional travel (client feedback: "too busy"): a short slide, no tilt, barely any scale.
          const dist = mobile ? 36 : 72;
          const dir = el.dataset.fly;
          const dx = dir === "left" ? -dist : dir === "right" ? dist : 0;
          const dy = dir === "up" ? dist * 0.6 : 0;
          el.style.transform = `translate3d(${(dx * far).toFixed(1)}px,${(dy * far).toFixed(1)}px,0) scale(${(0.97 + 0.03 * e).toFixed(4)})`;
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
        if (locked || el.querySelector(".pin-spacer") || el.id === "resilience" || el.id === "rooms") {
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
          // A short rise as a section enters; no scale and no fade on the way out.
          const e = 1 - Math.pow(1 - enter, 2);
          el.style.transform = exit > 0 ? "" : `translate3d(0,${((1 - e) * rise).toFixed(1)}px,0)`;
          el.style.opacity = "";
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
      flyers.forEach((f) => {
        f.style.transform = "";
        f.style.transition = "";
      });
    };
  }, [pathname]);
  return null;
}
