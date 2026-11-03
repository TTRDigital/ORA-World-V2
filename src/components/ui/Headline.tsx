import { splitAccent } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = { text: string; as?: "h1" | "h2" | "h3" | "p"; size?: "xl" | "l" | "m" | "s"; className?: string; id?: string };

/** Display headline with the single italic accent word (*word*). Max three lines on desktop: keep copy short. */
export function Headline({ text, as: Tag = "h2", size = "l", className, id }: Props) {
  return (
    <Tag id={id} className={cn(`display-${size}`, className)}>
      {splitAccent(text).map((p, i) =>
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
