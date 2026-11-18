/**
 * The cream statement band (client, 18 Nov: "the images are too small and don't make sense; the text doesn't fit"):
 * one large serif line, centred and wrapping to fit the screen, no floating pictures.
 */
export function ScrollStatement({ text }: { text: string }) {
  return (
    <div className="flex min-h-[60svh] items-center justify-center px-5 py-24 md:min-h-[72svh] md:px-10 md:py-32">
      <p className="max-w-[18ch] text-center font-[family-name:var(--font-display)] text-[44px] leading-[1.06] text-balance text-[var(--v2-green)] md:text-[80px] lg:text-[104px]" data-reveal>
        {text}
      </p>
    </div>
  );
}
