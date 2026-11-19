/**
 * The cream statement band (client, 18 Nov: "the images are too small and don't make sense; the text doesn't fit"):
 * a large serif statement, centred, each sentence on its own line so phones never break mid-phrase (polish, 19 Nov).
 */
export function ScrollStatement({ lines }: { lines: string[] }) {
  return (
    <div className="flex min-h-[44svh] items-center justify-center px-5 py-20 md:min-h-[56svh] md:px-10 md:py-28">
      <p className="text-center font-[family-name:var(--font-display)] text-[36px] leading-[1.1] text-balance text-[var(--v2-green)] md:text-[72px] lg:text-[96px]" data-reveal>
        {lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </p>
    </div>
  );
}
