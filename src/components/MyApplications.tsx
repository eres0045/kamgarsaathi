'use client';

import { useEffect, useState } from 'react';
import { SCHEMES, type Bilingual } from '@/lib/ruleEngine';

// Manual tracker. The user sets every status by hand. Nothing here checks a portal or the network.
const STORAGE_KEY = 'kamgarsaathi.applications';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';
const FIELD = 'w-full min-w-0 rounded-[var(--radius)] border border-border bg-background p-2 text-sm';

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function toDevanagari(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

// Five states, in this order. The default for every scheme is not_applied.
type ApplicationStatus = 'not_applied' | 'applied' | 'documents_submitted' | 'approved' | 'rejected';

const STATUS_ORDER: ApplicationStatus[] = ['not_applied', 'applied', 'documents_submitted', 'approved', 'rejected'];

const STATUS_LABEL: Record<ApplicationStatus, Bilingual> = {
  not_applied: { mr: 'अर्ज केला नाही', en: 'Not applied' },
  applied: { mr: 'अर्ज केला', en: 'Applied' },
  documents_submitted: { mr: 'कागदपत्रे सादर केली', en: 'Documents submitted' },
  approved: { mr: 'मंजूर', en: 'Approved' },
  rejected: { mr: 'नाकारले', en: 'Rejected' },
};

type ApplicationEntry = { status: ApplicationStatus; date: string };
type ApplicationStore = Record<string, ApplicationEntry>;

const DEFAULT_ENTRY: ApplicationEntry = { status: 'not_applied', date: '' };

const PORTAL_FALLBACK: Bilingual = { mr: 'पोर्टल तपासा', en: 'Check the portal' };

function isStatus(value: unknown): value is ApplicationStatus {
  return typeof value === 'string' && (STATUS_ORDER as string[]).includes(value);
}

// Reads saved statuses only after mount, so server and client markup match.
function readStore(): ApplicationStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const out: ApplicationStore = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        const entry = value as { status?: unknown; date?: unknown };
        if (isStatus(entry.status)) {
          out[id] = { status: entry.status, date: typeof entry.date === 'string' ? entry.date : '' };
        }
      }
    }
    return out;
  } catch {
    return {};
  }
}

// Called only from a user change, never on mount.
function writeStore(store: ApplicationStore): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage unavailable: the choice stays on screen for this visit only.
  }
}

// Marathi first, English beneath it.
function Bi({ mr, en, className = '' }: { mr: string; en: string; className?: string }) {
  return (
    <span className={`block min-w-0 break-words ${className}`.trim()}>
      <span className="block">{mr}</span>
      <span className="block text-xs text-muted-foreground">{en}</span>
    </span>
  );
}

export default function MyApplications() {
  const [ready, setReady] = useState(false);
  const [store, setStore] = useState<ApplicationStore>({});

  useEffect(() => {
    setStore(readStore());
    setReady(true);
  }, []);

  function updateEntry(schemeId: string, patch: Partial<ApplicationEntry>) {
    const current = store[schemeId] ?? DEFAULT_ENTRY;
    const next: ApplicationStore = { ...store, [schemeId]: { ...current, ...patch } };
    setStore(next);
    writeStore(next);
  }

  if (!ready) {
    return (
      <p className="p-6 text-muted-foreground">
        <Bi mr="लोड होत आहे…" en="Loading…" />
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <header className={CARD}>
        <h1 className="text-xl font-bold sm:text-2xl">
          <Bi mr="माझे अर्ज" en="My applications" />
        </h1>
        <p role="note" className="mt-3 rounded-[var(--radius)] border border-border bg-muted p-3 text-sm font-semibold">
          <span className="block">तुम्ही अद्ययावत केलेली स्थिती. अधिकृत स्थितीसाठी पोर्टल तपासा.</span>
          <span className="block">Status updated by you. Check the portal for the official status.</span>
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          <Bi
            mr="ही स्थिती तुम्ही स्वतः भरता. येथून कोणतीही पोर्टल किंवा थेट स्थिती तपासणी होत नाही."
            en="You fill in this status yourself. Nothing here checks a portal or live status."
          />
        </p>
      </header>

      <ul className="space-y-4">
        {SCHEMES.map((scheme, index) => {
          const entry = store[scheme.id] ?? DEFAULT_ENTRY;
          const statusId = `status-${scheme.id}`;
          const dateId = `date-${scheme.id}`;
          return (
            <li key={scheme.id}>
              <section className={`${CARD} space-y-3`} aria-label={scheme.name.en}>
                <h2 className="text-base font-semibold">
                  <span className="text-xs text-muted-foreground">
                    {toDevanagari(index + 1)} / {index + 1}
                  </span>
                  <Bi mr={scheme.name.mr} en={scheme.name.en} />
                </h2>

                <p className="text-sm">
                  <span className="block text-xs text-muted-foreground">
                    <Bi mr="कुठे तपासायचे" en="Where to check" />
                  </span>
                  <Bi mr={(scheme.apply_at ?? PORTAL_FALLBACK).mr} en={(scheme.apply_at ?? PORTAL_FALLBACK).en} />
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="min-w-0 space-y-1">
                    <label htmlFor={statusId} className="block text-sm font-medium">
                      <Bi mr="स्थिती" en="Status" />
                    </label>
                    <select
                      id={statusId}
                      value={entry.status}
                      onChange={(e) => updateEntry(scheme.id, { status: e.target.value as ApplicationStatus })}
                      className={FIELD}
                    >
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s].mr} / {STATUS_LABEL[s].en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <label htmlFor={dateId} className="block text-sm font-medium">
                      <Bi mr="या स्थितीची तारीख" en="Date of this status" />
                    </label>
                    <input
                      id={dateId}
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateEntry(scheme.id, { date: e.target.value })}
                      className={FIELD}
                    />
                  </div>
                </div>
              </section>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
