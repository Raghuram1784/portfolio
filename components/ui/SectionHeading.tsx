import { SplitHeading, Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

/** Numbered label + oversized grotesk title with an optional serif-italic gilt accent. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  className,
  id,
  invert,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  className?: string;
  id?: string;
  invert?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <Reveal y={12}>
        <span className={cn("label", invert && "!text-ivory/70")}>
          {index && <b>{index}</b>} {eyebrow}
        </span>
      </Reveal>
      <h2 id={id} className="sr-only">
        {[title, accent].filter(Boolean).join(" ")}
      </h2>
      <div aria-hidden="true" className="mt-5">
        <SplitHeading
          as="h3"
          text={title}
          accent={accent}
          className={cn("text-[clamp(2.7rem,6.4vw,5.6rem)] leading-[1] font-semibold", invert && "!text-ivory")}
        />
      </div>
      {description && (
        <Reveal delay={0.15}>
          <p className={cn("mt-6 max-w-xl text-[1.06rem] leading-relaxed text-muted", invert && "!text-ivory/75")}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
