/**
 * The cream statement band (client, 18 Nov: "the images are too small and don't make sense; the text doesn't fit"):
 * a serif statement, centred and compact (client, 19 Nov: "so much killing space"), each sentence on its own line so phones never break mid-phrase (polish, 19 Nov).
 */
export function ScrollStatement({ lines }: { lines: string[] }) {
  return (
    <div className="px-5 py-16 md:px-10 md:py-20 lg:py-24">
      <p className="text-center font-[family-name:var(--font-display)] text-[32px] leading-[1.12] text-balance text-[var(--v2-green)] md:text-[52px] lg:text-[64px]" data-reveal>
        {lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
    </div>
  );
}
