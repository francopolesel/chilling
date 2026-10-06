import { useEffect, useRef, useState } from 'react';
import { Eraser, PenLine, Redo2, Trash2, Undo2 } from 'lucide-react';
import { ActivityScreen } from '../components/ActivityScreen';

interface Stroke {
  color: string;
  size: number;
  eraser: boolean;
  points: Array<{ x: number; y: number }>;
}

const PEN_COLORS = ['#3D2C22', '#A05A3E', '#63714C', '#C99B4A', '#7A8BA3', '#B0564A'];
const SIZES = [3, 6, 12];

export function DoodleGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const redoRef = useRef<Stroke[]>([]);
  const currentRef = useRef<Stroke | null>(null);
  const activeTouchRef = useRef<number | null>(null);
  const [color, setColor] = useState(PEN_COLORS[0]);
  const [size, setSize] = useState(6);
  const [eraser, setEraser] = useState(false);
  const [, bump] = useState(0);
  // mirror of the active tool for native touch handlers (no stale closures)
  const toolRef = useRef({ color: PEN_COLORS[0], size: 6, eraser: false });
  toolRef.current = { color, size, eraser };

  const drawAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FFFDF6';
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const render = (s: Stroke) => {
      if (s.points.length === 0) return;
      // eraser paints paper color over previous strokes
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = s.eraser ? '#FFFDF6' : s.color;
      ctx.lineWidth = s.eraser ? s.size * 2.2 : s.size;
      ctx.beginPath();
      if (s.points.length === 1) {
        const p = s.points[0];
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 0.1, p.y + 0.1);
      } else {
        ctx.moveTo(s.points[0].x, s.points[0].y);
        for (let i = 1; i < s.points.length; i++) {
          const mid = { x: (s.points[i - 1].x + s.points[i].x) / 2, y: (s.points[i - 1].y + s.points[i].y) / 2 };
          ctx.quadraticCurveTo(s.points[i - 1].x, s.points[i - 1].y, mid.x, mid.y);
        }
        const last = s.points[s.points.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    };
    strokesRef.current.forEach(render);
    if (currentRef.current) render(currentRef.current);
  };

  useEffect(() => {
    drawAll();
    const onResize = () => drawAll();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginStroke = (x: number, y: number) => {
    const t = toolRef.current;
    currentRef.current = { color: t.color, size: t.size, eraser: t.eraser, points: [{ x, y }] };
    drawAll();
  };
  const extendStroke = (x: number, y: number) => {
    if (!currentRef.current) return;
    currentRef.current.points.push({ x, y });
    drawAll();
  };
  const endStroke = () => {
    if (!currentRef.current) return;
    strokesRef.current.push(currentRef.current);
    currentRef.current = null;
    redoRef.current = [];
    bump((n) => n + 1);
    drawAll();
  };

  // Native non-passive touch handlers: the reliable path on iOS Safari,
  // where pointermove streams can be interrupted (pointercancel) and
  // React's root listeners can't preventDefault scrolling.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const point = (t: Touch) => {
      const r = canvas.getBoundingClientRect();
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (activeTouchRef.current !== null) return;
      const t = e.changedTouches[0];
      activeTouchRef.current = t.identifier;
      const p = point(t);
      beginStroke(p.x, p.y);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (activeTouchRef.current === null) return;
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === activeTouchRef.current) {
          const p = point(t);
          extendStroke(p.x, p.y);
        }
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === activeTouchRef.current) {
          activeTouchRef.current = null;
          endStroke();
        }
      }
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const isTouchPointer = (e: React.PointerEvent) => e.pointerType === 'touch';

  const down = (e: React.PointerEvent) => {
    // touch input is handled by the native touch handlers above
    if (isTouchPointer(e)) return;
    e.preventDefault();
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      /* pointer capture unavailable — drawing still works */
    }
    const p = pos(e);
    beginStroke(p.x, p.y);
  };
  const move = (e: React.PointerEvent) => {
    if (isTouchPointer(e) || !currentRef.current) return;
    e.preventDefault();
    const p = pos(e);
    extendStroke(p.x, p.y);
  };
  const up = (e?: React.PointerEvent) => {
    // for mouse/pen, committing on leave keeps strokes tidy;
    // touch pointers must NOT commit on leave (breaks iOS strokes)
    if (e && isTouchPointer(e) && e.type === 'pointerleave') return;
    endStroke();
  };

  const undo = () => {
    const s = strokesRef.current.pop();
    if (s) redoRef.current.push(s);
    bump((n) => n + 1);
    drawAll();
  };
  const redo = () => {
    const s = redoRef.current.pop();
    if (s) strokesRef.current.push(s);
    bump((n) => n + 1);
    drawAll();
  };
  const clear = () => {
    strokesRef.current = [];
    redoRef.current = [];
    currentRef.current = null;
    bump((n) => n + 1);
    drawAll();
  };

  const canUndo = strokesRef.current.length > 0;
  const canRedo = redoRef.current.length > 0;

  return (
    <ActivityScreen
      title="Doodle"
      hint="A blank page. Draw anything."
      onBack={onBack}
      controls={
        <>
          <SmallBtn onClick={undo} disabled={!canUndo} label="Undo last stroke" icon={<Undo2 size={17} />} text="Undo" />
          <SmallBtn onClick={redo} disabled={!canRedo} label="Redo stroke" icon={<Redo2 size={17} />} text="Redo" />
          <SmallBtn onClick={clear} disabled={!canUndo} label="Clear page" icon={<Trash2 size={17} />} text="Clear" />
        </>
      }
    >
      <div ref={wrapRef}>
        <div
          className="overflow-hidden"
          style={{
            border: '1px solid var(--line)',
            borderRadius: 22,
            boxShadow: 'var(--shadow)',
            background: '#FFFDF6',
            touchAction: 'none',
            overscrollBehavior: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            className="doodle block h-[340px] w-full cursor-crosshair sm:h-[420px]"
            aria-label="Drawing page"
            role="img"
            style={{ touchAction: 'none', WebkitTouchCallout: 'none' }}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
          />
        </div>
        <div className="surface-warm mt-4 rounded-[20px] p-3.5">
          <p className="px-1 text-[12px] font-bold uppercase" style={{ color: 'var(--faint)', letterSpacing: '0.14em' }}>
            Colors
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {PEN_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setEraser(false);
                }}
                aria-label={`Pen color ${c}`}
                aria-pressed={!eraser && color === c}
                className="touch-target h-12 w-12 rounded-full"
                style={{
                  background: c,
                  border: !eraser && color === c ? '3px solid var(--ink)' : '2px solid rgba(50,38,32,.2)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              />
            ))}
            <button
              type="button"
              onClick={() => setEraser((v) => !v)}
              aria-pressed={eraser}
              aria-label="Eraser"
              className="press touch-target inline-flex h-12 items-center gap-2 px-4 text-sm font-bold"
              style={{
                background: eraser ? 'var(--gold-wash)' : 'var(--surface)',
                border: eraser ? '2px solid var(--gold)' : '1px solid var(--line)',
                borderRadius: 999,
                color: 'var(--ink)',
              }}
            >
              {eraser ? <PenLine size={16} /> : <Eraser size={16} />} {eraser ? 'Pen' : 'Eraser'}
            </button>
          </div>
          <p className="mt-4 px-1 text-[12px] font-bold uppercase" style={{ color: 'var(--faint)', letterSpacing: '0.14em' }}>
            Brush size
          </p>
          <div className="mt-2 flex items-center gap-2" role="group" aria-label="Pen size">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-label={`Pen size ${s}`}
                aria-pressed={size === s}
                className="press touch-target flex h-12 flex-1 items-center justify-center"
                style={{
                  background: size === s ? 'var(--sage-wash)' : 'var(--surface)',
                  border: size === s ? '2px solid var(--sage)' : '1px solid var(--line)',
                  borderRadius: 14,
                }}
              >
                <span aria-hidden="true" style={{ width: s * 1.7, height: s * 1.7, borderRadius: 999, background: 'var(--ink)' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </ActivityScreen>
  );
}

function SmallBtn({ onClick, disabled, label, icon, text }: { onClick: () => void; disabled?: boolean; label: string; icon: React.ReactNode; text: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="btn btn-soft"
    >
      {icon} {text}
    </button>
  );
}




