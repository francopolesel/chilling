import { useMemo, useState } from 'react';
import { Apple, CakeSlice, Cherry, Coffee, Cookie, Croissant, CupSoda, Leaf, Moon, Music, Star, Sun } from 'lucide-react';
import { shuffle } from '../lib/random';
import { ActivityScreen, NeutralButton } from '../components/ActivityScreen';

const ICONS = [Coffee, Cookie, Apple, Cherry, Leaf, Sun, Moon, Star, Music, CakeSlice, Croissant, CupSoda];

interface Card {
  uid: string;
  icon: number;
}

function buildDeck(pairs: number): Card[] {
  const picked = shuffle(ICONS.map((_, i) => i)).slice(0, pairs);
  const deck: Card[] = [];
  picked.forEach((icon) => {
    deck.push({ uid: `${icon}-a-${Math.random().toString(36).slice(2, 6)}`, icon });
    deck.push({ uid: `${icon}-b-${Math.random().toString(36).slice(2, 6)}`, icon });
  });
  return shuffle(deck);
}

export function MemoryGame({
  onBack,
  simple = false,
}: {
  onBack: () => void;
  simple?: boolean;
}) {
  const pairs = simple ? 3 : 6;
  const [deck, setDeck] = useState<Card[]>(() => buildDeck(pairs));
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [lock, setLock] = useState(false);

  const done = matched.size === deck.length && deck.length > 0;

  const byUid = useMemo(() => {
    const m = new Map(deck.map((c) => [c.uid, c] as const));
    return m;
  }, [deck]);

  const flip = (uid: string) => {
    if (lock || matched.has(uid) || open.includes(uid)) return;
    if (open.length === 0) {
      setOpen([uid]);
    } else if (open.length === 1) {
      const first = open[0];
      setOpen([first, uid]);
      const a = byUid.get(first);
      const b = byUid.get(uid);
      if (a && b && a.icon === b.icon) {
        window.setTimeout(() => {
          setMatched((prev) => {
            const n = new Set(prev);
            n.add(first);
            n.add(uid);
            return n;
          });
          setOpen([]);
        }, 320);
      } else {
        setLock(true);
        window.setTimeout(() => {
          setOpen([]);
          setLock(false);
        }, 650);
      }
    }
  };

  const anew = () => {
    setDeck(buildDeck(pairs));
    setOpen([]);
    setMatched(new Set());
    setLock(false);
  };

  return (
    <ActivityScreen
      title="Memory"
      hint="Flip. Match. Repeat."
      onBack={onBack}
      controls={<NeutralButton onClick={anew}>New one</NeutralButton>}
    >
      <div
        role="grid"
        aria-label="Memory cards"
        className={`no-select mx-auto grid gap-3 ${simple ? 'max-w-[360px] grid-cols-3' : 'max-w-[460px] grid-cols-3 sm:grid-cols-4'}`}
      >
        {deck.map((c) => {
          const Icon = ICONS[c.icon];
          const faceUp = open.includes(c.uid) || matched.has(c.uid);
          const isMatched = matched.has(c.uid);
          return (
            <button
              key={c.uid}
              type="button"
              role="gridcell"
              aria-label={faceUp ? 'Card showing symbol' : 'Face-down card'}
              aria-pressed={faceUp}
              onClick={() => flip(c.uid)}
              className="touch-target aspect-[3/3.4]"
              style={{ perspective: 600 }}
            >
              <span className={`flip-inner relative block h-full w-full ${faceUp ? 'flipped' : ''}`}>
                <span
                  className="flip-face absolute inset-0 flex items-center justify-center"
                  style={{
                    background: 'var(--ink)',
                    borderRadius: 18,
                    border: '1px solid var(--ink-hover)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      border: '2px solid rgba(250,243,227,.5)',
                      background: 'radial-gradient(circle at 50% 50%, var(--terra) 0 3px, transparent 3.5px)',
                    }}
                  />
                </span>
                <span
                  className="flip-face flip-back absolute inset-0 flex items-center justify-center"
                  style={{
                    background: isMatched ? 'var(--sage-wash)' : 'var(--surface-warm)',
                    borderRadius: 18,
                    border: isMatched ? '2px solid var(--sage)' : '1px solid var(--line)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  aria-hidden="true"
                >
                  <Icon size={28} strokeWidth={1.9} style={{ color: isMatched ? 'var(--sage-deep)' : 'var(--ink-2)' }} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted)' }} aria-live="polite">
        {done ? 'All matched.' : 'Tap two cards to turn them over.'}
      </p>
    </ActivityScreen>
  );
}




