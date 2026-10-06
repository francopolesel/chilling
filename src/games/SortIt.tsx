import { useMemo, useRef, useState } from 'react';
import { randInt, shuffle } from '../lib/random';
import { ActivityScreen, NeutralButton } from '../components/ActivityScreen';

type Mode = 'color' | 'shape';

interface Item {
  id: string;
  color: string;
  colorName: string;
  shape: 'circle' | 'square' | 'triangle';
}

const PALETTE = [
  { name: 'Terracotta', value: '#C07856' },
  { name: 'Sage', value: '#7E8F62' },
  { name: 'Gold', value: '#C99B4A' },
];

const SHAPES: Item['shape'][] = ['circle', 'square', 'triangle'];

function makeItems(mode: Mode): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < 9; i++) {
    const color = PALETTE[i % 3];
    const shape = SHAPES[Math.floor(i / 3) % 3 === 0 ? i % 3 : randInt(0, 2)];
    // ensure each bin gets 3 items matching its key
    const key = i % 3;
    items.push({
      id: `it-${i}-${Math.random().toString(36).slice(2, 6)}`,
      color: mode === 'color' ? PALETTE[key].value : color.value,
      colorName: mode === 'color' ? PALETTE[key].name : color.name,
      shape: mode === 'shape' ? (SHAPES[key] as Item['shape']) : shape,
    });
  }
  return shuffle(items);
}

function ShapeGlyph({ shape, color }: { shape: Item['shape']; color: string }) {
  if (shape === 'circle')
    return <span aria-hidden="true" style={{ display: 'block', width: 30, height: 30, borderRadius: '50%', background: color }} />;
  if (shape === 'square')
    return <span aria-hidden="true" style={{ display: 'block', width: 28, height: 28, borderRadius: 9, background: color }} />;
  return (
    <span
      aria-hidden="true"
      style={{ width: 0, height: 0, borderLeft: '17px solid transparent', borderRight: '17px solid transparent', borderBottom: `28px solid ${color}` }}
    />
  );
}

export function SortItGame({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>(() => (Math.random() < 0.5 ? 'color' : 'shape'));
  const [items, setItems] = useState<Item[]>(() => makeItems(mode));
  const [placed, setPlaced] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const binRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragPos = useRef<{ x: number; y: number } | null>(null);
  const [, force] = useState(0);

  const bins = useMemo(() => {
    if (mode === 'color') return PALETTE.map((c, i) => ({ key: i, label: c.name, color: c.value as string | undefined, shape: undefined as Item['shape'] | undefined }));
    return SHAPES.map((s, i) => ({ key: i, label: s[0].toUpperCase() + s.slice(1), color: undefined as string | undefined, shape: s as Item['shape'] }));
  }, [mode]);

  const binOf = (it: Item): number => {
    if (mode === 'color') return PALETTE.findIndex((c) => c.value === it.color);
    return SHAPES.findIndex((s) => s === it.shape);
  };

  const remaining = items.filter((it) => !(it.id in placed));

  const place = (itemId: string, bin: number) => {
    const it = items.find((x) => x.id === itemId);
    if (!it || it.id in placed) return;
    if (binOf(it) === bin) {
      const next = { ...placed, [itemId]: bin };
      setPlaced(next);
      setSelected(null);
      if (Object.keys(next).length === items.length) {
        setDone(true);
        window.setTimeout(() => {
          const nm: Mode = Math.random() < 0.5 ? 'color' : 'shape';
          setMode(nm);
          setItems(makeItems(nm));
          setPlaced({});
          setSelected(null);
          setDone(false);
        }, 900);
      }
    } else {
      // gentle nudge: keep selected but do not punish
      setSelected(itemId);
    }
  };

  const restart = () => {
    const nm: Mode = mode === 'color' ? 'shape' : 'color';
    setMode(nm);
    setItems(makeItems(nm));
    setPlaced({});
    setSelected(null);
    setDone(false);
  };

  // pointer drag: track position for floating preview + hit test on release
  const onItemPointerDown = (e: React.PointerEvent, id: string) => {
    if (id in placed) return;
    setDragId(id);
    dragPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onItemPointerMove = (e: React.PointerEvent) => {
    if (!dragId) return;
    dragPos.current = { x: e.clientX, y: e.clientY };
    force((n) => n + 1);
  };
  const onItemPointerUp = (e: React.PointerEvent, id: string) => {
    if (!dragId) return;
    const p = { x: e.clientX, y: e.clientY };
    let hit = -1;
    binRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom) hit = i;
    });
    setDragId(null);
    dragPos.current = null;
    if (hit >= 0) place(id, hit);
    else setSelected(id);
  };

  return (
    <ActivityScreen
      title="Sort It"
      hint={mode === 'color' ? 'Put each piece with its color.' : 'Put each piece with its shape.'}
      onBack={onBack}
      controls={
        <>
          <NeutralButton onClick={restart}>Shuffle</NeutralButton>
          {selected && (
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              Now tap a tray below.
            </span>
          )}
        </>
      }
    >
      {/* tray */}
      <div aria-label="Pieces to sort" className="surface-warm no-select mx-auto flex max-w-[500px] flex-wrap items-center justify-center gap-3 rounded-[20px] p-4" style={{ borderStyle: 'dashed' }}>
        {remaining.length === 0 && (
          <p className="py-6 text-sm" style={{ color: 'var(--muted)' }}>
            {done ? 'All sorted.' : 'Tray is empty.'}
          </p>
        )}
        {remaining.map((it) => (
          <button
            key={it.id}
            type="button"
            aria-label={`${it.colorName} ${it.shape}${selected === it.id ? ', selected' : ''}`}
            aria-pressed={selected === it.id}
            onClick={() => setSelected(selected === it.id ? null : it.id)}
            onPointerDown={(e) => onItemPointerDown(e, it.id)}
            onPointerMove={onItemPointerMove}
            onPointerUp={(e) => onItemPointerUp(e, it.id)}
            className="sort-dragging tile flex h-[64px] w-[64px] items-center justify-center rounded-[18px] touch-target"
            style={
              selected === it.id
                ? { border: '2.5px solid var(--gold)', background: 'var(--gold-wash)', boxShadow: 'var(--shadow)', cursor: 'grab' }
                : { opacity: dragId === it.id ? 0.55 : 1, cursor: 'grab' }
            }
          >
            <ShapeGlyph shape={it.shape} color={it.color} />
          </button>
        ))}
      </div>

      {/* bins */}
      <div className="mx-auto mt-4 grid max-w-[500px] grid-cols-3 gap-3">
        {bins.map((b, i) => {
          const count = Object.entries(placed).filter(([, bin]) => bin === i).length;
          const inside = items.filter((it) => placed[it.id] === i);
          return (
            <div
              key={b.label}
              ref={(el) => {
                binRefs.current[i] = el;
              }}
              role="button"
              tabIndex={0}
              aria-label={`${b.label} tray, ${count} pieces`}
              onClick={() => selected && place(selected, i)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && selected) {
                  e.preventDefault();
                  place(selected, i);
                }
              }}
              className="flex min-h-[148px] flex-col items-center gap-2 rounded-[20px] p-3.5"
              style={{ background: 'var(--surface-warm)', border: '2px solid var(--line)' }}
            >
              <span className="text-[13px] font-semibold" style={{ color: 'var(--ink-2)' }}>
                {b.label}
              </span>
              {b.color ? (
                <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: 999, background: b.color, border: '1px solid var(--line)' }} />
              ) : (
                b.shape && <ShapeGlyph shape={b.shape} color="#8A7567" />
              )}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {inside.map((it) => (
                  <span key={it.id} className={done ? 'soft-pop' : undefined} style={{ transform: 'scale(0.72)', margin: -4 }}>
                    <ShapeGlyph shape={it.shape} color={it.color} />
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm" style={{ color: 'var(--muted)' }} aria-live="polite">
        {done ? 'All sorted.' : 'Tap a piece, then tap its tray. Or drag it.'}
      </p>
    </ActivityScreen>
  );
}




