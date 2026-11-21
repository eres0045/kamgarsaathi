
'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function LanguageToggle() {
  const { toggleLanguage, isMarathi } = useLanguage();

  const label = isMarathi ? 'English' : 'मराठी';
  const ariaLabel = isMarathi ? 'Switch to English' : 'मराठी भाषा निवडा';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={ariaLabel}
      title={ariaLabel}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap"
     data-nexen-id="nx-176708e7-0">
      <span aria-hidden="true" className="text-muted-foreground" data-nexen-id="nx-176708e7-1">
        ⇄
      </span>
      <span lang={isMarathi ? 'en' : 'mr'} data-nexen-id="nx-176708e7-2">{label}</span>
    </button>
  );
}