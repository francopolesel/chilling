import { ArrowLeft } from 'lucide-react';

export function BackButton({ onBack, label = 'Chilling' }: { onBack: () => void; label?: string }) {
  return (
    <button type="button" onClick={onBack} aria-label="Back to Chilling" className="back-link">
      <ArrowLeft size={16} aria-hidden="true" strokeWidth={2.2} />
      <span>{label}</span>
    </button>
  );
}
