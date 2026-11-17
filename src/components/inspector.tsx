import { Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Readout, Segmented, Slider } from './instrument';
import { criticalAngle, formatIor, formatMm, type MaterialName, type PresetId } from '@/data/scenes';

const MATERIAL_OPTIONS: { value: MaterialName; label: string }[] = [
  { value: 'Glass', label: 'Glass' },
  { value: 'Water', label: 'Water' },
  { value: 'Diamond', label: 'Diamond' },
];

type Props = {
  preset: PresetId;
  material: MaterialName;
  ior: number;
  dispersion: number;
  size: number;
  rotation: number;
  onMaterial: (material: MaterialName) => void;
  onIor: (value: number) => void;
  onDispersion: (value: number) => void;
  onSize: (value: number) => void;
  onRotation: (value: number) => void;
  onRemove: () => void;
  onAdd: (kind: 'prism' | 'sphere') => void;
};

export function Inspector({
  preset,
  material,
  ior,
  dispersion,
  size,
  rotation,
  onMaterial,
  onIor,
  onDispersion,
  onSize,
  onRotation,
  onRemove,
  onAdd,
}: Props) {
  if (preset === 'blank') {
    return (
      <aside className="flex flex-col rounded-[12px] border border-hairline bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
        <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
          Inspector
        </p>
        <div className="mt-3">
          <h2 className="font-display text-[24px] leading-none">
            No specimen
          </h2>
          <p className="mt-1.5 font-mono text-[8px] tracking-[0.12em] text-muted uppercase">
            Empty bench
          </p>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-muted">
          The bench is clean. Add one specimen to start an experiment, or open a
          preset from the left.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={() => onAdd('prism')} className="justify-between">
            Add a prism
            <Plus className="size-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => onAdd('sphere')}
            className="justify-between"
          >
            Add a sphere
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="mt-6 border-t border-hairline pt-4">
          <Readout label="Specimens" value="00 / 06" />
          <Readout label="Glass objects" value="00 / 03" />
          <Readout label="Receivers" value="02" />
        </div>
      </aside>
    );
  }

  const isPrism = preset === 'prism';

  return (
    <aside className="flex flex-col rounded-[12px] border border-hairline bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
      <p className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
        Inspector
      </p>
      <div className="mt-3">
        <h2 className="font-display text-[24px] leading-none">
          {isPrism ? 'Prism' : 'Sphere'}{' '}
          <span className="font-mono text-[10px] tracking-[0.02em] text-muted">
            01
          </span>
        </h2>
        <p className="mt-1.5 font-mono text-[8px] tracking-[0.12em] text-muted uppercase">
          {isPrism ? 'Equilateral · glass' : 'Ball lens · glass'}
        </p>
      </div>

      <div className="mt-4">
        <p className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase">
          Material
        </p>
        <Segmented
          value={material}
          options={MATERIAL_OPTIONS}
          onChange={onMaterial}
          className="mt-2 w-full justify-between"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Slider
          label="Refractive index"
          value={ior}
          min={1}
          max={2.5}
          step={0.001}
          display={formatIor(ior)}
          onChange={onIor}
        />
        <Slider
          label="Dispersion"
          value={dispersion}
          min={0}
          max={5}
          step={0.1}
          display={`×${dispersion.toFixed(1)}`}
          onChange={onDispersion}
        />
        <Slider
          label={isPrism ? 'Side' : 'Radius'}
          value={size}
          min={isPrism ? 140 : 45}
          max={isPrism ? 320 : 140}
          step={1}
          display={formatMm(size)}
          onChange={onSize}
        />
        {isPrism && (
          <Slider
            label="Rotation"
            value={rotation}
            min={0}
            max={360}
            step={1}
            display={`${rotation.toFixed(0)}°`}
            onChange={onRotation}
          />
        )}
      </div>

      <div className="mt-4 border-t border-hairline pt-2">
        <Readout
          label="Critical angle"
          value={`${criticalAngle(ior).toFixed(1)}°`}
        />
        <Readout label="Medium" value={material} />
        <Readout label="Reference λ" value="589 nm" />
      </div>

      <p className="mt-2 text-[9px] leading-relaxed text-muted">
        {isPrism
          ? `Critical angle measured at 589 nm. Dispersion is exaggerated ×${dispersion.toFixed(
              0,
            )} so the spectrum reads on screen.`
          : 'A sphere focuses parallel rays at 1.5R. The caustic is computed from 60k photons in the full build.'}
      </p>

      <Button
        variant="ghost"
        onClick={onRemove}
        className="mt-3 w-full justify-start gap-2 px-2 text-[10px] text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
        Remove specimen
      </Button>
    </aside>
  );
}
