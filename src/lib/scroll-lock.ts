let locks = 0;
let prevOverflow = "";
let prevPadding = "";

/** Lock body scroll while a sheet or modal is open (ref-counted). */
export function lockScroll() {
  if (typeof document === "undefined") return;
  if (locks++ === 0) {
    const sb = window.innerWidth - document.documentElement.clientWidth;
    prevOverflow = document.body.style.overflow;
    prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (sb > 0) document.body.style.paddingRight = `${sb + 12}px`;
    document.documentElement.classList.add("lenis-stopped");
  }
}
export function unlockScroll() {
  if (typeof document === "undefined") return;
  if (--locks <= 0) {
    locks = 0;
    document.body.style.overflow = prevOverflow;
    document.body.style.paddingRight = prevPadding;
    document.documentElement.classList.remove("lenis-stopped");
  }
}
