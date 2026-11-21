'use client';

import { useEffect, useState } from 'react';
import { RAMESH_AFTER_PROFILE, SCHEMES, type RuleProfile, type Scheme } from '@/lib/ruleEngine';

// Renewal countdown. Days are computed only from a date that is present in the stored profile.
// No date is ever invented: a missing date shows "?" plus what to check.
// No rupee figures and no identity-document fields appear on this screen.

const PROFILE_KEY = 'kamgarsaathi.intakeProfile';
const MS_PER_DAY = 86_400_000;
const RING_CYCLE_DAYS = 365;
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function toMr(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

// Parses a strict YYYY-MM-DD string to a UTC midnight timestamp. Returns null for anything else.
function parseIsoDate(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = ISO_DATE.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const ts = Date.UTC(year, month, day);
  const check = new Date(ts);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month || check.getUTCDate() !== day) {
    return null;
  }
  return ts;
}

function addOneYear(ts: number): number {
  const d = new Date(ts);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.getTime();
}

function todayUtcMidnight(): number {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

type RenewalState =
  | { kind: 'days'; days: number; basis: 'renewal' | 'registration' }
  | { kind: 'unknown' };

// Uses an explicit renewal due date when the profile has one. Otherwise, if a registration
// date is present, the 12-month clock runs from it. With neither, the result is unknown.
function resolveRenewal(profile: RuleProfile, today: number): RenewalState {
  const due = parseIsoDate(profile.renewalDueDate);
  if (due !== null) {
    return { kind: 'days', days: Math.round((due - today) / MS_PER_DAY), basis: 'renewal' };
  }
  const registered = parseIsoDate(profile.registrationDate);
  if (registered !== null) {
    const dueFromReg = addOneYear(registered);
    return { kind: 'days', days: Math.round((dueFromReg - today) / MS_PER_DAY), basis: 'registration' };
  }
  return { kind: 'unknown' };
}

function isSampleProfile(profile: RuleProfile): boolean {
  return profile.isSample === true || profile.source === 'sample' || typeof profile.sampleId === 'string';
}

export default function RenewalCountdown() {
  const [profile, setProfile] = useState<RuleProfile | null>(null);
  const [today, setToday] = useState<number | null>(null);

  // localStorage is read only after mount, so server and client markup match on first render.
  useEffect(() => {
    let stored: RuleProfile | null = null;
    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          stored = parsed as RuleProfile;
        }
      }
    } catch {
      stored = null;
    }
    setProfile(stored ?? RAMESH_AFTER_PROFILE);
    setToday(todayUtcMidnight());
  }, []);

  if (!profile || today === null) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-sm text-slate-500">लोड होत आहे… / Loading…</p>
      </div>
    );
  }

  const sample = isSampleProfile(profile);
  const registered = profile.mahabocwRegistered === true;
  const active = profile.registrationActive === true;
  const renewal = resolveRenewal(profile, today);

  // The BOCW registration is the renewal clock; the other BOCW benefits depend on it.
  const bocwSchemes: Scheme[] = SCHEMES.filter((s) => s.id === 'mahabocw' || s.id.startsWith('bocw-'));
  const dependents = bocwSchemes.filter((s) => s.id !== 'mahabocw');

  const days = renewal.kind === 'days' ? renewal.days : null;
  const progress = days !== null && days >= 0 ? Math.min(days / RING_CYCLE_DAYS, 1) : 0;
  const ringCircumference = 2 * Math.PI * 44;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">नूतनीकरण / Renewal</h1>
          {sample && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              नमुना / Sample
            </span>
          )}
        </div>
        {sample && (
          <p className="text-sm text-slate-600">नमुना व्यक्ती — Sample persona</p>
        )}
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative h-28 w-28 shrink-0">
            <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="#f97316"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringCircumference * (1 - progress)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">
                {days === null ? '?' : days >= 0 ? toMr(days) : toMr(-days)}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            {renewal.kind === 'days' && days !== null && days >= 0 && (
              <>
                <p className="text-base font-semibold text-slate-900">
                  नूतनीकरणाला {toMr(days)} दिवस बाकी
                </p>
                <p className="text-sm text-slate-600">{days} days to renewal</p>
              </>
            )}
            {renewal.kind === 'days' && days !== null && days < 0 && (
              <>
                <p className="text-base font-semibold text-red-700">
                  नूतनीकरणाची मुदत {toMr(-days)} दिवसांपूर्वी संपली
                </p>
                <p className="text-sm text-slate-600">Renewal date passed {-days} days ago — check the portal</p>
              </>
            )}
            {renewal.kind === 'unknown' && !registered && (
              <>
                <p className="text-base font-semibold text-slate-900">
                  प्रमाणपत्र १२ महिने पूर्ण होण्यापूर्वी नोंदणी करा.
                </p>
                <p className="text-sm text-slate-600">Register before your certificate crosses 12 months.</p>
                <p className="text-sm text-slate-500">
                  तपासा: तुमच्या ९० दिवसांच्या कामाच्या प्रमाणपत्राची पहिली तारीख — mahabocw.in
                  <br />
                  Check: the first date on your 90-day work certificate — mahabocw.in
                </p>
              </>
            )}
            {renewal.kind === 'unknown' && registered && (
              <>
                <p className="text-base font-semibold text-slate-900">नोंदणीची तारीख प्रोफाइलमध्ये नाही.</p>
                <p className="text-sm text-slate-600">Registration date is not in your profile.</p>
                <p className="text-sm text-slate-500">
                  तपासा: तुमच्या MahaBOCW नोंदणी प्रमाणपत्रावरील तारीख — mahabocw.in
                  <br />
                  Check: the date on your MahaBOCW registration certificate — mahabocw.in
                </p>
              </>
            )}
            {renewal.kind === 'days' && renewal.basis === 'registration' && (
              <p className="text-xs text-slate-500">
                नोंदणीच्या तारखेपासून १२ महिने / 12 months from the registration date
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-900">
          नोंदणी संपली तर फायदे थांबतात — वेळेवर नूतनीकरण करा.
          <br />
          If registration lapses, benefits stop — renew on time.
        </p>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">या नोंदणीवर अवलंबून असलेले फायदे</h2>
          <p className="text-sm text-slate-600">
            These benefits need an active MahaBOCW registration.
          </p>
        </div>

        <ul className="space-y-3">
          {dependents.map((scheme) => {
            let statusMr: string;
            let statusEn: string;
            if (!registered || !active) {
              statusMr = 'नोंदणी सक्रिय नाही — आधी नोंदणी करा';
              statusEn = 'No active registration — register first';
            } else if (renewal.kind === 'days' && days !== null && days < 0) {
              statusMr = 'नूतनीकरण मुदत उलटली — पोर्टलवर तपासा';
              statusEn = 'Renewal date passed — check the portal';
            } else if (renewal.kind === 'days' && days !== null) {
              statusMr = `बहुधा पात्र · नूतनीकरणाला ${toMr(days)} दिवस बाकी`;
              statusEn = `Likely eligible · ${days} days to renewal`;
            } else {
              statusMr = 'बहुधा पात्र · नूतनीकरणाची तारीख ?';
              statusEn = 'Likely eligible · renewal date ? (check at the portal)';
            }
            return (
              <li key={scheme.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="font-semibold text-slate-900">
                  {scheme.name.mr}
                  <span className="block text-sm font-normal text-slate-600">{scheme.name.en}</span>
                </p>
                <p className="mt-2 text-sm text-slate-800">{statusMr}</p>
                <p className="text-sm text-slate-600">{statusEn}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="text-xs text-slate-500">
        दिवस आजच्या तारखेनुसार मोजले आहेत. अधिकृत तारीख mahabocw.in वर तपासा.
        <br />
        Day counts use today&apos;s date. Confirm the official date at mahabocw.in.
      </footer>
    </div>
  );
}
