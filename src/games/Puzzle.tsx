import { useMemo, useState } from 'react';
import { randInt, shuffle } from '../lib/random';
import { ActivityScreen, NeutralButton } from '../components/ActivityScreen';

const PALETTES = [
  ['#E9D9BE', '#D9B98F', '#C07856', '#7E8F62', '#3D2C22'],
  ['#F2E2BD', '#D9B166', '#A05A3E', '#63714C', '#EFE4CF'],
  ['#DFE4CF', '#8A9B6E', '#C07856', '#E9D9BE', '#5D4B3E'],
];

function buildTiles(): { order: number[]; palette: string[]; motif: number } {
  const palette = PALETTES[randInt(0, PALETTES.length - 1)];
  const motif = randInt(0, 2);
  const order = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  // ensure scrambled
  if (order.every((v, i) => v === i)) return buildTiles();
  return { order, palette, motif };
}

// Each tile shows the fragment belonging to its tile value (correct content),
// positioned so solved board forms one composition.
function TileArt({ value, palette, motif }: { value: number; palette: string[]; motif: number }) {
  const row = Math.floor(value / 3);
  const col = value % 3;
  // large composition 300% x 300%, offset to show this tile's slice
  return (
    <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-xl">
      <span
        className="absolute"
        style={{
          width: '300%',
          height: '300%',
          left: `${-col * 100}%`,
          top: `${-row * 100}%`,
        }}
      >
        <span className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]} 55%, ${palette[3]} 100%)` }} />
        {/* big circle */}
        <span
          className="absolute"
          style={{
            left: motif === 0 ? '18%' : motif === 1 ? '52%' : '30%',
            top: motif === 0 ? '22%' : '12%',
            width: '46%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: palette[2],
            opacity: 0.92,
          }}
        />
        {/* arch */}
        <span
          className="absolute"
          style={{
            left: '8%',
            bottom: '6%',
            width: '34%',
            height: '44%',
            borderRadius: '999px 999px 18px 18px',
            background: palette[3],
            opacity: 0.9,
          }}
        />
        {/* bar */}
        <span
          className="absolute"
          style={{ left: '46%', bottom: '14%', width: '44%', height: '7%', borderRadius: 999, background: palette[4], opacity: 0.85 }}
        />
        <span
          className="absolute"
          style={{ left: '46%', bottom: '25%', width: '30%', height: '3.5%', borderRadius: 999, background: palette[4], opacity: 0.5 }}
        />
        {/* dots */}
        <span className="absolute" style={{ right: '10%', top: '14%', width: '5%', aspectRatio: '1', borderRadius: 999, background: palette[4] }} />
      </span>
    </span>
  );
}

export function PuzzleGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(() => buildTiles());
  const [first, setFirst] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  const solved = useMemo(() => board.order.every((v, i) => v === i), [board.order]);

  const tap = (pos: number) => {
    if (solved) return;
    if (first === null) {
      setFirst(pos);
    } else if (first === pos) {
      setFirst(null);
    } else {
      const next = [...board.order];
      [next[first], next[pos]] = [next[pos], next[first]];
      setBoard((b) => ({ ...b, order: next }));
      setFirst(null);
      setMoves((m) => m + 1);
      if (next.every((v, i) => v === i)) {
        window.setTimeout(() => {
          setBoard(buildTiles());
          setMoves(0);
        }, 900);
      }
    }
  };

  const anew = () => {
    setBoard(buildTiles());
    setFirst(null);
    setMoves(0);
  };

  void moves;

  return (
    <ActivityScreen
      title="Puzzle"
      hint="Tap two pieces to swap them."
      onBack={onBack}
      controls={<NeutralButton onClick={anew}>New one</NeutralButton>}
    >
      <div
        role="grid"
        aria-label="Picture puzzle, tap two pieces to swap"
        className="no-select mx-auto grid max-w-[440px] grid-cols-3 gap-2.5"
      >
        {board.order.map((value, pos) => (
          <button
            key={`${value}-${pos}-${board.motif}`}
            type="button"
            role="gridcell"
            aria-label={`Puzzle piece ${pos + 1}${first === pos ? ', selected' : ''}`}
            aria-pressed={first === pos}
            onClick={() => tap(pos)}
            className="press relative aspect-square touch-target"
            style={{
              borderRadius: 18,
              border: first === pos ? '3px solid var(--gold)' : solved ? '2.5px solid var(--sage)' : '1px solid var(--line)',
              overflow: 'hidden',
              background: 'var(--surface-warm)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <TileArt value={value} palette={board.palette} motif={board.motif} />
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted)' }} aria-live="polite">
        {solved ? 'That fits.' : first !== null ? 'Now tap another piece.' : 'Put the picture back together.'}
      </p>
    </ActivityScreen>
  );
}




