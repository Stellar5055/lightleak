import { useRef } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';
import { SceneVisual } from './scene-visual';
import { useToast } from './toast';
import { SCENE_META, type PresetId, type SpectrumMode } from '@/data/scenes';

type Props = {
  open: boolean;
  onClose: () => void;
  preset: PresetId;
  rays: boolean;
  spectrum: SpectrumMode;
  width: number;
};

export function ExportDialog({
  open,
  onClose,
  preset,
  rays,
  spectrum,
  width,
}: Props) {
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  if (!open) return null;

  const scene = SCENE_META[preset];

  const download = () => {
    const svg = previewRef.current?.querySelector('svg');
    if (!svg) return;

    const clone = svg.cloneNode(true) as SVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const source = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(
      clone,
    )}`;
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `lightleak-${preset}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast('Plate downloaded as SVG.');
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
        onClick={(event) => event.stopPropagation()}
        className="animate-fade-in max-h-[calc(100dvh-2rem)] w-[min(940px,100%)] overflow-y-auto rounded-[14px] border border-hairline bg-surface shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-hairline p-4">
          <div>
            <p className="font-mono text-[8px] tracking-[0.14em] text-muted uppercase">
              Export / plate
            </p>
            <h2
              id="export-title"
              className="mt-1 font-display text-[24px] leading-none"
            >
              Save this bench.
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close export dialog"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="p-4">
          <div
            ref={previewRef}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] border border-hairline bg-chamber"
          >
            <SceneVisual
              preset={preset}
              rays={rays}
              spectrum={spectrum}
              width={width}
              idPrefix="export"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="font-mono text-[8px] tracking-[0.16em] text-white/55 uppercase">
                Lightleak / {scene.name} / LL-01
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[10px] leading-relaxed text-muted">
            Preview only. This mockup downloads the plate as SVG; the full build
            exports a 2× PNG.
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button type="button" onClick={download}>
              <Download className="size-4" />
              Download SVG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
