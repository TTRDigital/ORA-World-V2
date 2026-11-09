import { splitAccent } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = { text: string; as?: "h1" | "h2" | "h3" | "p"; size?: "xl" | "l" | "m" | "s"; className?: string; id?: string; words?: boolean };

/**
 * Display headline with the single italic accent word (*word*). Max three lines on desktop: keep copy short.
 * With `words`, each word sits in its own mask and rises in sequence when an ancestor gets .is-revealed
 * (transform only; the text is in the DOM and readable from the start).
 */
export function Headline({ text, as: Tag = "h2", size = "l", className, id, words }: Props) {
  const parts = splitAccent(text);
  if (!words) {
    return (
      <Tag id={id} className={cn(`display-${size}`, className)}>
        {parts.map((p, i) =>
          p.accent ? (
            <em key={i} className="accent">
              {p.text}
            </em>
          ) : (
            <span key={i}>{p.text}</span>
          ),
        )}
      </Tag>
    );
  }
  let n = 0;
  return (
    <Tag id={id} className={cn(`display-${size}`, "words-reveal", className)}>
      {parts.map((p, i) => {
        const tokens = p.text.split(/(\s+)/);
        const content = tokens.map((tok, j) =>
          /^\s+$/.test(tok) || tok === "" ? (
            tok
          ) : (
            <span key={j} className="w">
              <span className="wi" style={{ "--i": n++ } as React.CSSProperties}>
                {tok}
              </span>
            </span>
          ),
        );
        return p.accent ? (
          <em key={i} className="accent">
            {content}
          </em>
        ) : (
          <span key={i}>{content}</span>
        );
      })}
    </Tag>
  );
}
