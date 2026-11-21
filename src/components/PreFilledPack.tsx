'use client';

import { useEffect, useState, type ReactNode } from 'react';
import HonestyNote from '@/components/HonestyNote';
import { INTAKE_STORAGE_KEY, type IntakeProfile } from '@/components/StoryIntake';
import { useLanguage } from '@/hooks/useLanguage';
import { RAMESH_AFTER_PROFILE, SCHEMES, evaluateScheme, type RuleStatus } from '@/lib/ruleEngine';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

type Bilingual = { mr: string; en: string };

// 'document' values come from a document extraction and need a crop plus the user's Confirm.
// 'self' values are what the user told us in intake.
type PackField = {
  key: string;
  label: Bilingual;
  value: Bilingual;
  answered: boolean;
  source: 'self' | 'document';
  doc?: Bilingual;
};

const UNANSWERED: Bilingual = { mr: '? उत्तर नाही', en: '? Not answered' };

const WORK_LABEL: Record<IntakeProfile['workType'], Bilingual> = {
  mason: { mr: 'गवंडी', en: 'Mason' },
  helper: { mr: 'मदतनीस', en: 'Helper' },
  painter: { mr: 'रंगारी', en: 'Painter' },
  delivery: { mr: 'डिलिव्हरी रायडर', en: 'Delivery rider' },
  other: { mr: 'इतर', en: 'Other' },
};

const STATUS_STYLE: Record<RuleStatus, { label: Bilingual; className: string }> = {
  pass: {
    label: { mr: 'बहुधा पात्र', en: 'Likely eligible' },
    className: 'bg-success/10 text-success',
  },
  fail: {
    label: { mr: 'सध्या पात्र नाही', en: 'Not eligible on current answers' },
    className: 'bg-muted text-muted-foreground',
  },
  unknown: {
    label: { mr: 'तपासणे बाकी', en: 'Still to check' },
    className: 'bg-primary/10 text-primary',
  },
};

const STORED_STATE_NOTE: Bilingual = {
  mr: 'तुमची जतन केलेली माहिती',
  en: 'Your saved profile',
};

const FALLBACK_STATE_NOTE: Bilingual = {
  mr: 'रमेश — नंतरची स्थिती, ९६ दिवस',
  en: 'Ramesh — AFTER state, 96 days',
};

function toDevanagari(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

function yesNo(value: boolean | null): Bilingual {
  if (value === null) return UNANSWERED;
  return value ? { mr: 'होय', en: 'Yes' } : { mr: 'नाही', en: 'No' };
}

function readSavedProfile(): IntakeProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(INTAKE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<IntakeProfile>;
    if (
      parsed.version !== 1 ||
      typeof parsed.workType !== 'string' ||
      typeof parsed.age !== 'number' ||
      typeof parsed.constructionDays !== 'number'
    ) {
      return null;
    }
    return parsed as IntakeProfile;
  } catch {
    return null;
  }
}

// Shows the Marathi or English string first, the other language beneath it.
function Bi({
  mr,
  en,
  isMarathi,
  className = '',
}: {
  mr: string;
  en: string;
  isMarathi: boolean;
  className?: string;
}) {
  return (
    <span className={`block min-w-0 break-words ${className}`.trim()}>
      <span className="block">{isMarathi ? mr : en}</span>
      <span className="block text-xs text-muted-foreground">{isMarathi ? en : mr}</span>
    </span>
  );
}

function CropBox({ doc, isMarathi }: { doc: Bilingual; isMarathi: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-[var(--radius)] border border-dashed border-border p-2">
      <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded bg-muted text-center text-xs text-muted-foreground">
        {isMarathi ? 'क्रॉप नाही' : 'No crop'}
      </div>
      <div className="min-w-0 text-xs">
        <Bi mr={doc.mr} en={doc.en} isMarathi={isMarathi} />
        <span className="mt-1 block text-muted-foreground">
          <Bi
            mr="दस्तऐवजाची प्रतिमा अजून जोडलेली नाही."
            en="No document image attached yet."
            isMarathi={isMarathi}
          />
        </span>
      </div>
    </div>
  );
}

function Section({
  title,
  isMarathi,
  children,
}: {
  title: Bilingual;
  isMarathi: boolean;
  children: ReactNode;
}) {
  return (
    <section className={CARD}>
      <h2 className="text-base font-semibold">
        <Bi mr={title.mr} en={title.en} isMarathi={isMarathi} />
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function PreFilledPack() {
  const { isMarathi } = useLanguage();
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<IntakeProfile | null>(null);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  // Storage is read only after mount so server and client markup match.
  useEffect(() => {
    setSaved(readSavedProfile());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p className="p-6 text-muted-foreground">
        <Bi mr="लोड होत आहे…" en="Loading…" isMarathi={isMarathi} />
      </p>
    );
  }

  const usingSaved = saved !== null;
  const profile: IntakeProfile = saved ?? (RAMESH_AFTER_PROFILE as unknown as IntakeProfile);
  const days = profile.constructionDays;

  const fields: PackField[] = [
    {
      key: 'work',
      label: { mr: 'कामाचा प्रकार', en: 'Type of work' },
      value: WORK_LABEL[profile.workType] ?? UNANSWERED,
      answered: true,
      source: 'self',
    },
    {
      key: 'days',
      label: { mr: 'गेल्या १२ महिन्यांत काम (दिवस)', en: 'Days worked in last 12 months' },
      value: { mr: `${toDevanagari(days)} दिवस`, en: `${days} days` },
      answered: true,
      source: 'document',
      doc: {
        mr: 'कामाचा पुरावा — मालक/ठेकेदाराचे पत्र किंवा हजेरी',
        en: 'Proof of work — employer or contractor letter, or attendance record',
      },
    },
    {
      key: 'age',
      label: { mr: 'वय', en: 'Age' },
      value: { mr: `${toDevanagari(profile.age)} वर्षे`, en: `${profile.age} years` },
      answered: true,
      source: 'self',
    },
    {
      key: 'bank',
      label: { mr: 'बँक खाते', en: 'Bank account' },
      value: yesNo(profile.bankAccount ?? null),
      answered: (profile.bankAccount ?? null) !== null,
      source: 'document',
      doc: { mr: 'बँक पासबुक / खात्याचा तपशील', en: 'Bank passbook / account details' },
    },
    {
      key: 'epfo',
      label: { mr: 'EPFO / ESIC', en: 'EPFO / ESIC' },
      value: yesNo(profile.epfoEsic ?? null),
      answered: (profile.epfoEsic ?? null) !== null,
      source: 'self',
    },
    {
      key: 'married',
      label: { mr: 'लग्न झाले आहे का?', en: 'Married?' },
      value: yesNo(profile.married ?? null),
      answered: (profile.married ?? null) !== null,
      source: 'self',
    },
    {
      key: 'school',
      label: { mr: 'मुले शाळेत आहेत का?', en: 'School-going children?' },
      value: yesNo(profile.schoolChildren ?? null),
      answered: (profile.schoolChildren ?? null) !== null,
      source: 'self',
    },
    {
      key: 'tax',
      label: { mr: 'आयकर भरता का?', en: 'Income-tax payer?' },
      value: yesNo(profile.incomeTaxPayer ?? null),
      answered: (profile.incomeTaxPayer ?? null) !== null,
      source: 'self',
    },
  ];

  const schemeResults = SCHEMES.map((scheme) => ({ scheme, ...evaluateScheme(scheme, profile) }));
  const likely = schemeResults.filter((r) => r.status === 'pass');

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <header className={CARD}>
        {usingSaved && profile.sampleId ? (
          <span className="mb-3 inline-flex max-w-full rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {isMarathi ? 'नमुना व्यक्ती / Sample persona' : 'Sample persona / नमुना व्यक्ती'}
          </span>
        ) : null}
        <h1 className="text-xl font-bold sm:text-2xl">
          <Bi mr="अर्ज पॅक" en="Application pack" isMarathi={isMarathi} />
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Bi
            mr={usingSaved ? STORED_STATE_NOTE.mr : FALLBACK_STATE_NOTE.mr}
            en={usingSaved ? STORED_STATE_NOTE.en : FALLBACK_STATE_NOTE.en}
            isMarathi={isMarathi}
          />
        </p>
        <p className="mt-3 text-sm">
          <Bi
            mr="खालील माहिती तुमच्या उत्तरांवरून भरली आहे. कागदपत्रांतील माहिती तुम्ही पुष्टी केल्याशिवाय पक्की मानली जात नाही."
            en="These fields are filled from your answers. Document-based values stay unconfirmed until you confirm them."
            isMarathi={isMarathi}
          />
        </p>
      </header>

      <Section title={{ mr: 'अर्जातील माहिती', en: 'Application fields' }} isMarathi={isMarathi}>
        <dl className="divide-y divide-border">
          {fields.map((field) => {
            const isConfirmed = confirmed[field.key] === true;
            const needsConfirm = field.source === 'document' && field.answered;
            return (
              <div key={field.key} className="flex min-w-0 flex-col gap-2 py-3">
                <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:justify-between">
                  <dt className="min-w-0 text-sm text-muted-foreground">
                    <Bi mr={field.label.mr} en={field.label.en} isMarathi={isMarathi} />
                  </dt>
                  <dd className="min-w-0 text-sm font-medium">
                    {needsConfirm && !isConfirmed ? (
                      <span className="text-base font-semibold">?</span>
                    ) : (
                      <Bi mr={field.value.mr} en={field.value.en} isMarathi={isMarathi} />
                    )}
                  </dd>
                </div>
                {needsConfirm ? (
                  <div className="space-y-2">
                    <CropBox doc={field.doc ?? field.label} isMarathi={isMarathi} />
                    {isConfirmed ? (
                      <p className="text-xs text-success">
                        <Bi
                          mr="तुम्ही ही माहिती पुष्टी केली आहे."
                          en="You confirmed this value."
                          isMarathi={isMarathi}
                        />
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmed((c) => ({ ...c, [field.key]: true }))}
                        className="inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
                      >
                        <Bi mr="पुष्टी करा" en="Confirm" isMarathi={isMarathi} />
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </dl>
      </Section>

      <Section title={{ mr: 'योजना — बहुधा पात्र', en: 'Schemes — likely eligible' }} isMarathi={isMarathi}>
        {likely.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            <Bi
              mr="सध्या बहुधा पात्र योजना दिसत नाही."
              en="No scheme shows as likely eligible on current answers."
              isMarathi={isMarathi}
            />
          </p>
        ) : (
          <ul className="space-y-3">
            {likely.map(({ scheme }) => (
              <li key={scheme.id} className="min-w-0 rounded-[var(--radius)] border border-border p-3">
                <span
                  className={`inline-flex max-w-full rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE.pass.className}`}
                >
                  <Bi
                    mr={STATUS_STYLE.pass.label.mr}
                    en={STATUS_STYLE.pass.label.en}
                    isMarathi={isMarathi}
                  />
                </span>
                <p className="mt-2 text-sm font-semibold">
                  <Bi mr={scheme.name.mr} en={scheme.name.en} isMarathi={isMarathi} />
                </p>
                {scheme.apply_at ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <Bi
                      mr={`कुठे अर्ज करा: ${scheme.apply_at.mr}`}
                      en={`Where to apply: ${scheme.apply_at.en}`}
                      isMarathi={isMarathi}
                    />
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          <Bi
            mr="अंतिम पात्रता संबंधित सरकारी कार्यालय ठरवते."
            en="Final eligibility is decided by the relevant government office."
            isMarathi={isMarathi}
          />
        </p>
      </Section>

      <Section title={{ mr: 'इतर योजनांची स्थिती', en: 'Status of all schemes' }} isMarathi={isMarathi}>
        <ul className="divide-y divide-border">
          {schemeResults.map(({ scheme, status }) => (
            <li key={scheme.id} className="flex min-w-0 flex-col gap-1 py-2 sm:flex-row sm:justify-between">
              <span className="min-w-0 text-sm">
                <Bi mr={scheme.name.mr} en={scheme.name.en} isMarathi={isMarathi} />
              </span>
              <span
                className={`inline-flex max-w-full self-start rounded-full px-2.5 py-0.5 text-xs font-semibold sm:self-center ${STATUS_STYLE[status].className}`}
              >
                <Bi
                  mr={STATUS_STYLE[status].label.mr}
                  en={STATUS_STYLE[status].label.en}
                  isMarathi={isMarathi}
                />
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <HonestyNote />
    </div>
  );
}
