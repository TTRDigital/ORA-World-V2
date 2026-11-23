/**
 * Version E: a pen sketch of the three curved Tesoro del Mar towers (in the manner of the architect's sketch on
 * ciprianiresidencesmiami.com): stacked oval floor plates with a slight hand wobble, drawn in brass ink.
 */
const towers = [
  { x: 70, w: 58, top: 40, floors: 15 },
  { x: 150, w: 62, top: 18, floors: 17 },
  { x: 232, w: 56, top: 56, floors: 14 },
];

function wobble(n: number) {
  return Math.sin(n * 12.9898) * 0.5 * 2.4;
}

export function ETowerSketch({ className }: { className?: string }) {
  const base = 330;
  const paths: string[] = [];
  towers.forEach((t, ti) => {
    const step = (base - t.top) / t.floors;
    for (let f = 0; f <= t.floors; f++) {
      const y = base - f * step;
      // Floor plates bulge a little toward the middle of the tower, like the curved façades.
      const bulge = 1 + 0.12 * Math.sin((f / t.floors) * Math.PI);
      const rx = (t.w / 2) * bulge;
      const cx = t.x + wobble(ti * 31 + f) ;
      const ry = 5.5 + wobble(f + ti) * 0.4;
      paths.push(`M${(cx - rx).toFixed(1)} ${y.toFixed(1)} a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 0 ${(2 * rx).toFixed(1)} 0`);
      if (f % 3 === 0) paths.push(`M${(cx - rx).toFixed(1)} ${y.toFixed(1)} a${rx.toFixed(1)} ${ry.toFixed(1)} 0 1 1 ${(2 * rx).toFixed(1)} 0`);
    }
    // The two edges, drawn twice slightly apart like a pen line.
    for (const side of [-1, 1]) {
      const pts: string[] = [];
      for (let f = 0; f <= t.floors; f++) {
        const y = base - f * step;
        const bulge = 1 + 0.12 * Math.sin((f / t.floors) * Math.PI);
        pts.push(`${(t.x + side * (t.w / 2) * bulge + wobble(ti * 7 + f)).toFixed(1)} ${y.toFixed(1)}`);
      }
      paths.push(`M${pts.join(" L")}`);
    }
  });
  // Ground line, scribbled.
  paths.push("M20 334 C 80 331, 160 337, 300 332", "M30 338 C 110 336, 200 340, 290 336");
  return (
    <svg viewBox="0 0 320 350" className={className} role="img" aria-label="A pen sketch of the three curved Tesoro del Mar towers">
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
        {paths.map((d, k) => (
          <path key={k} d={d} />
        ))}
      </g>
    </svg>
  );
}
