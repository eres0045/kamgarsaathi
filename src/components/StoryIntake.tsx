'use client';

import { useEffect, useState, type ReactNode } from 'react';
import HonestyNote from '@/components/HonestyNote';
import { useLanguage } from '@/hooks/useLanguage';

export const INTAKE_STORAGE_KEY = 'kamgarsaathi.intakeProfile';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';
const CHIP_BASE =
  'inline-flex min-w-0 max-w-full items-center rounded-full border px-3 py-1.5 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';
const MAX_DAYS = 365;
const DAY_PRESETS = [0, 30, 60, 90, 120, 180];
const AGE_PRESETS = [16, 18, 21, 24, 30, 35, 41, 50, 60];
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

type WorkType = 'mason' | 'helper' | 'painter' | 'delivery' | 'other';
type Occupation = 'construction' | 'gig/delivery' | 'other-unorganised';
type SampleId = 'ramesh' | 'arjun' | 'sunita';
type Step = 'form' | 'review' | 'saved';

// Structured fields only. No free text is stored or used for any verdict.
type Draft = {
  workType: WorkType | null;
  constructionDays: number | null;
  age: number | null;
  married: boolean | null;
  schoolChildren: boolean | null;
  bankAccount: boolean | null;
  epfoEsic: boolean | null;
  incomeTaxPayer: boolean | null;
};

export type IntakeProfile = {
  version: 1;
  source: 'sample' | 'manual';
  sampleId: SampleId | null;
  state: 'Maharashtra';
  workType: WorkType;
  occupation: Occupation;
  constructionDays: number;
  age: number;
  married: boolean | null;
  schoolChildren: boolean | null;
  bankAccount: boolean | null;
  epfoEsic: boolean | null;
  incomeTaxPayer: boolean | null;
  savedAt: string;
};

type Bilingual = { mr: string; en: string };

const WORK_ORDER: WorkType[] = ['mason', 'helper', 'painter', 'delivery', 'other'];

const WORK: Record<WorkType, Bilingual & { occupation: Occupation }> = {
  mason: { mr: 'गवंडी', en: 'Mason', occupation: 'construction' },
  helper: { mr: 'मदतनीस', en: 'Helper', occupation: 'construction' },
  painter: { mr: 'रंगारी', en: 'Painter', occupation: 'construction' },
  delivery: { mr: 'डिलिव्हरी रायडर', en: 'Delivery rider', occupation: 'gig/delivery' },
  other: { mr: 'इतर', en: 'Other', occupation: 'other-unorganised' },
};

const EMPTY_DRAFT: Draft = {
  workType: null,
  constructionDays: null,
  age: null,
  married: null,
  schoolChildren: null,
  bankAccount: null,
  epfoEsic: null,
  incomeTaxPayer: null,
};

// Fictional sample personas from BUILD-PACKET.md §4. Values not given in the packet stay unanswered (null).
const SAMPLES: { id: SampleId; name: Bilingual; draft: Draft }[] = [
  {
    id: 'ramesh',
    name: { mr: 'रमेश', en: 'Ramesh' },
    draft: {
      workType: 'mason',
      constructionDays: 82,
      age: 41,
      married: true,
      schoolChildren: true,
      bankAccount: true,
      epfoEsic: false,
      incomeTaxPayer: false,
    },
  },
  {
    id: 'arjun',
    name: { mr: 'अर्जुन', en: 'Arjun' },
    draft: {
      workType: 'delivery',
      constructionDays: 0,
      age: 24,
      married: null,
      schoolChildren: null,
      bankAccount: true,
      epfoEsic: false,
      incomeTaxPayer: false,
    },
  },
  {
    id: 'sunita',
    name: { mr: 'सुनीता', en: 'Sunita' },
    draft: {
      workType: 'helper',
      constructionDays: 120,
      age: 35,
      married: true,
      schoolChildren: true,
      bankAccount: true,
      epfoEsic: false,
      incomeTaxPayer: false,
    },
  },
];

const UNANSWERED: Bilingual = { mr: '? उत्तर नाही', en: '? Not answered' };

function toDevanagari(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

function isValidDays(value: number | null): value is number {
  return value !== null && Number.isInteger(value) && value >= 0 && value <= MAX_DAYS;
}

function yesNoValue(value: boolean | null): Bilingual {
  if (value === null) return UNANSWERED;
  return value ? { mr: 'होय', en: 'Yes' } : { mr: 'नाही', en: 'No' };
}

function buildProfile(d: Draft, sampleId: SampleId | null): IntakeProfile | null {
  const days = d.constructionDays;
  if (!d.workType || d.age === null || !isValidDays(days)) return null;
  return {
    version: 1,
    source: sampleId ? 'sample' : 'manual',
    sampleId,
    state: 'Maharashtra',
    workType: d.workType,
    occupation: WORK[d.workType].occupation,
    constructionDays: days,
    age: d.age,
    married: d.married,
    schoolChildren: d.schoolChildren,
    bankAccount: d.bankAccount,
    epfoEsic: d.epfoEsic,
    incomeTaxPayer: d.incomeTaxPayer,
    savedAt: new Date().toISOString(),
  };
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
      !WORK_ORDER.includes(parsed.workType as WorkType) ||
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

function draftFromProfile(p: IntakeProfile): Draft {
  return {
    workType: p.workType,
    constructionDays: p.constructionDays,
    age: p.age,
    married: p.married ?? null,
    schoolChildren: p.schoolChildren ?? null,
    bankAccount: p.bankAccount ?? null,
    epfoEsic: p.epfoEsic ?? null,
    incomeTaxPayer: p.incomeTaxPayer ?? null,
  };
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

function Chip({
  selected,
  onClick,
  label,
  isMarathi,
}: {
  selected: boolean;
  onClick: () => void;
  label: Bilingual;
  isMarathi: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`${CHIP_BASE} ${
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground hover:border-primary'
      }`}
    >
      <Bi mr={label.mr} en={label.en} isMarathi={isMarathi} />
    </button>
  );
}

function YesNoChips({
  value,
  onChange,
  isMarathi,
}: {
  value: boolean | null;
  onChange: (next: boolean) => void;
  isMarathi: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Chip
        selected={value === true}
        onClick={() => onChange(true)}
        label={{ mr: 'होय', en: 'Yes' }}
        isMarathi={isMarathi}
      />
      <Chip
        selected={value === false}
        onClick={() => onChange(false)}
        label={{ mr: 'नाही', en: 'No' }}
        isMarathi={isMarathi}
      />
    </div>
  );
}

function Field({
  mr,
  en,
  isMarathi,
  children,
}: {
  mr: string;
  en: string;
  isMarathi: boolean;
  children: ReactNode;
}) {
  return (
    <fieldset className="min-w-0 space-y-2">
      <legend className="mb-2 text-sm font-semibold text-foreground">
        <Bi mr={mr} en={en} isMarathi={isMarathi} />
      </legend>
      {children}
    </fieldset>
  );
}

export default function StoryIntake() {
  const { isMarathi } = useLanguage();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [sampleId, setSampleId] = useState<SampleId | null>(null);
  const [step, setStep] = useState<Step>('form');
  const [saveError, setSaveError] = useState<string | null>(null);

  // Storage is read only after mount so server and client markup match.
  useEffect(() => {
    const existing = readSavedProfile();
    if (existing) {
      setDraft(draftFromProfile(existing));
      setSampleId(existing.sampleId);
      setStep('saved');
    }
    setReady(true);
  }, []);

  // Any manual change means the profile is no longer the untouched sample.
  function patch(next: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...next }));
    setSampleId(null);
    setSaveError(null);
  }

  function applySample(id: SampleId) {
    const sample = SAMPLES.find((s) => s.id === id);
    if (!sample) return;
    setDraft(sample.draft);
    setSampleId(id);
    setSaveError(null);
    setStep('review');
  }

  const profileReady = draft.workType !== null && draft.age !== null && isValidDays(draft.constructionDays);

  function handleConfirm() {
    const profile = buildProfile(draft, sampleId);
    if (!profile) {
      setSaveError('सर्व माहिती भरा. / Please complete the required answers.');
      return;
    }
    try {
      window.localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(profile));
      setSaveError(null);
      setStep('saved');
    } catch {
      setSaveError('जतन होऊ शकले नाही. / Could not save on this device.');
    }
  }

  if (!ready) {
    return (
      <p className="p-6 text-muted-foreground">
        <Bi mr="लोड होत आहे…" en="Loading…" isMarathi={isMarathi} />
      </p>
    );
  }

  if (step === 'form') {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
        <header className={CARD}>
          <h1 className="text-xl font-bold sm:text-2xl">
            <Bi mr="तुमची कहाणी" en="Your story" isMarathi={isMarathi} />
          </h1>
          <p className="mt-2 text-sm">
            <Bi
              mr="नमस्कार! मी कामगारसाथी आहे. तुमची गोष्ट सांगा — कोणत्या योजना मिळतील, का मिळतील, आणि काय आणायचे, ते सांगतो."
              en="Hello! I am KamgarSaathi. Tell me your story — I'll tell you which schemes you'll get, why, and what to bring."
              isMarathi={isMarathi}
            />
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            <Bi
              mr="तुम्ही काय काम करता? गेल्या १२ महिन्यांत किती दिवस काम केले?"
              en="What work do you do? How many days did you work in the last 12 months?"
              isMarathi={isMarathi}
            />
          </p>
        </header>

        <section className={CARD} aria-label="Sample personas">
          <h2 className="text-base font-semibold">
            <Bi mr="नमुना व्यक्ती निवडा" en="Pick a sample persona" isMarathi={isMarathi} />
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SAMPLES.map((s) => {
              const work = s.draft.workType ? WORK[s.draft.workType] : null;
              const isSelected = sampleId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => applySample(s.id)}
                  className={`w-full min-w-0 rounded-[var(--radius)] border bg-card p-4 text-left shadow-sm transition ${
                    isSelected ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary'
                  }`}
                >
                  <span className="inline-flex max-w-full rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {isMarathi ? 'नमुना' : 'Sample persona'}
                    {' / '}
                    {isMarathi ? 'Sample persona' : 'नमुना'}
                  </span>
                  <span className="mt-3 block truncate text-base font-semibold">
                    <Bi mr={s.name.mr} en={s.name.en} isMarathi={isMarathi} />
                  </span>
                  <span className="mt-2 block text-sm">
                    <Bi
                      mr={`वय ${toDevanagari(s.draft.age ?? 0)} · ${work ? work.mr : ''}`}
                      en={`Age ${s.draft.age ?? 0} · ${work ? work.en : ''}`}
                      isMarathi={isMarathi}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className={`${CARD} space-y-5`} aria-label="Structured intake">
          <Field mr="कामाचा प्रकार" en="Type of work" isMarathi={isMarathi}>
            <div className="flex flex-wrap gap-2">
              {WORK_ORDER.map((w) => (
                <Chip
                  key={w}
                  selected={draft.workType === w}
                  onClick={() => patch({ workType: w })}
                  label={{ mr: WORK[w].mr, en: WORK[w].en }}
                  isMarathi={isMarathi}
                />
              ))}
            </div>
          </Field>

          <Field
            mr="गेल्या १२ महिन्यांत किती दिवस काम"
            en="Days worked in the last 12 months"
            isMarathi={isMarathi}
          >
            <div className="flex flex-wrap gap-2">
              {DAY_PRESETS.map((n) => (
                <Chip
                  key={n}
                  selected={draft.constructionDays === n}
                  onClick={() => patch({ constructionDays: n })}
                  label={{ mr: `${toDevanagari(n)} दिवस`, en: `${n} days` }}
                  isMarathi={isMarathi}
                />
              ))}
            </div>
            <label className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span>
                <Bi mr="दिवस (०–३६५)" en="Days (0–365)" isMarathi={isMarathi} />
              </span>
              <input
                type="number"
                min={0}
                max={MAX_DAYS}
                value={draft.constructionDays ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  patch({ constructionDays: v === '' ? null : Number(v) });
                }}
                className="w-28 rounded-[var(--radius)] border border-border bg-background px-3 py-1.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </label>
            {draft.constructionDays !== null && !isValidDays(draft.constructionDays) ? (
              <p className="text-sm text-destructive">
                <Bi mr="० ते ३६५ दरम्यान अंक टाका." en="Enter a number from 0 to 365." isMarathi={isMarathi} />
              </p>
            ) : null}
          </Field>

          <Field mr="वय" en="Age" isMarathi={isMarathi}>
            <div className="flex flex-wrap gap-2">
              {AGE_PRESETS.map((n) => (
                <Chip
                  key={n}
                  selected={draft.age === n}
                  onClick={() => patch({ age: n })}
                  label={{ mr: `${toDevanagari(n)} वर्षे`, en: `${n} years` }}
                  isMarathi={isMarathi}
                />
              ))}
            </div>
          </Field>

          <Field mr="लग्न झाले आहे का?" en="Married?" isMarathi={isMarathi}>
            <YesNoChips value={draft.married} onChange={(v) => patch({ married: v })} isMarathi={isMarathi} />
          </Field>

          <Field mr="मुले शाळेत आहेत का?" en="School-going children?" isMarathi={isMarathi}>
            <YesNoChips
              value={draft.schoolChildren}
              onChange={(v) => patch({ schoolChildren: v })}
              isMarathi={isMarathi}
            />
          </Field>

          <Field mr="बँक खाते आहे का?" en="Bank account?" isMarathi={isMarathi}>
            <YesNoChips value={draft.bankAccount} onChange={(v) => patch({ bankAccount: v })} isMarathi={isMarathi} />
          </Field>

          <Field mr="EPFO / ESIC आहे का?" en="EPFO / ESIC member?" isMarathi={isMarathi}>
            <YesNoChips value={draft.epfoEsic} onChange={(v) => patch({ epfoEsic: v })} isMarathi={isMarathi} />
          </Field>

          <Field mr="आयकर भरता का?" en="Income-tax payer?" isMarathi={isMarathi}>
            <YesNoChips
              value={draft.incomeTaxPayer}
              onChange={(v) => patch({ incomeTaxPayer: v })}
              isMarathi={isMarathi}
            />
          </Field>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <button
              type="button"
              disabled={!profileReady}
              onClick={() => setStep('review')}
              className="inline-flex w-full items-center justify-center rounded-[var(--radius)] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition disabled:opacity-50 sm:w-auto"
            >
              <Bi mr="माझे प्रोफाइल पहा" en="See my profile" isMarathi={isMarathi} />
            </button>
          </div>
        </section>

        <HonestyNote />
      </div>
    );
  }

  // Review (before confirm) and saved states share the same summary.
  const d = draft;
  const days = d.constructionDays;
  const rows: { key: string; label: Bilingual; value: Bilingual }[] = [
    {
      key: 'work',
      label: { mr: 'कामाचा प्रकार', en: 'Type of work' },
      value: d.workType ? { mr: WORK[d.workType].mr, en: WORK[d.workType].en } : UNANSWERED,
    },
    {
      key: 'days',
      label: { mr: 'गेल्या १२ महिन्यांत काम', en: 'Days worked in last 12 months' },
      value: isValidDays(days)
        ? { mr: `${toDevanagari(days)} दिवस`, en: `${days} days` }
        : UNANSWERED,
    },
    {
      key: 'age',
      label: { mr: 'वय', en: 'Age' },
      value: d.age !== null ? { mr: `${toDevanagari(d.age)} वर्षे`, en: `${d.age} years` } : UNANSWERED,
    },
    { key: 'married', label: { mr: 'लग्न झाले आहे का?', en: 'Married?' }, value: yesNoValue(d.married) },
    {
      key: 'school',
      label: { mr: 'मुले शाळेत आहेत का?', en: 'School-going children?' },
      value: yesNoValue(d.schoolChildren),
    },
    { key: 'bank', label: { mr: 'बँक खाते आहे का?', en: 'Bank account?' }, value: yesNoValue(d.bankAccount) },
    { key: 'epfo', label: { mr: 'EPFO / ESIC आहे का?', en: 'EPFO / ESIC member?' }, value: yesNoValue(d.epfoEsic) },
    { key: 'tax', label: { mr: 'आयकर भरता का?', en: 'Income-tax payer?' }, value: yesNoValue(d.incomeTaxPayer) },
  ];

  const isSaved = step === 'saved';

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <section className={CARD} aria-label="Profile summary">
        {sampleId ? (
          <span className="mb-3 inline-flex max-w-full rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {isMarathi ? 'नमुना / Sample persona' : 'Sample persona / नमुना'}
          </span>
        ) : null}
        <h1 className="text-lg font-bold sm:text-xl">
          <Bi
            mr="मी हे समजलो — बरोबर आहे का?"
            en="This is what I understood — is it right?"
            isMarathi={isMarathi}
          />
        </h1>

        {isSaved ? (
          <p className="mt-3 text-sm text-success">
            <Bi
              mr="तुमची माहिती या उपकरणावर जतन झाली आहे."
              en="Your details are saved on this device."
              isMarathi={isMarathi}
            />
          </p>
        ) : null}

        <dl className="mt-4 divide-y divide-border">
          {rows.map((row) => (
            <div key={row.key} className="flex min-w-0 flex-col gap-1 py-2 sm:flex-row sm:justify-between">
              <dt className="min-w-0 text-sm text-muted-foreground">
                <Bi mr={row.label.mr} en={row.label.en} isMarathi={isMarathi} />
              </dt>
              <dd className="min-w-0 text-sm font-medium">
                <Bi mr={row.value.mr} en={row.value.en} isMarathi={isMarathi} />
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm text-muted-foreground">
          <Bi
            mr="यानंतर योजनांचे निकाल फक्त बहुधा पात्र / likely eligible असे दिसतील."
            en="Scheme results will show as likely eligible only, never as guaranteed."
            isMarathi={isMarathi}
          />
        </p>

        {saveError ? <p className="mt-3 text-sm text-destructive">{saveError}</p> : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {!isSaved ? (
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition"
            >
              <Bi mr="होय, बरोबर आहे" en="Yes, this is right" isMarathi={isMarathi} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setStep('form')}
            className="inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <Bi mr="बदला" en="Edit" isMarathi={isMarathi} />
          </button>
        </div>
      </section>

      <HonestyNote />
    </div>
  );
}
