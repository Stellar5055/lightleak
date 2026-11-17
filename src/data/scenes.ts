export type PresetId = 'prism' | 'ball' | 'blank';
export type SpecimenId = 'sphere' | 'prism' | 'mirror';
export type SpectrumMode = 'white' | 'mono';

export type MaterialName = 'Glass' | 'Water' | 'Diamond';

export type SceneMeta = {
  number: string;
  name: string;
  objectName: string;
  caption: string;
  ior: number;
  dispersion: number;
  size: number;
  rotation: number;
};

export const SCENE_META: Record<PresetId, SceneMeta> = {
  prism: {
    number: '01',
    name: 'Prism Rainbow',
    objectName: 'Prism 01',
    caption:
      'White light is seven colours sharing a path. Glass bends each one differently.',
    ior: 1.52,
    dispersion: 4,
    size: 260,
    rotation: 20,
  },
  ball: {
    number: '02',
    name: 'Ball Lens',
    objectName: 'Sphere 01',
    caption:
      'A glass sphere is a lens. Parallel rays meet at 1.5R from its centre.',
    ior: 1.52,
    dispersion: 2.5,
    size: 110,
    rotation: 0,
  },
  blank: {
    number: '03',
    name: 'New Scene',
    objectName: 'No specimen',
    caption: 'Add a specimen to begin.',
    ior: 1.52,
    dispersion: 4,
    size: 260,
    rotation: 0,
  },
};

export const PRESETS: PresetId[] = ['prism', 'ball'];

export const MATERIALS: Record<
  MaterialName,
  { ior: number; dispersion: number }
> = {
  Glass: { ior: 1.52, dispersion: 4 },
  Water: { ior: 1.33, dispersion: 1.5 },
  Diamond: { ior: 2.42, dispersion: 5 },
};

export const SPECIMENS: {
  id: SpecimenId;
  label: string;
  hint: string;
}[] = [
  { id: 'sphere', label: 'Glass sphere', hint: 'Ball lens' },
  { id: 'prism', label: 'Prism', hint: 'Dispersion' },
  { id: 'mirror', label: 'Mirror', hint: 'Reflection' },
];

export function formatMm(value: number): string {
  return `${value.toFixed(0)} mm`;
}

export function formatIor(value: number): string {
  return value.toFixed(3);
}

export function criticalAngle(ior: number): number {
  if (ior <= 1) return 90;
  return (Math.asin(1 / ior) * 180) / Math.PI;
}
