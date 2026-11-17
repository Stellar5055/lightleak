import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import brandMark from '@/assets/brand-mark.png';
import { ImportDialog } from '@/components/import-dialog';
import { HomeHeader } from '@/components/site-header';
import { Hero } from '@/components/ui/hero';

function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={brandMark}
              alt=""
              className="size-7 rounded-[7px] shadow-[0_1px_2px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
            />
            <p className="font-display text-[24px] leading-none italic">
              Lightleak
            </p>
          </div>
          <p className="mt-2 text-[12px] text-muted">
            A virtual optical bench. Built for the web, no install.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-[10px] tracking-[0.08em] text-muted uppercase md:items-end">
          <span>Open source · MIT</span>
          <span>Built for Hack Club Crossroads</span>
          <span className="font-mono text-[9px] tracking-[0.12em] text-muted/70">
            LL-01 / REV 1.1
          </span>
        </div>
      </div>
    </footer>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <HomeHeader onImport={() => setImportOpen(true)} />
      <Hero
        eyebrow="A virtual optical laboratory"
        title={
          <>
            See what{' '}
            <em className="font-display font-normal tracking-[-0.02em] italic">
              light
            </em>{' '}
            does.
          </>
        }
        subtitle="A virtual optical bench. Place glass, aim a beam, and watch every ray bend, split and focus."
        primaryLabel="Create new scene"
        onPrimary={() => navigate('/scene?preset=blank')}
        secondaryLabel="Import a scene"
        onSecondary={() => setImportOpen(true)}
      />
      <Footer />
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
