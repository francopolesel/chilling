import type { ReactNode } from 'react';
import { BackButton } from './BackButton';

export function ActivityScreen({
  title,
  hint,
  onBack,
  controls,
  children,
}: {
  title: string;
  hint?: string;
  onBack: () => void;
  controls?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fade-up mx-auto w-full max-w-2xl pt-5 sm:pt-9">
      <div className="flex items-center justify-start">
        <BackButton onBack={onBack} />
      </div>

      <div className="mt-6 text-center sm:mt-8">
        <h1 className="font-display text-[32px] leading-tight sm:text-[40px]" style={{ color: 'var(--ink)' }}>
          {title}
        </h1>
        {hint && (
          <p className="mx-auto mt-2 max-w-md text-[15.5px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            {hint}
          </p>
        )}
      </div>

      <div className="surface mt-6 rounded-[26px] p-4 sm:mt-8 sm:p-8" style={{ borderRadius: 'var(--r-lg)' }}>
        {children}
      </div>

      {controls && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{controls}</div>
      )}
    </div>
  );
}

export function NeutralButton({
  onClick,
  children,
  ariaLabel,
  variant = 'soft',
}: {
  onClick: () => void;
  children: ReactNode;
  ariaLabel?: string;
  variant?: 'soft' | 'primary' | 'quiet' | 'terra';
}) {
  const cls =
    variant === 'primary'
      ? 'btn btn-primary'
      : variant === 'quiet'
        ? 'btn btn-quiet'
        : variant === 'terra'
          ? 'btn btn-terra'
          : 'btn btn-soft';
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}
