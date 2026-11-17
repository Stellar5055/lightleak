import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-hairline py-4">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[8px] tracking-[0.1em] text-muted">
          {number}
        </span>
        <h3 className="text-[12px] font-medium">{title}</h3>
      </div>
      <div className="mt-2 pl-6 text-[11px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export function HelpSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={(event) => event.stopPropagation()}
        className="animate-sheet absolute top-0 right-0 h-full w-[min(430px,100vw)] overflow-y-auto border-l border-hairline bg-paper p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
              Help / 01
            </p>
            <h2
              id="help-title"
              className="mt-2 font-display text-[30px] leading-none"
            >
              How to use the bench.
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close help"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-6">
          <Section number="01" title="Move around">
            The chamber is a still plate in this mockup. In the full build you
            will drag to orbit and scroll to zoom.
          </Section>
          <Section number="02" title="Change the glass">
            Pick Glass, Water or Diamond, then fine-tune the refractive index and
            dispersion. The inspector updates immediately; the scene stays an
            illustration in this mockup.
          </Section>
          <Section number="03" title="Read a ray">
            Click any beam, or press the ruler in the top bar. The card shows
            incidence, refraction, the critical angle and Fresnel reflectance.
          </Section>
          <Section number="04" title="What is real">
            Snell’s law, Fresnel reflectance, total internal reflection, Cauchy
            dispersion, Beer–Lambert absorption, and photon-mapped caustics. None
            of it is faked in the final build.
          </Section>
          <Section number="05" title="What is approximated">
            Seven spectral bands, not a continuous spectrum. No diffraction,
            polarization or interference. Caustics only on flat receivers. The
            mirror is ideal and double-sided. The glass material is a look, not
            the simulation.
          </Section>
          <Section number="06" title="Keys">
            <span className="font-mono text-[10px]">R</span> rays ·{' '}
            <span className="font-mono text-[10px]">Esc</span> close ·{' '}
            <span className="font-mono text-[10px]">1 / 2</span> scenes
          </Section>
          <Section number="07" title="Credits">
            Instrument Sans, Newsreader, IBM Plex Mono. Built with React and
            Tailwind. Three.js arrives with the simulation.
          </Section>
        </div>

        <div className="mt-6 rounded-[8px] border border-hairline bg-surface p-3">
          <p className="font-mono text-[8px] tracking-[0.14em] text-muted uppercase">
            This build
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted">
            A UI mockup. Buttons, pages, sliders and overlays work. No light is
            simulated yet.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="mt-4 w-full"
        >
          Close
        </Button>
      </aside>
    </div>
  );
}
