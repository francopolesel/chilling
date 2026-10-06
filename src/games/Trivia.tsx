import { useMemo, useState } from 'react';
import { TRIVIA } from '../data/trivia';
import { shuffle } from '../lib/random';
import { ActivityScreen, NeutralButton } from '../components/ActivityScreen';

export function TriviaGame({ onBack }: { onBack: () => void }) {
  const [order, setOrder] = useState<string[]>(() => shuffle(TRIVIA.map((t) => t.id)));
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);

  const item = useMemo(() => {
    const id = order[index % order.length];
    return TRIVIA.find((t) => t.id === id) ?? TRIVIA[0];
  }, [order, index]);

  // shuffle answer display order deterministically per question view
  const display = useMemo(() => {
    const arr = item.answers.map((text, oi) => ({ text, oi }));
    // randomize each time question changes
    return shuffle(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const another = () => {
    setChosen(null);
    setIndex((i) => {
      const n = i + 1;
      if (n >= order.length) {
        setOrder(shuffle(TRIVIA.map((t) => t.id)));
        return 0;
      }
      return n;
    });
  };

  return (
    <ActivityScreen
      title="Trivia"
      hint="One question at a time."
      onBack={onBack}
      controls={<NeutralButton onClick={another}>Another</NeutralButton>}
    >
      <div key={item.id + String(index)} className="fade-up mx-auto max-w-[500px]">
        <p className="chip mx-auto w-fit" style={{ background: 'var(--sage-wash)', color: 'var(--sage-deep)', border: '1px solid var(--sage)' }}>
          {item.topic}
        </p>
        <h2 className="mt-4 text-center text-[22px] font-bold leading-snug sm:text-[26px]" style={{ color: 'var(--ink)' }}>
          {item.question}
        </h2>
        <div className="mt-6 grid gap-3" role="group" aria-label="Answer choices">
          {display.map(({ text, oi }) => {
            const isCorrect = oi === item.correct;
            const isChosen = chosen === oi;
            const revealed = chosen !== null;
            const highlightCorrect = revealed && isCorrect;
            const highlightPicked = revealed && isChosen && !isCorrect;
            return (
              <button
                key={oi}
                type="button"
                onClick={() => setChosen(oi)}
                disabled={revealed}
                aria-label={`Answer: ${text}`}
                className="press touch-target rounded-[18px] px-5 py-4 text-left text-[16px] font-semibold"
                style={{
                  background: highlightCorrect ? 'var(--sage-wash)' : highlightPicked ? 'var(--surface-warm)' : 'var(--surface)',
                  border: highlightCorrect
                    ? '2px solid var(--sage)'
                    : highlightPicked
                      ? '2px solid var(--line)'
                      : '1px solid var(--line)',
                  color: 'var(--ink)',
                  boxShadow: 'var(--shadow-sm)',
                  minHeight: 58,
                }}
              >
                {text}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-center text-sm" style={{ color: 'var(--muted)' }} aria-live="polite">
          {chosen === null ? 'Pick one to see.' : 'Here is the one.'}
        </p>
      </div>
    </ActivityScreen>
  );
}




