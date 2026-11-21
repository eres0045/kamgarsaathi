'use client';

import Link from 'next/link';
import HonestyNote from '@/components/HonestyNote';
import type { IntakeProfile } from '@/components/StoryIntake';
import { useLanguage } from '@/hooks/useLanguage';
import { SCHEMES, evaluateScheme, type RuleStatus } from '@/lib/ruleEngine';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

type Bilingual = { mr: string; en: string };
type SampleKey = 'ramesh' | 'arjun' | 'sunita';
type WorkerProfile = Omit<IntakeProfile, 'savedAt'>;

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

// Fictional sample personas (BUILD-PACKET.md §4). Each id shows ONE state only.
// Ramesh is shown in the BEFORE state (82 days), the state StoryIntake seeds.
const WORKER_PROFILES: Record<SampleKey, { name: Bilingual; stateNote: Bilingual; profile: WorkerProfile }> = {
  ramesh: {
    name: { mr: 'रमेश', en: 'Ramesh' },
    stateNote: { mr: 'रमेश — पूर्वीची स्थिती, ८२ दिवस', en: 'Ramesh — BEFORE state, 82 days' },
    profile: {
      version: 1,
      source: 'sample',
      sampleId: 'ramesh',
      state: 'Maharashtra',
      workType: 'mason',
      occupation: 'construction',
      constructionDays: 82,
      age: 41,
      married: true,
      schoolChildren: true,
      bankAccount: true,
      epfoEsic: false,
      incomeTaxPayer: false,
    },
  },
  arjun: {
    name: { mr: 'अर्जुन', en: 'Arjun' },
    stateNote: { mr: 'अर्जुन — नमुना माहिती', en: 'Arjun — sample profile' },
    profile: {
      version: 1,
      source: 'sample',
      sampleId: 'arjun',
      state: 'Maharashtra',
      workType: 'delivery',
      occupation: 'gig/delivery',
      constructionDays: 0,
      age: 24,
      married: null,
      schoolChildren: null,
      bankAccount: true,
      epfoEsic: false,
      incomeTaxPayer: false,
    },
  },
  sunita: {
    name: { mr: 'सुनीता', en: 'Sunita' },
    stateNote: { mr: 'सुनीता — नमुना माहिती', en: 'Sunita — sample profile' },
    profile: {
      version: 1,
      source: 'sample',
      sampleId: 'sunita',
      state: 'Maharashtra',
      workType: 'helper',
      occupation: 'construction',
      constructionDays: 120,
      age: 35,
      married: true,
      schoolChildren: true,
      bankAccount: true,
      epfoEsic: false,
      incomeTaxPayer: false,
    },
  },
};

const SAMPLE_KEYS: string[] = ['ramesh', 'arjun', 'sunita'];

function isSampleKey(id: string): id is SampleKey {
  return SAMPLE_KEYS.includes(id);
}

function toDevanagari(value: number): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

function yesNo(value: boolean | null): Bilingual {
  if (value === null) return UNANSWERED;
  return value ? { mr: 'होय', en: 'Yes' } : { mr: 'नाही', en: 'No' };
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

export default function WorkerDetail({ id }: { id: string }) {
  const { isMarathi } = useLanguage();

  if (!isSampleKey(id)) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
        <section className={CARD}>
          <h1 className="text-xl font-bold">
            <Bi mr="कामगार सापडला नाही" en="Worker not found" isMarathi={isMarathi} />
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <Bi
              mr="ही लिंक चुकीची असू शकते. कामगार यादी पहा."
              en="This link may be wrong. Check the worker list."
              isMarathi={isMarathi}
            />
          </p>
          <Link
            href="/workers"
            className="mt-4 inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
          >
            <Bi mr="कामगार यादी" en="Worker list" isMarathi={isMarathi} />
          </Link>
        </section>
        <HonestyNote />
      </div>
    );
  }

  const worker = WORKER_PROFILES[id];
  const p = worker.profile;
  const days = p.constructionDays;

  const rows: { key: string; label: Bilingual; value: Bilingual }[] = [
    { key: 'work', label: { mr: 'कामाचा प्रकार', en: 'Type of work' }, value: WORK_LABEL[p.workType] },
    {
      key: 'days',
      label: { mr: 'गेल्या १२ महिन्यांत काम', en: 'Days worked in last 12 months' },
      value: { mr: `${toDevanagari(days)} दिवस`, en: `${days} days` },
    },
    {
      key: 'age',
      label: { mr: 'वय', en: 'Age' },
      value: { mr: `${toDevanagari(p.age)} वर्षे`, en: `${p.age} years` },
    },
    { key: 'bank', label: { mr: 'बँक खाते', en: 'Bank account' }, value: yesNo(p.bankAccount) },
    { key: 'epfo', label: { mr: 'EPFO / ESIC', en: 'EPFO / ESIC' }, value: yesNo(p.epfoEsic) },
    { key: 'married', label: { mr: 'लग्न झाले आहे का?', en: 'Married?' }, value: yesNo(p.married) },
    {
      key: 'school',
      label: { mr: 'मुले शाळेत आहेत का?', en: 'School-going children?' },
      value: yesNo(p.schoolChildren),
    },
    { key: 'tax', label: { mr: 'आयकर भरता का?', en: 'Income-tax payer?' }, value: yesNo(p.incomeTaxPayer) },
  ];

  const schemeResults = SCHEMES.map((scheme) => ({ scheme, ...evaluateScheme(scheme, p) }));

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <Link href="/workers" className="inline-block text-sm font-semibold text-primary">
        <Bi mr="← कामगार यादी" en="← Worker list" isMarathi={isMarathi} />
      </Link>

      <header className={CARD}>
        <span className="mb-3 inline-flex max-w-full rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {isMarathi ? 'नमुना व्यक्ती / Sample persona' : 'Sample persona / नमुना व्यक्ती'}
        </span>
        <h1 className="text-xl font-bold sm:text-2xl">
          <Bi mr={worker.name.mr} en={worker.name.en} isMarathi={isMarathi} />
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Bi mr={worker.stateNote.mr} en={worker.stateNote.en} isMarathi={isMarathi} />
        </p>
      </header>

      <section className={CARD}>
        <h2 className="text-base font-semibold">
          <Bi mr="प्रोफाइल" en="Profile" isMarathi={isMarathi} />
        </h2>
        <dl className="mt-3 divide-y divide-border">
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
      </section>

      <section className={CARD}>
        <h2 className="text-base font-semibold">
          <Bi mr="योजनांची स्थिती" en="Scheme status" isMarathi={isMarathi} />
        </h2>
        <ul className="mt-3 space-y-3">
          {schemeResults.map(({ scheme, status, results }) => (
            <li key={scheme.id} className="min-w-0 rounded-[var(--radius)] border border-border p-3">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:justify-between">
                <span className="min-w-0 text-sm font-semibold">
                  <Bi mr={scheme.name.mr} en={scheme.name.en} isMarathi={isMarathi} />
                </span>
                <span
                  className={`inline-flex max-w-full self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status].className}`}
                >
                  <Bi
                    mr={STATUS_STYLE[status].label.mr}
                    en={STATUS_STYLE[status].label.en}
                    isMarathi={isMarathi}
                  />
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {results
                  .filter((r) => r.status !== 'pass')
                  .map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      <Bi mr={r.reasonMr} en={r.reasonEn} isMarathi={isMarathi} />
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          <Bi
            mr="अंतिम पात्रता संबंधित सरकारी कार्यालय ठरवते."
            en="Final eligibility is decided by the relevant government office."
            isMarathi={isMarathi}
          />
        </p>
      </section>

      <HonestyNote />
    </div>
  );
}
