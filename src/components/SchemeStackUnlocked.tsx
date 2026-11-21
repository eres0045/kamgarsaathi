'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import HonestyNote from '@/components/HonestyNote';
import { INTAKE_STORAGE_KEY } from '@/components/StoryIntake';
import { useLanguage } from '@/hooks/useLanguage';
import {
  RAMESH_AFTER_PROFILE,
  SCHEMES,
  evaluateScheme,
  type Bilingual,
  type RuleProfile,
  type RuleResult,
  type RuleStatus,
} from '@/lib/ruleEngine';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function toDevanagari(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

// Only "pass" (likely eligible) and "unknown" (check) are shown on the stack. A fail is left out.
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

// "Why this order" lines from BUILD-PACKET.md §3 (English is packet text).
// The Marathi is a working translation, not packet copy.
const WHY_GATEWAY: Bilingual = {
  mr: 'ई-श्रम प्रथम — असंघटित कामगारांसाठी ही प्रवेश-ओळख आहे.',
  en: 'e-Shram first — it is the gateway identity for unorganised workers.',
};
const WHY_INSURANCE: Bilingual = {
  mr: 'PMSBY / PMJJBY / PM-SYM / PM-JAY पुढे — यांना फक्त वय, बँक खाते व उत्पन्न लागते, BOCW गेट नाही.',
  en: 'PMSBY / PMJJBY / PM-SYM / PM-JAY next — they need only age + bank account + income, no BOCW gate.',
};
const WHY_MAHABOCW: Bilingual = {
  mr: 'महाबोकॉव्ह नोंदणी — ९० दिवसांचा गेट लागतो; ती सर्व BOCW लाभ उघडते.',
  en: 'MahaBOCW registration — needs the 90-day gate; unlocks all BOCW benefits.',
};
const WHY_BOCW_BENEFITS: Bilingual = {
  mr: 'BOCW लाभ (शिष्यवृत्ती, विवाह, आरोग्य, साधनसंचयी) — सक्रिय BOCW नोंदणी लागते.',
  en: 'BOCW benefits (scholarship, marriage, health, tool-kit) — need active BOCW registration.',
};
const WHY_PARALLEL: Bilingual = {
  mr: 'माझी लाडकी बहीण — स्वतंत्र राज्य योजना; ती समांतर चालते, स्टॅकमध्ये नाही.',
  en: 'Majhi Ladki Bahin — independent state scheme for women; runs in parallel, not in the stack.',
};
const WHY_FALLBACK: Bilingual = {
  mr: 'व्हीबी-जी राम जी / मनरेगा — बांधकाम काम कमी झाल्यावरचा मजुरी पर्याय.',
  en: 'VB-G RAM G / MGNREGA — fallback wage work when construction work dries up.',
};

const WHY_BY_ID: Record<string, Bilingual> = {
  eshram: WHY_GATEWAY,
  pmsby: WHY_INSURANCE,
  pmjjby: WHY_INSURANCE,
  pmsym: WHY_INSURANCE,
  pmjay: WHY_INSURANCE,
  mahabocw: WHY_MAHABOCW,
  'bocw-scholarship': WHY_BOCW_BENEFITS,
  'bocw-marriage': WHY_BOCW_BENEFITS,
  'bocw-health': WHY_BOCW_BENEFITS,
  'bocw-toolkit': WHY_BOCW_BENEFITS,
  'ladki-bahin': WHY_PARALLEL,
  'vbg-ramg-mgnrega': WHY_FALLBACK,
};

const UNLOCKED_SCHOLARSHIP: Bilingual = {
  mr: 'शिष्यवृत्तीची पात्रता उघडली',
  en: 'scholarship eligibility unlocked',
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

export default function SchemeStackUnlocked() {
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

  const evaluated = SCHEMES.map((scheme, index) => ({
    scheme,
    index,
    ...evaluateScheme(scheme, profile),
  }));
  const stack = evaluated.filter((item) => item.status !== 'fail');
  const notLikelyCount = evaluated.length - stack.length;

  const toolkit = evaluated.find((item) => item.scheme.id === 'bocw-toolkit');
  const scholarship = evaluated.find((item) => item.scheme.id === 'bocw-scholarship');
  const registrationScheme = evaluated.find((item) => item.scheme.id === 'mahabocw');
  const toolkitUnlocked = toolkit?.status === 'pass' && !!toolkit.scheme.display_amount;
  // Registration passes but the toolkit rules are still unknown (no BOCW registration confirmed yet).
  const registrationPassesButUnconfirmed = registrationScheme?.status === 'pass' && toolkit?.status !== 'pass';
  const scholarshipUnlocked = scholarship?.status === 'pass';
  const toolkitChecks: RuleResult[] = toolkit ? toolkit.results.filter((r) => r.status === 'unknown') : [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <header className={CARD}>
        <div className="flex flex-wrap items-center gap-2">
          {isSample ? <Pill>{isMarathi ? 'नमुना व्यक्ती / Sample persona' : 'Sample persona / नमुना व्यक्ती'}</Pill> : null}
        </div>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">
          <Bi mr="योजनांची क्रमवार यादी" en="Scheme stack, in order" isMarathi={isMarathi} />
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          <Bi
            mr="✓ बहुधा पात्र, ? तपासा — अंदाज नाही. प्रत्येक पायरीखाली तिचा क्रम का आहे ते दिसेल."
            en="✓ likely eligible, ? check — never a guess. Each step shows why it sits in this order."
            isMarathi={isMarathi}
          />
        </p>
      </header>

      <section className={`${CARD} space-y-3`} aria-label="Money unlocked / तुमच्यासाठी उघडलेले पैसे">
        <h2 className="text-base font-semibold">
          <Bi mr="तुमच्यासाठी उघडलेले पैसे" en="Money unlocked for you" isMarathi={isMarathi} />
        </h2>

        {toolkitUnlocked && toolkit?.scheme.display_amount ? (
          <div className="space-y-1">
            <p className="text-2xl font-bold text-success sm:text-3xl">
              <Bi
                mr={toolkit.scheme.display_amount.mr}
                en={toolkit.scheme.display_amount.en}
                isMarathi={isMarathi}
                className="text-2xl font-bold text-success sm:text-3xl"
              />
            </p>
            <p className="text-sm">
              <Bi mr="साधनसंचयी सहाय्य" en="BOCW Tool-Kit Aid" isMarathi={isMarathi} />
            </p>
          </div>
        ) : registrationPassesButUnconfirmed && toolkit?.scheme.display_amount ? (
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground sm:text-3xl">
              <Bi
                mr={toolkit.scheme.display_amount.mr}
                en={toolkit.scheme.display_amount.en}
                isMarathi={isMarathi}
                className="text-2xl font-bold text-foreground sm:text-3xl"
              />
            </p>
            <p className="text-sm">
              <Bi mr="साधनसंचयी सहाय्य" en="BOCW Tool-Kit Aid" isMarathi={isMarathi} />
            </p>
            <p className="text-sm text-muted-foreground">
              <Bi
                mr="नोंदणी केल्यानंतर दावा करता येईल — mahabocw.in वर नोंदणी करा."
                en="Claimable after you register at mahabocw.in."
                isMarathi={isMarathi}
              />
            </p>
          </div>
        ) : (
          <p className="text-sm font-medium">
            <Bi mr="अजून रक्कम उघडली नाही" en="No amount unlocked yet" isMarathi={isMarathi} />
          </p>
        )}

        {scholarshipUnlocked ? (
          <p className="text-sm font-medium">
            <Bi mr={UNLOCKED_SCHOLARSHIP.mr} en={UNLOCKED_SCHOLARSHIP.en} isMarathi={isMarathi} />
          </p>
        ) : registrationPassesButUnconfirmed ? (
          <p className="text-sm font-medium">
            <Bi mr="शिष्यवृत्तीसाठी पात्रता उघडली" en="scholarship eligibility unlocked" isMarathi={isMarathi} />
          </p>
        ) : null}

        {!toolkitUnlocked && toolkitChecks.length > 0 ? (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">
              <Bi mr="पुढे तपासा" en="Check next" isMarathi={isMarathi} />
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              {toolkitChecks.map((r) => (
                <li key={r.checkEn ?? r.reasonEn}>
                  <Bi mr={r.checkMr ?? r.reasonMr} en={r.checkEn ?? r.reasonEn} isMarathi={isMarathi} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          <Bi
            mr="येथे एकूण रक्कम जोडली जात नाही — प्रत्येक रक्कम वेगळी आहे."
            en="No total is added up here — each amount stands on its own."
            isMarathi={isMarathi}
          />
        </p>
      </section>

      {stack.map((item, position) => {
        const { scheme, status, results } = item;
        const why = WHY_BY_ID[scheme.id];
        const checks = results.filter((r) => r.status === 'unknown');
        return (
          <section key={scheme.id} className={`${CARD} space-y-3`} aria-label={scheme.name.en}>
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  {isMarathi ? `पायरी ${toDevanagari(position + 1)}` : `Step ${position + 1}`}
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

            {why ? (
              <p className="text-xs italic text-muted-foreground">
                <Bi mr={why.mr} en={why.en} isMarathi={isMarathi} />
              </p>
            ) : null}

            {checks.length > 0 ? (
              <ul className="divide-y divide-border">
                {checks.map((r) => (
                  <li key={r.checkEn ?? r.reasonEn} className="flex min-w-0 gap-3 py-2">
                    <span aria-label="check" className="mt-0.5 w-5 shrink-0 text-center text-sm font-bold text-muted-foreground">
                      ?
                    </span>
                    <span className="min-w-0 text-sm">
                      <Bi mr={r.checkMr ?? r.reasonMr} en={r.checkEn ?? r.reasonEn} isMarathi={isMarathi} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {scheme.notice ? (
              <p className="text-sm text-muted-foreground">
                <Bi mr={scheme.notice.mr} en={scheme.notice.en} isMarathi={isMarathi} />
              </p>
            ) : null}

            <Link href="/my-applications" className="inline-block text-sm font-medium text-primary underline">
              <Bi mr="अर्ज स्थिती नोंदवा" en="Update application status" isMarathi={isMarathi} />
            </Link>
          </section>
        );
      })}

      {notLikelyCount > 0 ? (
        <p className="text-sm text-muted-foreground">
          <Bi
            mr={`${toDevanagari(notLikelyCount)} योजना या प्रोफाइलसाठी बहुधा पात्र नाहीत — त्या येथे दाखवल्या नाहीत.`}
            en={`${notLikelyCount} schemes are not likely eligible for this profile and are not listed here.`}
            isMarathi={isMarathi}
          />
        </p>
      ) : null}

      <HonestyNote />
    </div>
  );
}
