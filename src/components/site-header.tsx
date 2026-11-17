import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import brandMark from '@/assets/brand-mark.png';
import { Button } from './ui/button';

export function HomeHeader({ onImport }: { onImport: () => void }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={brandMark}
            alt=""
            className="size-7 rounded-[7px] shadow-[0_1px_2px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
          />
          <span className="font-display text-[26px] leading-none italic">
            Lightleak
          </span>
          <span className="font-mono text-[8px] tracking-[0.18em] text-muted uppercase">
            Lab 01
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <button
            type="button"
            onClick={onImport}
            className="hidden px-3 py-2 text-[11px] font-medium tracking-[0.08em] text-muted uppercase transition-colors hover:text-ink sm:block"
          >
            Import
          </button>
          <Button
            asChild
            size="sm"
            className="h-8 px-3.5 text-[11px] tracking-[0.06em] uppercase"
          >
            <Link to="/scene?preset=blank">
              New scene
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
