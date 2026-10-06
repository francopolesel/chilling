import { useMemo, useState } from 'react';
import { Dices, Plus } from 'lucide-react';
import { ActivityScreen, NeutralButton } from '../components/ActivityScreen';
import { randInt } from '../lib/random';

function randColor(): string {
  const hues: Array<[number, number, number]> = [
    [14 + randInt(-6, 10), 42 + randInt(-8, 10), 58 + randInt(-6, 8)],
    [85 + randInt(-15, 15), 22 + randInt(-6, 8), 52 + randInt(-6, 10)],
    [38 + randInt(-8, 8), 55 + randInt(-10, 10), 60 + randInt(-6, 6)],
    [200 + randInt(-20, 20), 18, 55],
    [340 + randInt(-12, 12), 30, 62],
  ];
  const [h, s, l] = hues[randInt(0, hues.length - 1)];
  return `hsl(${h} ${s}% ${l}%)`;
}

function mix(colors: string[]): string {
  if (colors.length === 0) return '#EFE4CF';
  if (colors.length === 1) return colors[0];
  // visual blend: layered gradient
  return `linear-gradient(120deg, ${colors.join(', ')})`;
}

export function ColorLabGame({ onBack }: { onBack: () => void }) {
  const [colors, setColors] = useState<string[]>(() => [randColor(), randColor(), randColor()]);
  const [palette, setPalette] = useState<string[]>(() => [randColor(), randColor(), randColor(), randColor(), randColor()]);

  const blend = useMemo(() => mix(colors), [colors]);

  const shuffleAll = () => {
    setColors([randColor(), randColor(), randColor()]);
    setPalette([randColor(), randColor(), randColor(), randColor(), randColor()]);
  };

  const changeOne = (i: number) => {
    setColors((c) => c.map((v, k) => (k === i ? randColor() : v)));
  };

  const changePaletteOne = (i: number) => {
    setPalette((p) => p.map((v, k) => (k === i ? randColor() : v)));
  };

  const addToMixer = (c: string) => {
    setColors((prev) => [...prev.slice(-2), c]);
  };

  return (
    <ActivityScreen
      title="Color Lab"
      hint="Tap swatches. Mix. See what happens."
      onBack={onBack}
      controls={
        <>
          <NeutralButton onClick={shuffleAll}>
            <Dices size={17} aria-hidden="true" /> Shuffle
          </NeutralButton>
          <NeutralButton
            variant="quiet"
            onClick={() => {
              setColors([randColor(), randColor(), randColor()]);
            }}
          >
            <Plus size={17} aria-hidden="true" /> New blend
          </NeutralButton>
        </>
      }
    >
      {/* large field */}
      <div
        aria-label="Blended color field"
        role="img"
        className="mx-auto h-48 w-full max-w-[500px] sm:h-60"
        style={{ background: blend, border: '1px solid var(--line)', borderRadius: 22, boxShadow: 'var(--shadow)' }}
      />
      {/* mixer */}
      <div className="mx-auto mt-6 max-w-[500px]">
        <p className="text-[12px] font-bold uppercase" style={{ color: 'var(--faint)', letterSpacing: '0.14em' }}>
          Mixer
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-3">
          {colors.map((c, i) => (
            <button
              key={`${i}-${c}`}
              type="button"
              onClick={() => changeOne(i)}
              aria-label={`Change mixer color ${i + 1}`}
              className="press h-[72px] touch-target"
              style={{ background: c, border: '1px solid rgba(50,38,32,.2)', borderRadius: 18, boxShadow: 'var(--shadow-sm)' }}
            />
          ))}
        </div>
        {/* palette */}
        <p className="mt-6 text-[12px] font-bold uppercase" style={{ color: 'var(--faint)', letterSpacing: '0.14em' }}>
          Palette — tap to try
        </p>
        <div className="mt-2.5 grid grid-cols-5 gap-2.5">
          {palette.map((c, i) => (
            <button
              key={`${i}-${c}`}
              type="button"
              onClick={() => {
                changePaletteOne(i);
                addToMixer(c);
              }}
              onContextMenu={(e) => e.preventDefault()}
              aria-label={`Palette color ${i + 1}, tap to mix`}
              className="press h-[56px] touch-target"
              style={{ background: c, border: '1px solid rgba(50,38,32,.2)', borderRadius: 14, boxShadow: 'var(--shadow-sm)' }}
            />
          ))}
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm" style={{ color: 'var(--muted)' }}>
          <span>Fine-tune:</span>
          <input
            type="color"
            aria-label="Pick a custom color to add to the mixer"
            defaultValue="#bd7355"
            onChange={(e) => addToMixer(e.target.value)}
            className="h-11 w-16 cursor-pointer rounded-xl touch-target"
            style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}
          />
        </label>
      </div>
    </ActivityScreen>
  );
}




