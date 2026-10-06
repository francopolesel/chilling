import { useCallback, useState } from 'react';
import { randInt } from '../lib/random';
import { ActivityScreen, NeutralButton } from '../components/ActivityScreen';

type VariantKind = 'shape' | 'tilt' | 'fill' | 'size';

interface OddPuzzle {
  kind: VariantKind;
  grid: number;
  oddIndex: number;
  baseColor: string;
  oddColor: string;
  baseShape: 'circle' | 'square' | 'arch';
  tiltBase: number;
  tiltOdd: number;
  filledOdd: boolean;
  sizeOdd: boolean;
  seed: number;
}

const COLORS: Array<[string, string]> = [
  ['#C07856', '#8A9B6E'],
  ['#7E8F62', '#C07856'],
  ['#C99B4a', '#7E8F62'],
  ['#8A7567', '#BD7355'],
];

function makePuzzle(): OddPuzzle {
  const kinds: VariantKind[] = ['shape', 'tilt', 'fill', 'size'];
  const kind = kinds[randInt(0, kinds.length - 1)];
  const grid = 16;
  const oddIndex = randInt(0, grid - 1);
  const [baseColor, oddColor] = COLORS[randInt(0, COLORS.length - 1)];
  const shapes: OddPuzzle['baseShape'][] = ['circle', 'square', 'arch'];
  const baseShape = shapes[randInt(0, 2)];
  return {
    kind,
    grid,
    oddIndex,
    baseColor,
    oddColor: kind === 'fill' ? oddColor : baseColor,
    baseShape,
    tiltBase: [0, 12, -12, 24][randInt(0, 3)],
    tiltOdd: 0,
    filledOdd: kind === 'fill',
    sizeOdd: kind === 'size',
    seed: Math.random(),
  };
}

function CellShape({ p, isOdd, found }: { p: OddPuzzle; isOdd: boolean; found: boolean }) {
  const shape = isOdd && p.kind === 'shape' ? (p.baseShape === 'circle' ? 'square' : 'circle') : p.baseShape;
  const tilt = isOdd && p.kind === 'tilt' ? p.tiltBase + 45 : p.tiltBase;
  const bg = isOdd && p.kind === 'fill' ? p.oddColor : p.baseColor;
  const scale = isOdd && p.kind === 'size' ? 0.68 : 1;
  void p.seed;
  const radius = shape === 'circle' ? '50%' : shape === 'arch' ? '999px 999px 18px 18px' : '28%';
  return (
    <span
      aria-hidden="true"
      className={found && isOdd ? 'soft-pop' : undefined}
      style={{
        display: 'block',
        width: `${Math.round(52 * scale)}%`,
        aspectRatio: '1',
        background: p.kind === 'fill' && !((isOdd && p.filledOdd) || false) ? 'transparent' : bg,
        border: p.kind === 'fill' && !(isOdd && p.filledOdd) ? `3px solid ${bg}` : '3px solid transparent',
        borderRadius: radius,
        transform: `rotate(${tilt}deg)`,
        opacity: isOdd && p.kind === 'fill' && !p.filledOdd ? 1 : 1,
        transition: 'transform 160ms ease',
      }}
    />
  );
}

export function FindDifferentGame({ onBack }: { onBack: () => void }) {
  const [puzzle, setPuzzle] = useState<OddPuzzle>(() => makePuzzle());
  const [found, setFound] = useState(false);
  const [round, setRound] = useState(0);

  const anew = useCallback(() => {
    setPuzzle(makePuzzle());
    setFound(false);
    setRound((r) => r + 1);
  }, []);

  const choose = (i: number) => {
    if (found) return;
    if (i === puzzle.oddIndex) {
      setFound(true);
      window.setTimeout(() => {
        setPuzzle(makePuzzle());
        setFound(false);
        setRound((r) => r + 1);
      }, 650);
    }
  };

  return (
    <ActivityScreen
      title="Find the Different"
      hint="Find the odd one out."
      onBack={onBack}
      controls={<NeutralButton onClick={anew}>New one</NeutralButton>}
    >
      <div key={round} className="fade-up">
        <div
          role="grid"
          aria-label="Grid of shapes, one is different"
          className="no-select mx-auto grid max-w-[460px] grid-cols-4 gap-3"
        >
          {Array.from({ length: puzzle.grid }, (_, i) => {
            const isOdd = i === puzzle.oddIndex;
            const isFound = found && isOdd;
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                aria-label={isOdd ? 'Different item' : `Item ${i + 1}`}
                onClick={() => choose(i)}
                className="tile press flex aspect-square items-center justify-center rounded-[18px] touch-target"
                style={
                  isFound
                    ? { background: 'var(--gold-wash)', border: '2px solid var(--gold)' }
                    : undefined
                }
              >
                <CellShape p={puzzle} isOdd={isOdd} found={isFound} />
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted)' }} aria-live="polite">
          {found ? 'There it is.' : 'Tap the one that looks different.'}
        </p>
      </div>
    </ActivityScreen>
  );
}




