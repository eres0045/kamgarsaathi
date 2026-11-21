import type { ReactNode } from 'react';
import LanguageToggle from '@/components/LanguageToggle';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl justify-end px-8 pt-4">
        <LanguageToggle />
      </div>
      <main className="mx-auto max-w-6xl px-8 py-6" data-nexen-id="nx-f6ff2367-0">{children}</main>
    </div>
  );
}