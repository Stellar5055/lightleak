import { Eraser, Plus } from 'lucide-react';
import {
  PRESETS,
  SCENE_META,
  SPECIMENS,
  type PresetId,
  type SpecimenId,
} from '@/data/scenes';
import { cn } from '@/lib/utils';

function SpecimenIcon({ type }: { type: SpecimenId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === 'sphere' && (
        <>
          <circle cx="12" cy="12" r="7" />
          <path d="M6.8 9.4c2.6 3.1 7.2 3.8 10.4 1.2" />
        </>
      )}
      {type === 'prism' && (
        <>
          <path d="M12 4 21 20H3Z" />
          <path d="M2 13h9" />
          <path d="m16 17 6-2" />
        </>
      )}
      {type === 'mirror' && (
        <>
          <rect x="8" y="3" width="8" height="18" rx="0.8" />
          <path d="M3 12h5" />
          <path d="m16 9 5-2" />
        </>
      )}
    </svg>
  );
}

function RailLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
      {children}
    </p>
  );
}

type Props = {
  preset: PresetId;
  active: SpecimenId | null;
  onSpecimen: (id: SpecimenId) => void;
  onPreset: (id: PresetId) => void;
  onNew: () => void;
  onClear: () => void;
};

export function SpecimenRail({
  preset,
  active,
  onSpecimen,
  onPreset,
  onNew,
  onClear,
}: Props) {
  return (
    <aside className="flex flex-col rounded-[12px] border border-hairline bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
      <RailLabel>Specimens</RailLabel>
      <div className="mt-2 flex flex-col gap-1">
        {SPECIMENS.map((specimen) => {
          const selected = active === specimen.id;
          return (
            <button
              key={specimen.id}
              type="button"
              onClick={() => onSpecimen(specimen.id)}
              className={cn(
                'group flex items-center gap-3 rounded-[8px] border px-2.5 py-2 text-left transition-colors',
                selected
                  ? 'border-ink bg-ink text-paper'
                  : 'border-transparent text-ink hover:border-hairline hover:bg-paper',
              )}
            >
              <span
                className={cn(
                  'transition-colors',
                  selected ? 'text-paper' : 'text-muted group-hover:text-ink',
                )}
              >
                <SpecimenIcon type={specimen.id} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium">
                  {specimen.label}
                </span>
                <span
                  className={cn(
                    'block font-mono text-[8px] tracking-[0.1em] uppercase',
                    selected ? 'text-paper/50' : 'text-muted',
                  )}
                >
                  {specimen.hint}
                </span>
              </span>
              {selected && (
                <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <RailLabel>Presets</RailLabel>
        <div className="mt-2 flex flex-col gap-1">
          {PRESETS.map((id) => {
            const scene = SCENE_META[id];
            const activePreset = preset === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onPreset(id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-[6px] border-l-2 py-1.5 pr-2 pl-2.5 text-left transition-colors',
                  activePreset
                    ? 'border-ink bg-paper'
                    : 'border-transparent text-muted hover:bg-paper hover:text-ink',
                )}
              >
                <span className="font-mono text-[8px] tracking-[0.08em] opacity-60">
                  {scene.number}
                </span>
                <span className="text-[10px] font-medium">{scene.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onNew}
            className="flex items-center gap-2 rounded-[6px] border-l-2 border-transparent py-1.5 pl-2.5 text-left text-[10px] font-medium text-muted transition-colors hover:bg-paper hover:text-ink"
          >
            <Plus className="size-3" />
            New scene
          </button>
        </div>
      </div>

      <div className="mt-5 border-t border-hairline pt-3">
        <RailLabel>Bench</RailLabel>
        <dl className="mt-1.5">
          <div className="flex items-center justify-between border-b border-dashed border-hairline py-1.5">
            <dt className="text-[9px] text-muted">Specimens</dt>
            <dd className="font-mono text-[9px]">
              {active ? '01' : '00'} / 06
            </dd>
          </div>
          <div className="flex items-center justify-between border-b border-dashed border-hairline py-1.5">
            <dt className="text-[9px] text-muted">Glass</dt>
            <dd className="font-mono text-[9px]">{active ? '01' : '00'} / 03</dd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-[9px] text-muted">Receivers</dt>
            <dd className="font-mono text-[9px]">02</dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="mt-4 flex items-center gap-2 rounded-[6px] px-1 py-1.5 text-left text-[9px] tracking-[0.06em] text-muted uppercase transition-colors hover:text-signal"
      >
        <Eraser className="size-3" />
        Clear bench
      </button>
    </aside>
  );
}
