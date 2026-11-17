import type { ReactNode } from 'react';
import { MoveRight } from 'lucide-react';
import brandMark from '@/assets/brand-mark.png';
import { Button } from './button';

type HeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel: string;
  onSecondary: () => void;
};

export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto min-h-svh w-full overflow-hidden px-6 pt-28 text-center md:px-8 md:pt-36"
    >
      <div className="grid-paper pointer-events-none absolute inset-0 -z-10" />

      <div className="animate-dome absolute top-[calc(100%-120px)] left-1/2 h-[500px] w-[700px] rounded-[100%] border border-ink/25 bg-[radial-gradient(closest-side,#1c1f24_0%,#111216_62%,#0a0b0e_84%,#3a3d44_100%)] shadow-[0_-20px_120px_rgba(242,242,238,0.05)] md:top-[calc(100%-90px)] md:h-[500px] md:w-[1100px] lg:top-[calc(100%-150px)] lg:h-[750px] lg:w-[140%]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-white/5 px-4 py-2 text-[10px] font-medium tracking-[0.16em] text-ink uppercase backdrop-blur">
          <img
            src={brandMark}
            alt=""
            className="size-5 rounded-[4px] shadow-[0_1px_2px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          />
          {eyebrow}
        </div>

        <h1 className="animate-fade-in mx-auto mt-8 max-w-5xl bg-gradient-to-br from-ink from-30% to-ink/35 bg-clip-text py-2 text-[clamp(3rem,8.2vw,7.2rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-balance text-transparent">
          {title}
        </h1>

        <p className="animate-fade-in delay-1 mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-balance text-muted md:mt-6 md:text-[18px]">
          {subtitle}
        </p>

        <div className="animate-fade-in delay-2 mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-9">
          <Button
            size="lg"
            onClick={onPrimary}
            className="h-11 rounded-[8px] px-7 text-[15px] md:h-12"
          >
            {primaryLabel}
            <MoveRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onSecondary}
            className="h-11 rounded-[8px] border-ink/15 bg-paper px-7 text-[15px] md:h-12"
          >
            {secondaryLabel}
          </Button>
        </div>

        <p className="animate-fade-in delay-3 mt-5 font-mono text-[9px] tracking-[0.18em] text-muted uppercase md:mt-8">
          Open source · built for Hack Club Crossroads
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12 bg-gradient-to-t from-paper via-paper/60 to-transparent md:h-20" />
    </section>
  );
}
