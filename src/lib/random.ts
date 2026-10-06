export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

const PANIC_POOL = ['find-different', 'find-x', 'doodle', 'memory', 'color-lab'] as const;
export type PanicActivityId = (typeof PANIC_POOL)[number];

export function randomPanicActivity(exclude?: string): PanicActivityId {
  const pool = exclude ? PANIC_POOL.filter((a) => a !== exclude) : [...PANIC_POOL];
  return pick(pool.length ? pool : [...PANIC_POOL]);
}
