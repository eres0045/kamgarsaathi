
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/story-intake', label: 'Story Intake' },
  { href: '/rule-engine-evaluation', label: 'Rule Engine Evaluation' },
  { href: '/gate-proof-moment', label: 'Gate-Proof Moment' },
  { href: '/scheme-stack-unlocked', label: 'Scheme Stack + ₹ Unlocked' },
  { href: '/documents', label: 'Document Quest' },
  { href: '/renewal-countdown', label: 'Renewal Countdown' },
  { href: '/pre-filled-application-pack', label: 'Pre-filled Application Pack' },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppNav() {
  const pathname = usePathname();

  return (
    <aside className="ui-sidebar flex w-full min-w-0 flex-col gap-4 border-b border-border bg-card p-4 sm:p-6" data-nexen-id="nx-118d7771-0">
      <div className="ui-brand flex min-w-0 items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/nexen-logo.svg" alt="" className="h-8 w-8 shrink-0"  data-nexen-id="nx-118d7771-1"/>
        <span className="truncate text-lg font-bold text-foreground" data-nexen-id="nx-118d7771-2">KamgarSaathi</span>
      </div>

      <nav aria-label="Main navigation" className="ui-nav flex flex-wrap gap-2" data-nexen-id="nx-118d7771-3">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={[
                'inline-flex items-center rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-primary/10 hover:text-primary',
              ].join(' ')}
             data-nexen-id="nx-118d7771-4">
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}