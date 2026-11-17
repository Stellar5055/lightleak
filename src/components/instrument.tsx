import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type Option<T extends string> = { value: T; label: string };

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'inline-flex rounded-[8px] border border-hairline bg-paper p-0.5',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-[6px] px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] uppercase transition-colors',
            value === option.value
              ? 'bg-ink text-paper'
              : 'text-muted hover:text-ink',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange,
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  onChange: (value: number) => void;
  className?: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <label className={cn('block', className)}>
      <span className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
          {label}
        </span>
        <span className="shrink-0 font-mono text-[10px] whitespace-nowrap tabular-nums">
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="scene-slider mt-1"
        style={{ '--fill': `${percent}%` } as CSSProperties}
      />
    </label>
  );
}

export function Readout({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 last:border-0">
      <span className="text-[10px] text-muted">{label}</span>
      <span
        className={cn(
          'font-mono text-[10px] tabular-nums',
          accent ? 'text-signal' : 'text-ink',
        )}
      >
        {value}
      </span>
    </div>
  );
}
