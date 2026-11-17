import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Link2, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './toast';
import type { PresetId } from '@/data/scenes';

function presetFromLink(value: string): PresetId | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed, window.location.href);
    const hash = url.hash.replace(/^#/, '');
    const [path, query = ''] = hash.split('?');
    if (path !== '/scene') return null;

    const preset = new URLSearchParams(query).get('preset');
    return preset === 'prism' || preset === 'ball' || preset === 'blank'
      ? preset
      : null;
  } catch {
    return null;
  }
}

export function ImportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setValue('');
    setError('');
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const preset = presetFromLink(value);

    if (!preset) {
      setError(
        'That link does not point to a scene. Paste a Lightleak scene URL.',
      );
      return;
    }

    onClose();
    navigate(`/scene?preset=${preset}`);
    toast('Scene imported.');
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
        aria-labelledby="import-title"
        onClick={(event) => event.stopPropagation()}
        className="animate-fade-in w-[min(520px,100%)] rounded-[12px] border border-hairline bg-surface p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8px] tracking-[0.14em] text-muted uppercase">
              Import / scene
            </p>
            <h2
              id="import-title"
              className="mt-1 font-display text-[26px] leading-none"
            >
              Import a scene.
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close import dialog"
          >
            <X className="size-4" />
          </Button>
        </div>

        <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-muted">
          Paste a Lightleak scene link. The scene is carried in the URL.
        </p>

        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="scene-link"
            className="font-mono text-[9px] tracking-[0.14em] text-muted uppercase"
          >
            Scene link
          </label>
          <div className="relative mt-2">
            <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              id="scene-link"
              autoFocus
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError('');
              }}
              placeholder="https://…/#/scene?preset=prism"
              className="h-10 w-full rounded-[8px] border border-hairline bg-paper pr-3 pl-9 font-mono text-[11px] text-ink placeholder:text-muted/50 focus-visible:border-ink/40 focus-visible:outline-none"
            />
          </div>

          {error && (
            <p className="mt-2 text-[10px] leading-relaxed text-signal">
              {error}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Load scene
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
