import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CircleHelp,
  Download,
  Eye,
  EyeOff,
  Ruler,
  Share2,
} from 'lucide-react';
import brandMark from '@/assets/brand-mark.png';
import { Button } from './ui/button';
import { Segmented } from './instrument';
import type { PresetId } from '@/data/scenes';

type Props = {
  preset: PresetId;
  name: string;
  rays: boolean;
  onToggleRays: () => void;
  onHelp: () => void;
  onShare: () => void;
  onExport: () => void;
  onMeasure: () => void;
  onPreset: (id: PresetId) => void;
};

export function SceneTopBar({
  preset,
  name,
  rays,
  onToggleRays,
  onHelp,
  onShare,
  onExport,
  onMeasure,
  onPreset,
}: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-3 md:px-5">
        <Link
          to="/"
          className="flex items-center gap-2.5 pl-0.5 text-ink transition-opacity hover:opacity-70"
        >
          <ArrowLeft className="size-4" />
          <img
            src={brandMark}
            alt=""
            className="size-5 rounded-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          />
          <span className="font-display text-[21px] leading-none italic">
            Lightleak
          </span>
        </Link>

        <span className="hidden h-4 w-px bg-hairline sm:block" />
        <span className="hidden text-[11px] font-medium text-muted sm:block">
          {name}
        </span>

        <div className="ml-3 hidden md:block">
          <Segmented<PresetId>
            value={preset}
            options={[
              { value: 'prism', label: '01 Prism' },
              { value: 'ball', label: '02 Ball' },
            ]}
            onChange={onPreset}
          />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant={rays ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onToggleRays}
            aria-pressed={rays}
            aria-label={rays ? 'Hide rays' : 'Show rays'}
            className="gap-2"
          >
            {rays ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            <span className="hidden sm:inline">Rays</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMeasure}
            aria-label="Measure a ray"
          >
            <Ruler className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onHelp}
            aria-label="Open help"
          >
            <CircleHelp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onShare}
            aria-label="Copy share link"
          >
            <Share2 className="size-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onExport}
            className="ml-1 gap-2 px-3"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
