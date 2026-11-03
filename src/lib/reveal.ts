/**
 * Scroll reveals and counters. Elements opt in with data attributes:
 *   data-reveal            fade + 16px rise (600–900ms, cubic-bezier(0.22,1,0.36,1)); style="--reveal-delay"
 *   data-reveal="image"    the inner image scales 1.04 → 1 inside its rounded frame
 *   data-counter="1200"    counts up once (data-prefix / data-suffix)
 *
 * Hard lessons, followed exactly: pre-hide with opacity only (never clip-path), IntersectionObserver so
 * fast scrolls and anchor jumps still reveal, and a 2.5 s safety net so nothing stays hidden.
 * Under reduced motion everything is visible immediately.
 */
const SAFETY_MS = 2500;

export function initReveals(root: ParentNode = document): () => void {
  const reduced = document.documentElement.classList.contains("reduced-motion");
  const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal], [data-counter]")).filter(
    (n) => !n.dataset.revealBound,
  );
  nodes.forEach((n) => (n.dataset.revealBound = "1"));

  const showCounter = (el: HTMLElement) => {
    const target = Number(el.dataset.counter);
    const locale = document.documentElement.lang === "es" ? "es-PR" : "en-US";
    const fmt = (v: number) => `${el.dataset.prefix ?? ""}${new Intl.NumberFormat(locale).format(Math.round(v))}${el.dataset.suffix ?? ""}`;
    if (reduced || !Number.isFinite(target)) {
      el.textContent = fmt(target);
      return;
    }
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (reduced) {
    nodes.forEach((n) => {
      n.classList.add("is-revealed");
      if (n.dataset.counter) showCounter(n);
    });
    return () => {};
  }

  const pending = new Map<HTMLElement, () => void>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        pending.get(el)?.();
        pending.delete(el);
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
  );
  const timers: number[] = [];
  for (const el of nodes) {
    const run = () => {
      el.classList.add("is-revealed");
      if (el.dataset.counter) showCounter(el);
    };
    pending.set(el, run);
    io.observe(el);
    timers.push(
      window.setTimeout(() => {
        if (!pending.has(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.2 && r.bottom > -100) {
          pending.delete(el);
          io.unobserve(el);
          run();
        }
      }, SAFETY_MS),
    );
  }
  return () => {
    io.disconnect();
    timers.forEach(clearTimeout);
    // Release still-pending nodes so a re-run (React StrictMode, navigation) can bind them again.
    pending.forEach((_, el) => delete el.dataset.revealBound);
    pending.clear();
  };
}
