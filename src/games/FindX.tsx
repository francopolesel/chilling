import { useState } from 'react';
import { Apple, Bell, Bird, Bug, Cake, Camera, Cat, Cherry, Citrus, Clover, Coffee, Cookie, Croissant, Dog, Donut, Egg, Fish, Flower2, Gift, Grape, IceCreamCone, Leaf, Moon, Music, Pizza, Star, Sun, TreePine } from 'lucide-react';
import { randInt, shuffle } from '../lib/random';
import { ActivityScreen, NeutralButton } from '../components/ActivityScreen';

const POOL = [Apple, Cherry, Cookie, Coffee, Leaf, Sun, Moon, Star, Music, Cat, Dog, Fish, Bird, Bug, Flower2, TreePine, Clover, Citrus, Grape, Pizza, Cake, Donut, Croissant, IceCreamCone, Egg, Gift, Camera, Bell];

interface Cell {
  id: string;
  icon: number;
  isTarget: boolean;
  found: boolean;
}

function buildRound(): { cells: Cell[]; target: number } {
  const target = randInt(0, POOL.length - 1);
  let decoys = shuffle(POOL.map((_, i) => i).filter((i) => i !== target)).slice(0, 5);
  if (decoys.length < 3) decoys = [0, 1, 2].filter((i) => i !== target);
  const total = 24;
  const targetCount = randInt(3, 5);
  const cells: Cell[] = [];
  for (let i = 0; i < total; i++) {
    const isTarget = i < targetCount;
    cells.push({
      id: `c-${i}-${Math.random().toString(36).slice(2, 6)}`,
      icon: isTarget ? target : decoys[i % decoys.length],
      isTarget,
      found: false,
    });
  }
  return { cells: shuffle(cells), target };
}

export function FindXGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(() => buildRound());
  const [key, setKey] = useState(0);

  const foundCount = round.cells.filter((c) => c.isTarget && c.found).length;
  const totalTargets = round.cells.filter((c) => c.isTarget).length;
  const complete = foundCount === totalTargets;

  const tap = (id: string) => {
    if (complete) return;
    setRound((r) => {
      const cells = r.cells.map((c) => (c.id === id && c.isTarget ? { ...c, found: true } : c));
      const fc = cells.filter((c) => c.isTarget && c.found).length;
      const tt = cells.filter((c) => c.isTarget).length;
      if (fc === tt) {
        window.setTimeout(() => {
          setRound(buildRound());
          setKey((k) => k + 1);
        }, 700);
      }
      return { ...r, cells };
    });
  };

  const anew = () => {
    setRound(buildRound());
    setKey((k) => k + 1);
  };

  const TargetIcon = POOL[round.target];

  return (
    <ActivityScreen
      title="Find X"
      hint={`Find all ${totalTargets} of these.`}
      onBack={onBack}
      controls={<NeutralButton onClick={anew}>New one</NeutralButton>}
    >
      <div key={key} className="fade-up">
        <div className="surface-warm mx-auto flex w-fit items-center gap-3.5 rounded-[20px] px-6 py-3.5">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'var(--gold-wash)', border: '1px solid var(--line)' }}
          >
            <TargetIcon size={28} strokeWidth={2} style={{ color: 'var(--ink)' }} aria-hidden="true" />
          </span>
          <span className="text-[15px] font-bold" style={{ color: 'var(--ink-2)' }} aria-live="polite">
            {totalTargets - foundCount} left
          </span>
        </div>
        <div role="grid" aria-label="Find the target symbols" className="no-select mx-auto mt-5 grid max-w-[460px] grid-cols-4 gap-2.5 sm:grid-cols-6 sm:gap-3">
          {round.cells.map((c) => {
            const Icon = POOL[c.icon];
            const dimmed = c.isTarget && c.found;
            return (
              <button
                key={c.id}
                type="button"
                role="gridcell"
                aria-label={dimmed ? 'Found item' : 'Item'}
                onClick={() => tap(c.id)}
                disabled={dimmed}
                className={`tile press flex aspect-square items-center justify-center rounded-[18px] touch-target ${dimmed ? 'soft-pop' : ''}`}
                style={
                  dimmed
                    ? { background: 'var(--sage-wash)', border: '2px solid var(--sage)', opacity: 0.9 }
                    : undefined
                }
              >
                <Icon size={27} strokeWidth={1.9} style={{ color: dimmed ? 'var(--sage-deep)' : 'var(--ink-2)' }} aria-hidden="true" />
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted)' }} aria-live="polite">
          {complete ? 'All found.' : 'Tap each matching one.'}
        </p>
      </div>
    </ActivityScreen>
  );
}




