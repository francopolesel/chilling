import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-8 pb-14">{children}</div>
      <footer className="mx-auto w-full max-w-5xl px-4 sm:px-8 pb-7">
        <p className="text-center text-[13px]" style={{ color: 'var(--faint)' }}>
          Chilling · a small place with things to do
        </p>
      </footer>
    </div>
  );
}
