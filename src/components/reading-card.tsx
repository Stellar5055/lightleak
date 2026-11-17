import { X } from 'lucide-react';
import { Button } from './ui/button';
import type { PresetId } from '@/data/scenes';

export function ReadingCard({
  open,
  preset,
  onClose,
}: {
  open: boolean;
  preset: PresetId;
  onClose: () => void;
}) {
  if (!open) return;

  const ball = preset === 'ball';
  const rows = ball
    ? [
        ['Incidence', '18.4°'],
        ['Refraction', '12.0°'],
        ['Critical angle', '41.1°'],
        ['Fresnel R', '4.1%'],
      ]
    : [
        ['Incidence', '41.2°'],
        ['Refraction', '27.6°'],
        ['Critical angle', '41.1°'],
        ['Fresnel R', '4.8%'],
      ];

  return (
    <div
      className="animate-fade-in absolute bottom-4 left-1/2 z-20 w-[min(390px,calc(100%-2rem))] -translate-x-1/2 rounded-[12px] border border-hairline bg-surface p-4 shadow-2xl"
      role="dialog"
      aria-label="Ray measurement"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[8px] tracking-[0.14em] text-muted uppercase">
            Ray 014 · λ 532 nm
          </p>
          <h3 className="mt-1 text-[13px] font-medium">
            {ball ? 'Sphere surface' : 'Prism face 2'}
          </h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close ray readout"
          className="size-7"
        >
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-[6px] bg-paper px-2.5 py-2 font-mono text-[9px]">
        <span className="text-muted">AIR</span>
        <span className="text-muted/50">n 1.000</span>
        <span className="mx-1 text-muted/40">→</span>
        <span>GLASS</span>
        <span className="text-muted">n 1.520</span>
      </div>

      <div className="mt-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between border-b border-hairline py-1.5 last:border-0"
          >
            <span className="text-[9px] text-muted">{label}</span>
            <span className="font-mono text-[10px] tabular-nums">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="spectrum-bar h-[3px] flex-1 rounded-full" />
        <span className="font-mono text-[8px] tracking-[0.08em] text-muted uppercase">
          no TIR
        </span>
      </div>
    </div>
  );
}
