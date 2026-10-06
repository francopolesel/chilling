import type { LucideIcon } from 'lucide-react';

export interface ActivityMeta {
  id: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  wash: string;
}

function Motif({ id }: { id: string }) {
  switch (id) {
    case 'find-different':
      return (
        <span className="flex items-center justify-center gap-2" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--terra)', opacity: 0.85 }} />
          ))}
          <span style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--sage)', transform: 'rotate(12deg)' }} />
        </span>
      );
    case 'sort-it':
      return (
        <span className="flex items-end justify-center gap-3" aria-hidden="true">
          <span className="flex flex-col items-center gap-1.5">
            <span style={{ width: 20, height: 20, borderRadius: 999, background: 'var(--terra)' }} />
            <span style={{ width: 34, height: 7, borderRadius: 999, background: 'var(--ink)', opacity: 0.28 }} />
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <span style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--sage)' }} />
            <span style={{ width: 34, height: 7, borderRadius: 999, background: 'var(--ink)', opacity: 0.28 }} />
          </span>
          <span className="flex flex-col items-center gap-1.5">
            <span
              style={{
                width: 0,
                height: 0,
                borderLeft: '11px solid transparent',
                borderRight: '11px solid transparent',
                borderBottom: '19px solid var(--gold)',
              }}
            />
            <span style={{ width: 34, height: 7, borderRadius: 999, background: 'var(--ink)', opacity: 0.28 }} />
          </span>
        </span>
      );
    case 'memory':
      return (
        <span className="grid grid-cols-3 gap-1.5" aria-hidden="true" style={{ width: 76 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              style={{
                height: 22,
                borderRadius: 6,
                background: i === 4 ? 'var(--sage)' : 'var(--terra)',
                opacity: i === 4 ? 1 : 0.8,
                border: '1px solid rgba(50,38,32,.18)',
              }}
            />
          ))}
        </span>
      );
    case 'find-x':
      return (
        <span className="grid grid-cols-4 gap-1.5" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 999,
                border: '2.5px solid var(--ink)',
                opacity: 0.42,
                background: i === 5 ? 'var(--terra)' : 'transparent',
                borderColor: i === 5 ? 'var(--terra)' : undefined,
              }}
            />
          ))}
        </span>
      );
    case 'color-lab':
      return (
        <span className="flex items-center justify-center gap-1.5" aria-hidden="true">
          {['#b26a4b', '#75855a', '#a97f35', '#7a8ba3', '#8e5238'].map((c) => (
            <span key={c} style={{ width: 22, height: 34, borderRadius: 8, background: c, border: '1px solid rgba(50,38,32,.16)' }} />
          ))}
        </span>
      );
    case 'doodle':
      return (
        <svg width="88" height="40" viewBox="0 0 88 40" fill="none" aria-hidden="true">
          <path
            d="M4 30 C 18 30, 20 8, 32 12 S 44 34, 54 24 S 66 6, 84 14"
            stroke="var(--terra)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="84" cy="14" r="3.5" fill="var(--sage)" />
        </svg>
      );
    case 'puzzle':
      return (
        <span className="grid grid-cols-2 gap-1.5" aria-hidden="true" style={{ width: 64 }}>
          <span style={{ height: 26, borderRadius: '10px 4px 4px 4px', background: 'var(--terra)', opacity: 0.9 }} />
          <span style={{ height: 26, borderRadius: '4px 10px 4px 4px', background: 'var(--gold)', opacity: 0.85 }} />
          <span style={{ height: 26, borderRadius: '4px 4px 4px 10px', background: 'var(--sage)', opacity: 0.9 }} />
          <span style={{ height: 26, borderRadius: '4px 4px 10px 4px', background: 'var(--terra)', opacity: 0.55 }} />
        </span>
      );
    case 'trivia':
      return (
        <span className="flex w-full flex-col gap-2 px-6" aria-hidden="true">
          <span style={{ height: 9, width: '72%', borderRadius: 999, background: 'var(--ink)', opacity: 0.55 }} />
          <span className="flex gap-2">
            <span style={{ height: 20, flex: 1, borderRadius: 7, background: 'var(--sage-soft)', border: '1px solid var(--sage)' }} />
            <span style={{ height: 20, flex: 1, borderRadius: 7, background: 'rgba(50,38,32,.08)' }} />
          </span>
        </span>
      );
    default:
      return null;
  }
}

export function ActivityCard({ meta, onOpen }: { meta: ActivityMeta; onOpen: (id: string) => void }) {
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen(meta.id)}
      aria-label={`Open ${meta.title}`}
      className="press surface group flex h-full w-full flex-col rounded-[22px] p-3.5 text-left"
    >
      <span
        className="flex h-[92px] w-full items-center justify-center overflow-hidden rounded-2xl"
        style={{ background: meta.wash, border: '1px solid var(--line-soft)' }}
        aria-hidden="true"
      >
        <Motif id={meta.id} />
      </span>
      <span className="flex items-start gap-2.5 px-1.5 pb-1.5 pt-3">
        <span
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
          style={{ background: 'var(--surface-warm)', border: '1px solid var(--line)', color: 'var(--ink-2)' }}
          aria-hidden="true"
        >
          <Icon size={17} strokeWidth={2} />
        </span>
        <span className="block min-w-0">
          <span className="block text-[15.5px] font-bold leading-tight" style={{ color: 'var(--ink)' }}>
            {meta.title}
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug" style={{ color: 'var(--muted)' }}>
            {meta.blurb}
          </span>
        </span>
      </span>
    </button>
  );
}
