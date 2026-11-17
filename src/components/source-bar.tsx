import { Sun } from 'lucide-react';
import { Segmented, Slider } from './instrument';
import type { SpectrumMode } from '@/data/scenes';
import { cn } from '@/lib/utils';

type Props = {
  angle: number;
  width: number;
  spectrum: SpectrumMode;
  solver: 'ready' | 'busy';
  onAngle: (value: number) => void;
  onWidth: (value: number) => void;
  onSpectrum: (value: SpectrumMode) => void;
};

export function SourceBar({
  angle,
  width,
  spectrum,
  solver,
  onAngle,
  onWidth,
  onSpectrum,
}: Props) {
  return (
    <section className="rounded-[12px] border border-hairline bg-surface p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex min-w-[112px] items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-full border border-hairline text-muted">
            <Sun className="size-3.5" />
          </span>
          <div>
            <p className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
              Source
            </p>
            <p className="mt-0.5 text-[10px] font-medium">
              Collimated · {spectrum === 'mono' ? '532 nm' : 'white'}
            </p>
          </div>
        </div>

        <Slider
          label="Angle"
          value={angle}
          min={-60}
          max={60}
          step={1}
          display={`${angle.toFixed(0)}°`}
          onChange={onAngle}
          className="w-[150px] flex-1 sm:flex-none"
        />

        <Slider
          label="Width"
          value={width}
          min={2}
          max={16}
          step={0.5}
          display={`${width.toFixed(1)} mm`}
          onChange={onWidth}
          className="w-[150px] flex-1 sm:flex-none"
        />

        <div>
          <p className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
            Spectrum
          </p>
          <Segmented
            value={spectrum}
            options={[
              { value: 'white', label: 'White' },
              { value: 'mono', label: 'Mono' },
            ]}
            onChange={onSpectrum}
            className="mt-1"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 pb-1">
          <span
            className={cn(
              'size-1.5 rounded-full',
              solver === 'busy'
                ? 'animate-led bg-signal'
                : 'bg-ink/25',
            )}
            aria-hidden="true"
          />
          <span className="font-mono text-[8px] tracking-[0.14em] text-muted uppercase">
            Solver {solver === 'busy' ? 'busy' : 'ready'}
          </span>
        </div>
      </div>
    </section>
  );
}
