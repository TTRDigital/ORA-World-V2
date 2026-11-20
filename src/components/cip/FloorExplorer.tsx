"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { towerResidences as U, explorerDims, type TowerResidence } from "@/content/seed/explorer";

/**
 * "Find your residence" (client, 16 Nov: copy the floor-plan explorer of the ORA World · Tesoro del Mar presentation):
 * bedroom filters; Tower 1 as a stack of levels; the residences on the chosen level; and the plan with its figures,
 * features, its place on the floor and an Inquire button. Click the plan to enlarge it. Phones: the levels and the
 * residences become horizontal strips above the plan.
 */
type Filter = "all" | "1" | "2" | "3" | "4" | "6" | "ph";

const typeOf = (u: TowerResidence): Filter => (u.id === "PH" ? "ph" : u.den ? "1" : (String(u.bed) as Filter));
const fmt = (n: number) => n.toLocaleString("en-US");
const fm2 = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const planSrc = (u: TowerResidence, level: number) => (u.id === "PH" ? `/explorer/plans/ph-${level}.png` : `/explorer/plans/${u.plan}.png`);
const keySrc = (u: TowerResidence) => (u.id === "PH" ? "/explorer/keys/ph.png" : `/explorer/keys/${u.plan}.png`);
const dims = (src: string) => explorerDims[src] ?? [4, 3];
const mask = (src: string): React.CSSProperties => ({ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" });

const Wave = () => (
  <svg viewBox="0 0 64 10" aria-hidden className="h-2.5 w-16">
    <path d="M0 5 Q4 0 8 5 T16 5 T24 5 T32 5 T40 5 T48 5 T56 5 T64 5" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);

function Plan({ src, label }: { src: string; label: string }) {
  const [w, h] = dims(src);
  return <span role="img" aria-label={label} className="m-auto block bg-charcoal" style={{ ...mask(src), aspectRatio: `${w}/${h}`, maxHeight: 560, width: `min(100%, ${Math.round((560 * w) / h)}px)` }} />;
}

export function FloorExplorer({ locale }: { locale: "en" | "es" }) {
  const es = locale === "es";
  const T = {
    filters: [
      ["all", es ? "Todas" : "All"],
      ["1", es ? "1 dorm. + estudio" : "1 Bed + Den"],
      ["2", es ? "2 dorm." : "2 Bed"],
      ["3", es ? "3 dorm." : "3 Bed"],
      ["4", es ? "4 dorm." : "4 Bed"],
      ["6", es ? "6 dorm." : "6 Bed"],
      ["ph", "Penthouse"],
    ] as [Filter, string][],
    tower: es ? "Torre 1" : "Tower 1",
    level: es ? "Nivel" : "Level",
    residences: es ? "residencias" : "residences",
    residence: es ? "residencia" : "residence",
    foyer: es ? "vestíbulo" : "foyer",
    foyerLevel: es ? "Nivel del vestíbulo" : "Foyer level",
    foyerNote: es ? "El nivel del vestíbulo reúne el lobby y los espacios comunes. Elija los niveles 5 a 18 para ver las residencias." : "The foyer level holds the lobby and shared spaces. Choose levels 5 to 18 to see residences.",
    ocean: es ? "Océano Atlántico" : "Atlantic Ocean",
    enlarge: es ? "Clic para ampliar" : "Click to enlarge",
    bedrooms: es ? "Dormitorios" : "Bedrooms",
    bathrooms: es ? "Baños" : "Bathrooms",
    powder: es ? "Medio baño" : "Powder",
    interior: es ? "Interior" : "Interior",
    exterior: es ? "Exterior" : "Exterior",
    ceilings: es ? "Techos" : "Ceilings",
    onFloor: es ? "Ubicación en el piso" : "Location on floor",
    inquire: es ? "Consultar por" : "Inquire about",
    thePh: es ? "el penthouse" : "the penthouse",
    prev: es ? "Residencia anterior" : "Previous residence",
    next: es ? "Residencia siguiente" : "Next residence",
    foot: es ? "Áreas del juego de planos. Todas las dimensiones son aproximadas y están sujetas al Plan de Oferta." : "Areas from the floor plan set. All dimensions are approximate and subject to the Offering Plan.",
    footFoyer: es ? "Plano del vestíbulo. Todas las dimensiones son aproximadas y están sujetas al Plan de Oferta." : "Foyer plan as drawn. All dimensions are approximate and subject to the Offering Plan.",
    level1: es ? "1.er nivel" : "1st level",
    level2: es ? "2.º nivel" : "2nd level",
    close: es ? "Cerrar" : "Close",
    zoomIn: es ? "Acercar" : "Zoom in",
    zoomOut: es ? "Alejar" : "Zoom out",
  };
  const bedLabel = (u: TowerResidence) => (u.id === "PH" ? (es ? "Penthouse · 6 dormitorios" : "Penthouse · 6 Bedrooms") : u.den ? (es ? "1 dormitorio + estudio" : "1 Bedroom + Den") : `${u.bed} ${es ? "dormitorios" : "Bedrooms"}`);
  const short = (u: TowerResidence) => (u.id === "PH" ? (es ? "6 dorm." : "6 Bed") : u.den ? (es ? "1 dorm. + estudio" : "1 Bed + Den") : `${u.bed} ${es ? "dorm." : "Bed"}`);
  const name = (u: TowerResidence) => (u.id === "PH" ? "The Penthouse" : `${es ? "Residencia" : "Residence"} ${u.id}`);

  const [filter, setFilter] = useState<Filter>("all");
  const [floor, setFloor] = useState(10);
  const [unitId, setUnitId] = useState("1002");
  const [phLevel, setPhLevel] = useState(1);
  const [zoom, setZoom] = useState<{ src: string; title: string } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);

  // Phones: the levels are a swipeable strip; keep the chosen level in view (scrolls the strip only, not the page).
  useEffect(() => {
    const t = towerRef.current;
    const b = t?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!t || !b || t.scrollWidth <= t.clientWidth) return;
    t.scrollLeft = b.offsetLeft - t.clientWidth / 2 + b.offsetWidth / 2;
  }, [floor]);

  const byId = useMemo(() => Object.fromEntries(U.map((u) => [u.id, u])), []);
  const matches = (u: TowerResidence) => filter === "all" || typeOf(u) === filter;
  const floorUnits = (f: number) => U.filter((u) => u.floor === f);
  const u = byId[unitId];
  const idx = U.indexOf(u);

  const pickUnit = (id: string) => {
    const r = byId[id];
    if (!r) return;
    setUnitId(id);
    setFloor(r.floor);
    if (id !== "PH") setPhLevel(1);
  };
  const pickFloor = (f: number) => {
    setFloor(f);
    if (f !== 1) {
      const us = floorUnits(f);
      const p = us.find(matches) ?? us[0];
      setUnitId(p.id);
      if (p.id !== "PH") setPhLevel(1);
    }
  };
  const pickFilter = (k: Filter) => {
    setFilter(k);
    const ok = (r: TowerResidence) => k === "all" || typeOf(r) === k;
    if (floor === 1 || !ok(u)) {
      const f = U.find(ok);
      if (f) pickUnit(f.id);
    }
  };

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (zoom && !d.open) d.showModal();
    if (!zoom && d.open) d.close();
  }, [zoom]);

  const feats = u
    ? [
        u.wrap ? (es ? "Vista al mar con terraza envolvente" : "Ocean view with wraparound terrace") : es ? "Balcón frente al mar" : "Ocean-facing balcony",
        u.elevator ? (es ? "Ascensor privado" : "Private elevator") : null,
        es ? "Techos de 10′" : "10′ ceilings",
        u.den ? (es ? "Estudio" : "Den") : null,
        u.floor >= 16 && u.id !== "PH" ? (es ? "Sala familiar y despensa" : "Family area and pantry") : null,
        u.floor === 17 ? (es ? "Cocina de chef" : "Chef’s kitchen") : null,
        u.id === "PH" ? (es ? "Nivel superior con gimnasio, estudio y sala de recreo" : "Upper level with gym, study and recreation room") : null,
      ].filter(Boolean)
    : [];

  const levels: number[] = [];
  for (let f = 18; f >= 1; f--) levels.push(f);

  return (
    <div>
      <div role="group" aria-label={es ? "Filtrar por dormitorios" : "Filter by bedrooms"} className="mb-8 flex flex-wrap gap-2">
        {T.filters.map(([k, l]) => (
          <button
            key={k}
            type="button"
            aria-pressed={filter === k}
            onClick={() => pickFilter(k)}
            className={cn("min-h-10 border px-4 text-[11px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors", filter === k ? "border-charcoal bg-charcoal text-bone" : "border-travertine-deep text-charcoal-soft hover:border-charcoal-soft hover:text-charcoal")}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] border border-travertine-deep/80 bg-white md:min-h-[640px] md:grid-cols-[110px_minmax(200px,260px)_minmax(0,1fr)]">
        {/* Tower */}
        <div ref={towerRef} role="group" aria-label={es ? "Elija un nivel" : "Choose a level"} className="relative flex flex-row items-end gap-1 overflow-x-auto border-b border-travertine-deep/80 bg-bone p-3 md:flex-col md:items-stretch md:justify-start md:gap-[3px] md:overflow-visible md:border-r md:border-b-0 md:px-3.5 md:py-5">
          <p className="mb-2 hidden text-center text-[10px] tracking-[0.22em] text-charcoal-soft uppercase md:block">{T.tower}</p>
          <div aria-hidden className="mx-auto mb-[3px] hidden h-3.5 w-1/3 border border-b-0 border-travertine-deep md:block" />
          {levels.map((f) => {
            const off = f >= 2 && f <= 4;
            const us = floorUnits(f);
            const m = f === 1 ? filter === "all" : us.some(matches);
            const label = f === 18 ? "PH" : f === 1 ? "L" : String(f);
            const cls = cn(
              "relative flex shrink-0 flex-col-reverse items-center gap-1 text-[11px] tabular-nums md:flex-row md:gap-2",
              f === 18 ? "md:h-[42px]" : "md:h-6",
              "w-9 md:w-auto",
            );
            const bar = cn("block w-full rounded-[2px] border transition-colors md:h-full md:flex-1", f === 18 ? "h-9" : "h-6", floor === f ? "border-brass bg-brass" : m && filter !== "all" ? "border-brass/75 bg-brass/30" : "border-travertine-deep bg-white");
            if (off)
              return (
                <div key={f} aria-hidden className={cn(cls, "opacity-40")}>
                  <span className="w-5 text-right md:w-6">{label}</span>
                  <i className={bar} />
                </div>
              );
            return (
              <button
                key={f}
                type="button"
                aria-current={floor === f}
                onClick={() => pickFloor(f)}
                className={cn(cls, floor === f ? "text-charcoal" : "text-charcoal-soft", !m && "opacity-35", "group")}
              >
                <span className="w-5 text-right md:w-6">
                  {label}
                  <span className="sr-only">
                    {" "}
                    · {T.level} {f}
                    {f === 1 ? `, ${T.foyer}` : f === 18 ? ", penthouse" : `, ${us.length} ${us.length === 1 ? T.residence : T.residences}`}
                  </span>
                </span>
                <i className={cn(bar, "group-hover:border-charcoal")} />
              </button>
            );
          })}
          <div aria-hidden className="mt-1 hidden h-px bg-charcoal-soft md:block" />
        </div>

        {/* Residences on the level */}
        <div className="flex min-w-0 flex-col border-b border-travertine-deep/80 md:border-r md:border-b-0">
          <div className="grid gap-0.5 border-b border-travertine-deep/80 px-5 pt-5 pb-4">
            <span className="text-[11px] tracking-[0.2em] text-charcoal-soft uppercase">
              {T.level} {floor}
            </span>
            <b className="font-[family-name:var(--font-display)] text-[24px] font-normal text-charcoal">
              {floor === 1 ? (es ? "Vestíbulo" : "Foyer") : floor === 18 ? "Penthouse" : `${floorUnits(floor).length} ${floorUnits(floor).length === 1 ? T.residence : T.residences}`}
            </b>
          </div>
          {floor === 1 ? (
            <p className="px-5 py-4 text-[14px] leading-relaxed text-charcoal-soft">{T.foyerNote}</p>
          ) : (
            <ul className="flex overflow-x-auto md:block md:overflow-visible">
              {floorUnits(floor).map((r) => (
                <li key={r.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={unitId === r.id}
                    onClick={() => pickUnit(r.id)}
                    className={cn(
                      "grid w-full items-center gap-3.5 border-r border-travertine-deep/80 px-4 py-3 text-left transition-colors hover:bg-bone md:grid-cols-[62px_minmax(0,1fr)] md:border-r-0 md:border-b md:px-5 md:py-3.5",
                      unitId === r.id && "bg-bone shadow-[inset_0_-2px_0_var(--color-brass)] md:shadow-[inset_2px_0_0_var(--color-brass)]",
                      !matches(r) && "opacity-40",
                    )}
                  >
                    <span aria-hidden className="hidden aspect-[210/91] w-[62px] bg-brass/90 md:block" style={mask(keySrc(r))} />
                    <span>
                      <strong className="block font-[family-name:var(--font-display)] text-[20px] font-normal text-charcoal">{r.id}</strong>
                      <small className="block text-[12px] tracking-[0.04em] whitespace-nowrap text-charcoal-soft tabular-nums">
                        {short(r)} · {fmt(r.interiorSqFt)} sq ft
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* The plan */}
        <div className="grid min-w-0 grid-rows-[auto_1fr_auto]" aria-live="polite">
          {floor === 1 ? (
            <>
              <div className="border-b border-travertine-deep/80 px-6 py-5">
                <span className="block text-[11px] tracking-[0.24em] text-brass-ink uppercase">
                  {T.level} 1 · {T.tower}
                </span>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-[34px] leading-none font-medium text-charcoal md:text-[42px]">{T.foyerLevel}</h3>
              </div>
              <button type="button" onClick={() => setZoom({ src: "/explorer/plans/foyer.png", title: T.foyerLevel })} className="relative grid cursor-zoom-in grid-rows-[auto_1fr] gap-4 bg-white px-6 pt-5 pb-8 text-left">
                <span className="flex items-center justify-center gap-2.5 text-[10px] tracking-[0.24em] text-brass-ink uppercase">
                  <Wave />
                  {T.ocean}
                  <Wave />
                </span>
                <Plan src="/explorer/plans/foyer.png" label={T.foyerLevel} />
                <span className="absolute right-4 bottom-3 text-[10px] tracking-[0.2em] text-charcoal-soft uppercase">{T.enlarge}</span>
              </button>
              <p className="border-t border-travertine-deep/80 px-6 py-3.5 text-[12px] text-charcoal-soft">{T.footFoyer}</p>
            </>
          ) : (
            u && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-travertine-deep/80 px-6 py-5">
                  <div>
                    <span className="block text-[11px] tracking-[0.24em] text-brass-ink uppercase">
                      {T.level} {u.floor} · {T.tower} · {bedLabel(u)}
                    </span>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[34px] leading-none font-medium text-charcoal md:text-[42px]">{name(u)}</h3>
                  </div>
                  <div className="flex gap-1.5">
                    {([-1, 1] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        aria-label={d < 0 ? T.prev : T.next}
                        disabled={d < 0 ? idx === 0 : idx === U.length - 1}
                        onClick={() => pickUnit(U[idx + d].id)}
                        className="grid size-11 place-items-center border border-travertine-deep text-charcoal transition-colors hover:border-brass disabled:cursor-default disabled:opacity-30"
                      >
                        {d < 0 ? "←" : "→"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid min-w-0 xl:grid-cols-[minmax(0,1fr)_250px]">
                  <div className="relative grid min-w-0 grid-rows-[auto_1fr] gap-4 bg-white px-6 pt-5 pb-9">
                    {u.id === "PH" && (
                      <div role="group" aria-label="Penthouse" className="absolute top-4 left-4 z-10 flex gap-1">
                        {[1, 2].map((l) => (
                          <button key={l} type="button" aria-pressed={phLevel === l} onClick={() => setPhLevel(l)} className={cn("border px-2.5 py-1.5 text-[10px] tracking-[0.18em] uppercase", phLevel === l ? "border-charcoal bg-charcoal text-bone" : "border-charcoal/30 text-charcoal")}>
                            {l === 1 ? T.level1 : T.level2}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className="flex items-center justify-center gap-2.5 text-[10px] tracking-[0.24em] text-brass-ink uppercase">
                      <Wave />
                      {T.ocean}
                      <Wave />
                    </span>
                    <button type="button" aria-label={`${T.enlarge}: ${name(u)}`} onClick={() => setZoom({ src: planSrc(u, phLevel), title: name(u) })} className="cursor-zoom-in">
                      <Plan src={planSrc(u, phLevel)} label={name(u)} />
                    </button>
                    <span className="pointer-events-none absolute right-4 bottom-3 text-[10px] tracking-[0.2em] text-charcoal-soft uppercase">{T.enlarge}</span>
                  </div>

                  <div className="grid content-start gap-6 border-t border-travertine-deep/80 px-6 py-6 xl:border-t-0 xl:border-l">
                    <dl className="grid">
                      {[
                        [T.bedrooms, `${u.bed}${u.den ? (es ? " + estudio" : " + den") : ""}`],
                        [T.bathrooms, String(u.bath)],
                        ...(u.powder ? [[T.powder, String(u.powder)]] : []),
                        [T.interior, `${fmt(u.interiorSqFt)} sq ft`, `${fm2(u.interiorM2)} m²`],
                        [T.exterior, `${fmt(u.exteriorSqFt)} sq ft`, `${fm2(u.exteriorM2)} m²`],
                        [T.ceilings, "10′"],
                      ].map(([k, v, m2]) => (
                        <div key={k} className="flex items-baseline justify-between gap-4 border-b border-travertine-deep/70 py-2.5">
                          <dt className="text-[11px] tracking-[0.18em] text-brass-ink uppercase">{k}</dt>
                          <dd className="text-right text-[16px] text-charcoal tabular-nums">
                            {v}
                            {m2 && <small className="block text-[12px] text-charcoal-soft">{m2}</small>}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <ul className="grid gap-2 text-[14px] text-charcoal">
                      {feats.map((f) => (
                        <li key={f as string} className="flex items-baseline gap-3">
                          <span aria-hidden className="h-px w-3 shrink-0 -translate-y-1 bg-brass" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="grid gap-2.5">
                      <span className="text-[11px] tracking-[0.24em] text-brass-ink uppercase">{T.onFloor}</span>
                      <span role="img" aria-label={T.onFloor} className="block w-full bg-brass/85" style={{ ...mask(keySrc(u)), aspectRatio: dims(keySrc(u)).join("/") }} />
                    </div>
                    <a href="#inquire" className="cta min-h-[52px] justify-center px-6 text-center" data-track="cta_inquire" data-track-label={`explorer-${u.id}`}>
                      {T.inquire} {u.id === "PH" ? T.thePh : u.id} →
                    </a>
                  </div>
                </div>
                <p className="border-t border-travertine-deep/80 px-6 py-3.5 text-[12px] text-charcoal-soft">{T.foot}</p>
              </>
            )
          )}
        </div>
      </div>

      <dialog ref={dialog} onClose={() => setZoom(null)} className="m-0 h-dvh max-h-none w-screen max-w-none bg-white p-0 backdrop:bg-black/60">
        {zoom && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-travertine-deep px-5 py-3.5">
              <b className="font-[family-name:var(--font-display)] text-[22px] font-normal text-charcoal">{zoom.title}</b>
              <div className="flex gap-2">
                <button type="button" onClick={() => setZoomed((z) => !z)} className="min-h-10 border border-travertine-deep px-4 text-[11px] tracking-[0.2em] text-charcoal uppercase">
                  {zoomed ? T.zoomOut : T.zoomIn}
                </button>
                <button type="button" onClick={() => setZoom(null)} className="min-h-10 border border-travertine-deep px-4 text-[11px] tracking-[0.2em] text-charcoal uppercase">
                  {T.close}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <span role="img" aria-label={zoom.title} className="mx-auto my-8 block bg-charcoal transition-[width]" style={{ ...mask(zoom.src), aspectRatio: dims(zoom.src).join("/"), width: zoomed ? "min(260vw, 3200px)" : "min(94vw, 1400px)" }} />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
