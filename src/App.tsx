import { useCallback, useState } from 'react';
import {
  Shapes,
  ArrowDownUp,
  LayoutGrid,
  Search,
  Palette,
  PencilLine,
  Puzzle as PuzzleIcon,
  ListChecks,
  Zap,
  ArrowRight,
  Shuffle,
} from 'lucide-react';
import { AppShell } from './components/AppShell';
import { ActivityCard, type ActivityMeta } from './components/ActivityCard';
import { FindDifferentGame } from './games/FindDifferent';
import { SortItGame } from './games/SortIt';
import { MemoryGame } from './games/Memory';
import { FindXGame } from './games/FindX';
import { ColorLabGame } from './games/ColorLab';
import { DoodleGame } from './games/Doodle';
import { PuzzleGame } from './games/Puzzle';
import { TriviaGame } from './games/Trivia';
import { randomPanicActivity } from './lib/random';

const ACTIVITIES: ActivityMeta[] = [
  { id: 'find-different', title: 'Find the Different', blurb: 'Find the odd one out.', icon: Shapes, wash: 'var(--terra-wash)' },
  { id: 'sort-it', title: 'Sort It', blurb: 'Put each piece where it fits.', icon: ArrowDownUp, wash: 'var(--sage-wash)' },
  { id: 'memory', title: 'Memory', blurb: 'Flip. Match. Repeat.', icon: LayoutGrid, wash: 'var(--gold-wash)' },
  { id: 'find-x', title: 'Find X', blurb: 'Tap every matching one.', icon: Search, wash: 'var(--surface-deep)' },
  { id: 'color-lab', title: 'Color Lab', blurb: 'Mix swatches freely.', icon: Palette, wash: 'var(--terra-wash)' },
  { id: 'doodle', title: 'Doodle', blurb: 'A blank page. Draw anything.', icon: PencilLine, wash: 'var(--sage-wash)' },
  { id: 'puzzle', title: 'Puzzle', blurb: 'Tap two pieces to swap.', icon: PuzzleIcon, wash: 'var(--gold-wash)' },
  { id: 'trivia', title: 'Trivia', blurb: 'One question at a time.', icon: ListChecks, wash: 'var(--surface-deep)' },
];

type View = { name: 'home' } | { name: 'activity'; id: string } | { name: 'panic'; id: string };

function GameHost({
  id,
  onBack,
  simpleMemory = false,
}: {
  id: string;
  onBack: () => void;
  simpleMemory?: boolean;
}) {
  switch (id) {
    case 'find-different':
      return <FindDifferentGame onBack={onBack} />;
    case 'sort-it':
      return <SortItGame onBack={onBack} />;
    case 'memory':
      return <MemoryGame onBack={onBack} simple={simpleMemory} />;
    case 'find-x':
      return <FindXGame onBack={onBack} />;
    case 'color-lab':
      return <ColorLabGame onBack={onBack} />;
    case 'doodle':
      return <DoodleGame onBack={onBack} />;
    case 'puzzle':
      return <PuzzleGame onBack={onBack} />;
    case 'trivia':
      return <TriviaGame onBack={onBack} />;
    default:
      return <FindDifferentGame onBack={onBack} />;
  }
}

export default function App() {
  const [view, setView] = useState<View>({ name: 'home' });

  const openActivity = useCallback((id: string) => {
    setView({ name: 'activity', id });
    window.scrollTo({ top: 0 });
  }, []);

  const goHome = useCallback(() => {
    setView({ name: 'home' });
    window.scrollTo({ top: 0 });
  }, []);

  const enterPanic = useCallback(() => {
    setView({ name: 'panic', id: randomPanicActivity() });
    window.scrollTo({ top: 0 });
  }, []);

  const anotherPanic = useCallback(() => {
    setView((v) => {
      const cur = v.name === 'panic' ? v.id : undefined;
      return { name: 'panic', id: randomPanicActivity(cur) };
    });
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <AppShell>
      {view.name === 'home' && (
        <main className="fade-up mx-auto w-full max-w-3xl pt-8 sm:pt-14 lg:max-w-none">
          <header className="text-center">
            <p className="eyebrow">
              <span
                aria-hidden="true"
                style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--terra)' }}
              />
              A small place with things to do
            </p>
            <h1
              className="font-display mt-5 text-[56px] leading-none sm:text-[84px]"
              style={{ color: 'var(--ink)' }}
            >
              Chilling
            </h1>
            <p className="mt-3 text-[17px]" style={{ color: 'var(--muted)' }}>
              Pick something to do.
            </p>
          </header>

          <section aria-label="Panic mode" className="mx-auto mt-8 max-w-3xl sm:mt-10">
            <button
              type="button"
              onClick={enterPanic}
              aria-label="Enter Panic Mode, start an activity immediately"
              className="press flex w-full items-center gap-4 rounded-[28px] p-5 text-left sm:gap-5 sm:p-7"
              style={{
                background: 'var(--ink)',
                color: 'var(--cream-ink)',
                boxShadow: 'var(--shadow-lift)',
              }}
            >
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
                style={{ background: 'var(--terra)' }}
                aria-hidden="true"
              >
                <Zap size={28} strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display block text-[22px] leading-tight sm:text-2xl">
                  Panic Mode
                </span>
                <span className="mt-1 block text-[14.5px] leading-snug" style={{ opacity: 0.72 }}>
                  One tap. Something simple starts right away.
                </span>
              </span>
              <span
                className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full sm:inline-flex"
                style={{ background: 'rgba(250,243,227,.14)' }}
                aria-hidden="true"
              >
                <ArrowRight size={20} strokeWidth={2.2} />
              </span>
            </button>
          </section>

          <section aria-label="Activities" className="mt-8 sm:mt-10">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-4" role="list">
              {ACTIVITIES.map((m) => (
                <div key={m.id} role="listitem" className="min-w-0">
                  <ActivityCard meta={m} onOpen={openActivity} />
                </div>
              ))}
            </div>
          </section>

          <p
            className="mx-auto mt-10 max-w-md text-center text-[14px] leading-relaxed sm:mt-12"
            style={{ color: 'var(--faint)' }}
          >
            No timers. No points. Nothing to finish.
            <br />
            Just tap anything and fiddle for a while.
          </p>
        </main>
      )}

      {view.name === 'activity' && (
        <main>
          <GameHost id={view.id} onBack={goHome} />
        </main>
      )}

      {view.name === 'panic' && (
        <main className="fade-up">
          <GameHost id={view.id} onBack={goHome} simpleMemory />
          <div className="flex items-center justify-center pb-4 pt-1">
            <button
              type="button"
              onClick={anotherPanic}
              aria-label="Switch to another activity"
              className="btn btn-primary"
              style={{ padding: '1rem 2.2rem', fontSize: 16 }}
            >
              <Shuffle size={18} aria-hidden="true" /> Another
            </button>
          </div>
        </main>
      )}
    </AppShell>
  );
}
