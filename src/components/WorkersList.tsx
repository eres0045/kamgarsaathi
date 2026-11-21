'use client';

import Link from 'next/link';
import HonestyNote from '@/components/HonestyNote';
import { useLanguage } from '@/hooks/useLanguage';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';

type Bilingual = { mr: string; en: string };

// Fictional sample personas (BUILD-PACKET.md §4). Ids match SampleId in StoryIntake.tsx.
const WORKERS: { id: 'ramesh' | 'arjun' | 'sunita'; name: Bilingual; summary: Bilingual }[] = [
  {
    id: 'ramesh',
    name: { mr: 'रमेश', en: 'Ramesh' },
    summary: { mr: 'गवंडी · वय ४१', en: 'Mason · Age 41' },
  },
  {
    id: 'arjun',
    name: { mr: 'अर्जुन', en: 'Arjun' },
    summary: { mr: 'डिलिव्हरी रायडर · वय २४', en: 'Delivery rider · Age 24' },
  },
  {
    id: 'sunita',
    name: { mr: 'सुनीता', en: 'Sunita' },
    summary: { mr: 'मदतनीस · वय ३५', en: 'Helper · Age 35' },
  },
];

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

export default function WorkersList() {
  const { isMarathi } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <header className={CARD}>
        <h1 className="text-xl font-bold sm:text-2xl">
          <Bi mr="कामगार यादी" en="Worker list" isMarathi={isMarathi} />
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <Bi
            mr="सध्या ही नमुना व्यक्ती आहेत. कोणावर क्लिक करून त्यांची माहिती आणि योजनांची स्थिती पहा."
            en="These are sample personas for now. Tap one to see their profile and scheme status."
            isMarathi={isMarathi}
          />
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {WORKERS.map((w) => (
          <li key={w.id} className="min-w-0">
            <Link
              href={`/workers/${w.id}`}
              className="block w-full min-w-0 rounded-[var(--radius)] border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="inline-flex max-w-full rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {isMarathi ? 'नमुना व्यक्ती / Sample persona' : 'Sample persona / नमुना व्यक्ती'}
              </span>
              <span className="mt-3 block truncate text-base font-semibold">
                <Bi mr={w.name.mr} en={w.name.en} isMarathi={isMarathi} />
              </span>
              <span className="mt-2 block text-sm">
                <Bi mr={w.summary.mr} en={w.summary.en} isMarathi={isMarathi} />
              </span>
              <span className="mt-3 block text-sm font-semibold text-primary">
                <Bi mr="तपशील पहा" en="View details" isMarathi={isMarathi} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <HonestyNote />
    </div>
  );
}
