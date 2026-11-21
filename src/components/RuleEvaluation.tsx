'use client';

import { useEffect, useState, type ReactNode } from 'react';
import HonestyNote from '@/components/HonestyNote';
import { INTAKE_STORAGE_KEY } from '@/components/StoryIntake';
import { useLanguage } from '@/hooks/useLanguage';
import {
  RAMESH_AFTER_PROFILE,
  SCHEMES,
  evaluateScheme,
  type Bilingual,
  type RuleProfile,
  type RuleStatus,
} from '@/lib/ruleEngine';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';

const STATUS_ICON: Record<RuleStatus, string> = { pass: '✓', fail: '✗', unknown: '?' };
const STATUS_TEXT: Record<RuleStatus, Bilingual> = {
  pass: { mr: 'बहुधा पात्र', en: 'Likely eligible' },
  fail: { mr: 'पात्र नाही', en: 'Not eligible' },
  unknown: { mr: 'तपासा', en: 'Check' },
};
const STATUS_COLOR: Record<RuleStatus, string> = {
  pass: 'text-success',
  fail: 'text-destructive',
  unknown: 'text-muted-foreground',
};

// Reads the saved intake profile only after mount, so server and client markup match.
function readProfile(): { profile: RuleProfile; isSample: boolean } {
  try {
    const raw = window.localStorage.getItem(INTAKE_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && (parsed as RuleProfile).version === 1) {
        const profile = parsed as RuleProfile;
        return { profile, isSample: profile.source === 'sample' };
      }
    }
  } catch {
    // Unreadable storage falls through to the sample profile.
  }
  return { profile: RAMESH_AFTER_PROFILE, isSample: true };
}

// Marathi or English first, the other language beneath it.
function Bi({ mr, en, isMarathi, className = '' }: { mr: string; en: string; isMarathi: boolean; className?: string }) {
  return (
    <span className={`block min-w-0 break-words ${className}`.trim()}>
      <span className="block">{isMarathi ? mr : en}</span>
      <span className="block text-xs text-muted-foreground">{isMarathi ? en : mr}</span>
    </span>
  );
}

function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex max-w-full rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary ${className}`.trim()}>
      {children}
    </span>
  );
}

export default function RuleEvaluation() {
  const { isMarathi } = useLanguage();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<RuleProfile>(RAMESH_AFTER_PROFILE);
  const [isSample, setIsSample] = useState(true);

  useEffect(() => {
    const loaded = readProfile();
    setProfile(loaded.profile);
    setIsSample(loaded.isSample);
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p className="p-6 text-muted-foreground">
        <Bi mr="लोड होत आहे…" en="Loading…" isMarathi={isMarathi} />
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <header className={CARD}>
        <div className="flex flex-wrap items-center gap-2">
          {isSample ? <Pill>{isMarathi ? 'नमुना / Sample' : 'Sample / नमुना'}</Pill> : null}
        </div>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">
          <Bi mr="माझ्या योजना तपासा" en="Check my schemes" isMarathi={isMarathi} />
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          <Bi
            mr="प्रत्येक नियमाचे कारण दिसेल. ✓ बहुधा पात्र, ✗ पात्र नाही, ? तपासा — अंदाज नाही."
            en="Each rule shows its reason. ✓ likely eligible, ✗ not eligible, ? check — never a guess."
            isMarathi={isMarathi}
          />
        </p>
      </header>

      {SCHEMES.map((scheme, index) => {
        const { status, results } = evaluateScheme(scheme, profile);
        return (
          <section key={scheme.id} className={`${CARD} space-y-3`} aria-label={scheme.name.en}>
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {isMarathi ? `पायरी ${index + 1}` : `Step ${index + 1}`}
                </p>
                <h2 className="text-base font-semibold">
                  <Bi mr={scheme.name.mr} en={scheme.name.en} isMarathi={isMarathi} />
                </h2>
              </div>
              <span className={`inline-flex items-center gap-1 text-sm font-semibold ${STATUS_COLOR[status]}`}>
                <span aria-hidden="true">{STATUS_ICON[status]}</span>
                <Bi mr={STATUS_TEXT[status].mr} en={STATUS_TEXT[status].en} isMarathi={isMarathi} />
              </span>
            </div>

            <div className="text-sm">
              <Bi mr={scheme.benefit.mr} en={scheme.benefit.en} isMarathi={isMarathi} />
            </div>

            <div className="text-sm font-medium">
              <Bi mr={scheme.amount.mr} en={scheme.amount.en} isMarathi={isMarathi} />
              {scheme.display_amount ? (
                <span className="mt-1 block">
                  <Bi mr={scheme.display_amount.mr} en={scheme.display_amount.en} isMarathi={isMarathi} />
                </span>
              ) : null}
            </div>

            <ul className="divide-y divide-border">
              {scheme.rules.map((rule, i) => {
                const result = results[i];
                return (
                  <li key={rule.id} className="flex min-w-0 gap-3 py-2">
                    <span
                      aria-label={result.status}
                      className={`mt-0.5 w-5 shrink-0 text-center text-sm font-bold ${STATUS_COLOR[result.status]}`}
                    >
                      {STATUS_ICON[result.status]}
                    </span>
                    <span className="min-w-0 text-sm">
                      <Bi mr={result.reasonMr} en={result.reasonEn} isMarathi={isMarathi} />
                    </span>
                  </li>
                );
              })}
            </ul>

            {scheme.notice ? (
              <p className="text-sm text-muted-foreground">
                <Bi mr={scheme.notice.mr} en={scheme.notice.en} isMarathi={isMarathi} />
              </p>
            ) : null}

            {scheme.apply_at ? (
              <p className="text-sm text-muted-foreground">
                <Bi
                  mr={`कुठे जावे: ${scheme.apply_at.mr}`}
                  en={`Where to go: ${scheme.apply_at.en}`}
                  isMarathi={isMarathi}
                />
              </p>
            ) : null}
          </section>
        );
      })}

      <HonestyNote />
    </div>
  );
}
