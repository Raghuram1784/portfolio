"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
}

/** Fade + rise when scrolled into view (respects reduced motion via MotionConfig). */
export function Reveal({ children, className, delay = 0, y = 28, as = "div" }: RevealProps) {
  const Comp = motion[as] as ElementType;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Comp>
  );
}

const container: Variants = {
  hidden: {},
  show: (stagger: number = 0.08) => ({ transition: { staggerChildren: stagger } }),
};
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function Stagger({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul";
}) {
  const Comp = motion[as] as ElementType;
  return (
    <Comp
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Comp>
  );
}

/** Word-by-word masked heading entrance. Use `accent` to gild trailing words. */
export function SplitHeading({
  text,
  accent,
  className,
  as = "h2",
  delay = 0,
  id,
}: {
  id?: string;
  text: string;
  accent?: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}) {
  const words = text.split(" ");
  const accentWords = accent ? accent.split(" ") : [];
  const all = [...words.map((w) => ({ w, gold: false })), ...accentWords.map((w) => ({ w, gold: true }))];
  const Tag = as;
  return (
    <Tag id={id} className={cn(className)} aria-label={[text, accent].filter(Boolean).join(" ")}>
      {all.map(({ w, gold }, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pt-[0.04em] pb-[0.22em] -mb-[0.1em] align-bottom">
          <motion.span
            className={cn("inline-block", gold && "gilt serif-em pr-[0.06em]")}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.95, ease, delay: delay + i * 0.07 }}
          >
            {w}
            {i < all.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
