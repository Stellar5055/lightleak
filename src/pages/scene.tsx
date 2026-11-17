import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ExportDialog } from '@/components/export-dialog';
import { HelpSheet } from '@/components/help-sheet';
import { Inspector } from '@/components/inspector';
import { ReadingCard } from '@/components/reading-card';
import { SceneTopBar } from '@/components/top-bar';
import { SceneVisual } from '@/components/scene-visual';
import { SourceBar } from '@/components/source-bar';
import { SpecimenRail } from '@/components/specimen-rail';
import { useToast } from '@/components/toast';
import {
  MATERIALS,
  SCENE_META,
  type MaterialName,
  type PresetId,
  type SpecimenId,
  type SpectrumMode,
} from '@/data/scenes';

function isPreset(value: string | null): value is PresetId {
  return value === 'prism' || value === 'ball' || value === 'blank';
}

export function ScenePage() {
  const [params] = useSearchParams();
  const raw = params.get('preset');
  const preset: PresetId = isPreset(raw) ? raw : 'prism';

  return <SceneEditor key={preset} preset={preset} />;
}

function SceneEditor({ preset }: { preset: PresetId }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const meta = SCENE_META[preset];

  const [material, setMaterial] = useState<MaterialName>('Glass');
  const [ior, setIor] = useState(meta.ior);
  const [dispersion, setDispersion] = useState(meta.dispersion);
  const [size, setSize] = useState(meta.size);
  const [rotation, setRotation] = useState(meta.rotation);
  const [angle, setAngle] = useState(-16);
  const [width, setWidth] = useState(12);
  const [spectrum, setSpectrum] = useState<SpectrumMode>('white');
  const [rays, setRays] = useState(true);
  const [solver, setSolver] = useState<'ready' | 'busy'>('ready');
  const [helpOpen, setHelpOpen] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const solverTimer = useRef<number | null>(null);

  useEffect(() => {
    document.title = `${meta.name} — Lightleak`;
  }, [meta.name]);

  useEffect(() => {
    return () => {
      if (solverTimer.current) {
        window.clearTimeout(solverTimer.current);
      }
    };
  }, []);

  const bumpSolver = () => {
    setSolver('busy');
    if (solverTimer.current) {
      window.clearTimeout(solverTimer.current);
    }
    solverTimer.current = window.setTimeout(() => setSolver('ready'), 650);
  };

  const handleMaterial = (next: MaterialName) => {
    setMaterial(next);
    setIor(MATERIALS[next].ior);
    setDispersion(MATERIALS[next].dispersion);
    bumpSolver();
  };

  const handleSpecimen = (id: SpecimenId) => {
    if (id === 'mirror') {
      toast('The mirror scene is not in this mockup yet.');
      return;
    }
    navigate(id === 'prism' ? '/scene?preset=prism' : '/scene?preset=ball');
  };

  const handlePreset = (id: PresetId) => {
    navigate(`/scene?preset=${id}`);
  };

  const handleRemove = () => {
    navigate('/scene?preset=blank');
    toast('Specimen removed. The bench is clear.');
  };

  const handleClear = () => {
    navigate('/scene?preset=blank');
    toast('Bench cleared.');
  };

  const handleAdd = (kind: 'prism' | 'sphere') => {
    navigate(kind === 'prism' ? '/scene?preset=prism' : '/scene?preset=ball');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('Link copied. The scene travels in the URL.');
    } catch {
      toast('Could not copy. Use the address bar.');
    }
  };

  const handleMeasure = () => {
    if (preset === 'blank') {
      toast('Add a specimen first.');
      return;
    }
    setReadingOpen(true);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      ) {
        return;
      }

      if (event.key === 'Escape') {
        setHelpOpen(false);
        setReadingOpen(false);
        setExportOpen(false);
      }
      if (event.key.toLowerCase() === 'r') {
        setRays((value) => !value);
      }
      if (event.key === '1') {
        navigate('/scene?preset=prism');
      }
      if (event.key === '2') {
        navigate('/scene?preset=ball');
      }
      if (event.key === '?') {
        setHelpOpen(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const active: SpecimenId | null =
    preset === 'blank' ? null : preset === 'prism' ? 'prism' : 'sphere';

  const wavelength =
    preset === 'blank'
      ? 'λ —'
      : spectrum === 'mono'
        ? 'λ 532 nm'
        : 'λ 430–670 nm';

  return (
    <div className="relative min-h-screen bg-paper text-ink">
      <div className="grid-paper-soft pointer-events-none fixed inset-0 opacity-70" />

      <div className="relative z-10">
        <SceneTopBar
        preset={preset}
        name={meta.name}
        rays={rays}
        onToggleRays={() => setRays((value) => !value)}
        onHelp={() => setHelpOpen(true)}
        onShare={handleShare}
        onExport={() => setExportOpen(true)}
        onMeasure={handleMeasure}
        onPreset={handlePreset}
      />

      <main className="mx-auto max-w-[1600px] px-3 pt-3 pb-3 lg:h-[calc(100dvh-4rem)]">
        <div className="grid gap-3 lg:h-full lg:grid-cols-[236px_minmax(0,1fr)_304px]">
          <div className="no-scrollbar order-3 min-h-0 lg:order-1 lg:overflow-y-auto">
            <SpecimenRail
              preset={preset}
              active={active}
              onSpecimen={handleSpecimen}
              onPreset={handlePreset}
              onNew={() => handlePreset('blank')}
              onClear={handleClear}
            />
          </div>

          <div className="order-1 flex min-h-0 flex-col gap-3 lg:order-2">
            <section className="relative min-h-[460px] flex-1 overflow-hidden rounded-[16px] border border-ink/15 bg-chamber shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <SceneVisual
                preset={preset}
                rays={rays}
                spectrum={spectrum}
                width={width}
                selected={active !== null}
                onRayClick={() => setReadingOpen(true)}
                idPrefix="scene"
              />

              <div className="pointer-events-none absolute top-4 left-5 flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-white/55 uppercase">
                <span>{preset === 'blank' ? 'No specimen' : meta.objectName}</span>
                <span className="text-white/25">/</span>
                <span className="text-white/35">
                  n {preset === 'blank' ? '—' : ior.toFixed(3)}
                </span>
              </div>

              <div className="pointer-events-none absolute top-4 right-5 font-mono text-[9px] tracking-[0.12em] text-white/40 uppercase">
                {wavelength}
              </div>

              <div className="pointer-events-none absolute bottom-4 left-5 hidden items-center gap-3 font-mono text-[8px] tracking-[0.12em] text-white/30 uppercase sm:flex">
                <span>Drag to orbit</span>
                <span>Scroll to zoom</span>
                <span>R · Rays</span>
              </div>

              <div className="pointer-events-none absolute right-5 bottom-4 flex items-center gap-2">
                <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-[8px] tracking-[0.12em] text-white/40 uppercase">
                  Mockup
                </span>
                <span className="font-mono text-[8px] tracking-[0.12em] text-white/25 uppercase">
                  LL-01
                </span>
              </div>

              {!readingOpen && preset !== 'blank' && (
                <div className="pointer-events-none absolute bottom-12 left-1/2 w-[min(520px,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-center text-[9px] leading-relaxed text-white/55 backdrop-blur-sm">
                  {spectrum === 'mono'
                    ? 'A single wavelength does not split. Switch back to White to see dispersion.'
                    : meta.caption}
                </div>
              )}

              <ReadingCard
                open={readingOpen}
                preset={preset}
                onClose={() => setReadingOpen(false)}
              />
            </section>

            <SourceBar
              angle={angle}
              width={width}
              spectrum={spectrum}
              solver={solver}
              onAngle={(value) => {
                setAngle(value);
                bumpSolver();
              }}
              onWidth={(value) => {
                setWidth(value);
                bumpSolver();
              }}
              onSpectrum={(value) => {
                setSpectrum(value);
                bumpSolver();
              }}
            />
          </div>

          <div className="no-scrollbar order-2 min-h-0 lg:order-3 lg:overflow-y-auto">
            <Inspector
              preset={preset}
              material={material}
              ior={ior}
              dispersion={dispersion}
              size={size}
              rotation={rotation}
              onMaterial={handleMaterial}
              onIor={(value) => {
                setIor(value);
                bumpSolver();
              }}
              onDispersion={(value) => {
                setDispersion(value);
                bumpSolver();
              }}
              onSize={(value) => {
                setSize(value);
                bumpSolver();
              }}
              onRotation={(value) => {
                setRotation(value);
                bumpSolver();
              }}
              onRemove={handleRemove}
              onAdd={handleAdd}
            />
          </div>
        </div>
      </main>
      </div>

      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        preset={preset}
        rays={rays}
        spectrum={spectrum}
        width={width}
      />
    </div>
  );
}
