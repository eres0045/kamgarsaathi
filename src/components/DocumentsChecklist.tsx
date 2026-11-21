'use client';

import { useEffect, useState, type ReactNode } from 'react';
import HonestyNote from '@/components/HonestyNote';
import { INTAKE_STORAGE_KEY } from '@/components/StoryIntake';
import { useLanguage } from '@/hooks/useLanguage';
import {
  SAMPLE_IMAGE,
  SAMPLE_NOTE,
  extractSampleCertificate,
  sampleCertificateDataUri,
  toMarathiDigits,
  type Box,
} from '@/lib/certificateExtract';
import { RAMESH_AFTER_PROFILE, type Bilingual, type RuleProfile } from '@/lib/ruleEngine';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';
const BTN = 'rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-50';
const BTN_GHOST = 'rounded-md border border-border px-3 py-1.5 text-sm font-semibold';
const CHOICE_ON = 'rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground';

export const DOCUMENTS_STORAGE_KEY = 'kamgarsaathi.documentChecklist';
const GATE_DAYS = 90;
const CROP_MAX_W = 260;
const CROP_MAX_H = 56;

type DocStatus = 'have' | 'missing' | 'unknown';
type DocId = 'gateCertificate' | 'bankPassbook' | 'incomeCertificate' | 'ageProof' | 'passportPhotos';

// Stored in localStorage. Holds only statuses and the days the user confirmed. No Aadhaar, no account number.
type Stored = { statuses: Partial<Record<DocId, DocStatus>>; confirmedDays: number | null };

type DocInfo = {
  id: DocId;
  name: Bilingual;
  whereToGet: Bilingual;
  cost: Bilingual | null;
  days: Bilingual | null;
  appeal: Bilingual | null;
  note: Bilingual;
};

// The five documents from BUILD-PACKET.md §5 that the app tracks. Aadhaar is deliberately not listed.
// Packet text is quoted; Marathi detail wording is a working translation.
const DOCUMENTS: DocInfo[] = [
  {
    id: 'gateCertificate',
    name: { mr: '९० दिवसांचे कामाचे प्रमाणपत्र', en: '90-day work certificate' },
    whereToGet: { mr: 'नियोक्ता / कंत्राटदार', en: 'Employer / contractor' },
    cost: { mr: 'तपासा', en: 'Check' },
    days: { mr: 'तपासा', en: 'Check' },
    appeal: null,
    note: {
      mr: 'हे गेट कागदपत्र आहे — याशिवाय पुढे काहीही सरकत नाही.',
      en: 'This is the gate document; without it nothing else moves.',
    },
  },
  {
    id: 'bankPassbook',
    name: { mr: 'बँक पासबुक / खाते तपशील', en: 'Bank passbook / account details' },
    whereToGet: { mr: 'तुमची बँक शाखा', en: 'Your bank branch' },
    cost: { mr: 'तपासा', en: 'Check' },
    days: null,
    appeal: null,
    note: {
      mr: 'DBT साठी खाते. खाते क्रमांक या अॅपमध्ये साठवला जात नाही.',
      en: 'Account for direct benefit transfer (DBT). The account number is not stored in this app.',
    },
  },
  {
    id: 'incomeCertificate',
    name: { mr: 'उत्पन्न प्रमाणपत्र', en: 'Income certificate' },
    whereToGet: {
      mr: 'नागपूर तहसील / सेतू सेवा केंद्र / आपले सरकार पोर्टल',
      en: 'Nagpur tahsil / Setu Seva Kendra / Aaple Sarkar portal',
    },
    cost: null,
    days: { mr: '१५ दिवस', en: '15 days' },
    appeal: {
      mr: 'पहिले अपील: तहसीलदार · दुसरे अपील: उपविभागीय अधिकारी (SDO)',
      en: 'First appeal: Tahsildar · Second appeal: SDO',
    },
    note: { mr: 'जारी करणारा: नायब तहसीलदार.', en: 'Issued by: Naib Tahsildar.' },
  },
  {
    id: 'ageProof',
    name: { mr: 'वयाचा पुरावा', en: 'Age proof' },
    whereToGet: { mr: 'लागू असेल तिथे', en: 'Where applicable' },
    cost: { mr: 'तपासा', en: 'Check' },
    days: { mr: 'तपासा', en: 'Check' },
    appeal: null,
    note: {
      mr: 'उदा. जन्म प्रमाणपत्र किंवा शाळा सोडल्याचा दाखला.',
      en: 'e.g. birth certificate or school leaving certificate.',
    },
  },
  {
    id: 'passportPhotos',
    name: { mr: 'पासपोर्ट साईझ फोटो', en: 'Passport-size photos' },
    whereToGet: { mr: 'कोणताही फोटो स्टुडिओ', en: 'Any photo studio' },
    cost: null,
    days: null,
    appeal: null,
    note: {
      mr: '२–४ प्रती (अचूक संख्या पोर्टलवर तपासा).',
      en: '2–4 copies (check the exact count at the portal).',
    },
  },
];

const STATUS_TEXT: Record<DocStatus, Bilingual> = {
  have: { mr: 'आहे', en: 'Have' },
  missing: { mr: 'नाही', en: 'Missing' },
  unknown: { mr: 'तपासा', en: 'Check this' },
};
const STATUS_ICON: Record<DocStatus, string> = { have: '✓', missing: '✗', unknown: '?' };
const STATUS_COLOR: Record<DocStatus, string> = {
  have: 'text-success',
  missing: 'text-destructive',
  unknown: 'text-muted-foreground',
};
const CHOICES: DocStatus[] = ['have', 'missing', 'unknown'];

const LABEL_WHERE: Bilingual = { mr: 'कुठे मिळवाल', en: 'Where to get it' };
const LABEL_COST: Bilingual = { mr: 'शुल्क', en: 'Cost' };
const LABEL_DAYS: Bilingual = { mr: 'किती दिवस', en: 'Days' };
const LABEL_APPEAL: Bilingual = { mr: 'अपील अधिकारी', en: 'Appeal officer' };

function isStatus(value: unknown): value is DocStatus {
  return value === 'have' || value === 'missing' || value === 'unknown';
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

// Crops the sample certificate image to one extracted box. No box means no crop, so show "?".
function Crop({ src, box, label }: { src: string; box: Box | null; label: string }) {
  if (!box) {
    return (
      <div
        role="img"
        aria-label={label}
        className="flex h-14 w-32 shrink-0 items-center justify-center rounded border border-dashed border-border text-2xl text-muted-foreground"
      >
        ?
      </div>
    );
  }
  const scale = Math.min(CROP_MAX_W / box.w, CROP_MAX_H / box.h);
  return (
    <div
      role="img"
      aria-label={label}
      className="shrink-0 overflow-hidden rounded border border-border bg-white"
      style={{
        width: box.w * scale,
        height: box.h * scale,
        backgroundImage: `url("${src}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${SAMPLE_IMAGE.width * scale}px auto`,
        backgroundPosition: `${-box.x * scale}px ${-box.y * scale}px`,
      }}
    />
  );
}

// Reads the saved intake profile. Falls back to the Ramesh AFTER sample when absent or unreadable.
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

// Days of construction work from the profile, or null when the profile does not have a usable count.
function profileDays(profile: RuleProfile): number | null {
  const value = profile.constructionDays;
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function readStored(): Stored {
  const empty: Stored = { statuses: {}, confirmedDays: null };
  try {
    const raw = window.localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    if (!raw) return empty;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return empty;
    const record = parsed as { statuses?: unknown; confirmedDays?: unknown };
    const statuses: Partial<Record<DocId, DocStatus>> = {};
    if (record.statuses && typeof record.statuses === 'object') {
      const map = record.statuses as Record<string, unknown>;
      for (const doc of DOCUMENTS) {
        const value = map[doc.id];
        if (isStatus(value)) statuses[doc.id] = value;
      }
    }
    const confirmedDays =
      typeof record.confirmedDays === 'number' && Number.isInteger(record.confirmedDays) ? record.confirmedDays : null;
    return { statuses, confirmedDays };
  } catch {
    // Unreadable storage is treated as nothing saved.
    return empty;
  }
}

function writeStored(next: Stored): void {
  try {
    window.localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be full or blocked; the change still shows on screen.
  }
}

function DetailRow({ label, value, isMarathi }: { label: Bilingual; value: Bilingual; isMarathi: boolean }) {
  return (
    <div className="min-w-0 text-sm">
      <span className="text-xs text-muted-foreground">
        <Bi mr={label.mr} en={label.en} isMarathi={isMarathi} />
      </span>
      <span className="font-medium">
        <Bi mr={value.mr} en={value.en} isMarathi={isMarathi} />
      </span>
    </div>
  );
}

// The gate document: the crop sits beside the extracted days, and nothing counts until Confirm is tapped.
function CertificateProof({
  days,
  confirmed,
  isMarathi,
  onConfirm,
  onUndo,
}: {
  days: number;
  confirmed: boolean;
  isMarathi: boolean;
  onConfirm: () => void;
  onUndo: () => void;
}) {
  const extraction = extractSampleCertificate(days);
  const src = sampleCertificateDataUri(extraction);
  const short = GATE_DAYS - days;
  const gateLine: Bilingual =
    short <= 0
      ? { mr: `✓ ${toMarathiDigits(GATE_DAYS)} दिवस: ${toMarathiDigits(days)} दिवस दाखवले`, en: `✓ ${GATE_DAYS} days: ${days} days shown` }
      : { mr: `फक्त ${toMarathiDigits(short)} दिवस कमी आहेत.`, en: `Only ${short} days short.` };

  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
      <Crop src={src} box={extraction.days.box} label="Certificate days crop" />
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-xs text-muted-foreground">
          <Bi mr="प्रमाणपत्रावरील दिवस" en="Days on the certificate" isMarathi={isMarathi} />
        </p>
        <p className="break-words text-base font-semibold">
          <Bi mr={`${toMarathiDigits(days)} दिवस`} en={`${days} days`} isMarathi={isMarathi} />
        </p>
        <p className="text-xs text-muted-foreground">
          <Bi mr="नमुना — तुमच्या फोटोवरून वाचलेले नाही" en={SAMPLE_NOTE} isMarathi={isMarathi} />
        </p>

        {confirmed ? (
          <div className="space-y-2">
            <Pill>{isMarathi ? 'पुष्टी झाली / Confirmed' : 'Confirmed / पुष्टी झाली'}</Pill>
            <p className="text-sm font-medium">
              <Bi mr={gateLine.mr} en={gateLine.en} isMarathi={isMarathi} />
            </p>
            <button type="button" onClick={onUndo} className={`${BTN_GHOST} print:hidden`}>
              {isMarathi ? 'रद्द करा / Undo' : 'Undo / रद्द करा'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <Bi mr="हे बरोबर आहे का?" en="Is this right?" isMarathi={isMarathi} />
            </p>
            <button type="button" onClick={onConfirm} className={`${BTN} print:hidden`}>
              {isMarathi ? 'पुष्टी करा / Confirm' : 'Confirm / पुष्टी करा'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DocumentsChecklist() {
  const { isMarathi } = useLanguage();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<RuleProfile>(RAMESH_AFTER_PROFILE);
  const [isSample, setIsSample] = useState(true);
  const [stored, setStored] = useState<Stored>({ statuses: {}, confirmedDays: null });

  // Reads the saved profile and checklist only after mount, so server and client markup match.
  useEffect(() => {
    const loaded = readProfile();
    setProfile(loaded.profile);
    setIsSample(loaded.isSample);
    setStored(readStored());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <p className="p-6 text-muted-foreground">
        <Bi mr="लोड होत आहे…" en="Loading…" isMarathi={isMarathi} />
      </p>
    );
  }

  const days = profileDays(profile);
  // Certificate status comes only from a confirmed extraction matching the current days. Missing days stay "check".
  const certificateStatus: DocStatus =
    days === null ? 'unknown' : days === 0 ? 'missing' : stored.confirmedDays === days ? 'have' : 'unknown';

  function statusOf(id: DocId): DocStatus {
    if (id === 'gateCertificate') return certificateStatus;
    return stored.statuses[id] ?? 'unknown';
  }

  function setStatus(id: DocId, status: DocStatus) {
    const next: Stored = { ...stored, statuses: { ...stored.statuses, [id]: status } };
    setStored(next);
    writeStored(next);
  }

  function setConfirmedDays(value: number | null) {
    const next: Stored = { ...stored, confirmedDays: value };
    setStored(next);
    writeStored(next);
  }

  const haveCount = DOCUMENTS.filter((doc) => statusOf(doc.id) === 'have').length;
  const total = DOCUMENTS.length;
  const packReady = haveCount === total;
  const percent = Math.round((haveCount / total) * 100);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <header className={CARD}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {isSample ? <Pill>{isMarathi ? 'नमुना व्यक्ती / Sample persona' : 'Sample persona / नमुना व्यक्ती'}</Pill> : null}
          </div>
          <button type="button" onClick={() => window.print()} className={`${BTN_GHOST} print:hidden`}>
            {isMarathi ? 'यादी छापा / Print list' : 'Print list / यादी छापा'}
          </button>
        </div>
        <h1 className="mt-2 text-xl font-bold sm:text-2xl">
          <Bi mr="कागदपत्रांची यादी" en="Document checklist" isMarathi={isMarathi} />
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          <Bi
            mr="बहुधा पात्र — हमी नाही. 'तपासा' म्हणजे अजून तपासायचे; ते 'आहे' म्हणून दाखवले जात नाही."
            en="Likely eligible — not a guarantee. 'Check this' means still to be checked; it is never shown as 'Have'."
            isMarathi={isMarathi}
          />
        </p>
      </header>

      <section className={`${CARD} space-y-3`} aria-label="Progress / तयारी">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">
            <Bi mr="तयारी" en="Progress" isMarathi={isMarathi} />
          </h2>
          <p className="text-sm font-semibold">
            <Bi
              mr={`${toMarathiDigits(total)} पैकी ${toMarathiDigits(haveCount)} तयार`}
              en={`${haveCount} of ${total} ready`}
              isMarathi={isMarathi}
            />
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={haveCount}>
          <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
        {packReady ? (
          <p className="text-sm font-semibold text-success">
            <Bi mr="तुमचा पॅक तयार आहे!" en="Your pack is ready!" isMarathi={isMarathi} />
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Bi
              mr="पॅक तयार होण्यासाठी सर्व कागदपत्रे 'आहे' असावीत."
              en="All documents need to be marked 'Have' before the pack is ready."
              isMarathi={isMarathi}
            />
          </p>
        )}
      </section>

      <ol className="space-y-4">
        {DOCUMENTS.map((doc, position) => {
          const status = statusOf(doc.id);
          return (
            <li key={doc.id} className={`${CARD} space-y-3`} aria-label={doc.name.en}>
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {isMarathi ? `कागदपत्र ${toMarathiDigits(position + 1)}` : `Document ${position + 1}`}
                  </p>
                  <h2 className="text-base font-semibold">
                    <Bi mr={doc.name.mr} en={doc.name.en} isMarathi={isMarathi} />
                  </h2>
                </div>
                <span className={`inline-flex items-center gap-1 text-sm font-semibold ${STATUS_COLOR[status]}`}>
                  <span aria-hidden="true">{STATUS_ICON[status]}</span>
                  <Bi mr={STATUS_TEXT[status].mr} en={STATUS_TEXT[status].en} isMarathi={isMarathi} />
                </span>
              </div>

              {doc.id === 'gateCertificate' ? (
                days === null ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <Bi mr="कामाचे दिवस प्रोफाइलमध्ये नाहीत — तपासा." en="Work days are not in the profile — check this." isMarathi={isMarathi} />
                    </p>
                    <Crop src="" box={null} label="Certificate days not available" />
                  </div>
                ) : days === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    <Bi
                      mr="प्रमाणपत्र अजून नाही — नियोक्ता / कंत्राटदाराकडून मिळवा."
                      en="No certificate yet — get it from your employer / contractor."
                      isMarathi={isMarathi}
                    />
                  </p>
                ) : (
                  <CertificateProof
                    days={days}
                    confirmed={stored.confirmedDays === days}
                    isMarathi={isMarathi}
                    onConfirm={() => setConfirmedDays(days)}
                    onUndo={() => setConfirmedDays(null)}
                  />
                )
              ) : (
                <div className="flex flex-wrap gap-2 print:hidden" role="group" aria-label={`${doc.name.en} status`}>
                  {CHOICES.map((choice) => {
                    const on = status === choice;
                    return (
                      <button
                        key={choice}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setStatus(doc.id, choice)}
                        className={on ? CHOICE_ON : BTN_GHOST}
                      >
                        {`${STATUS_TEXT[choice].mr} / ${STATUS_TEXT[choice].en}`}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                <DetailRow label={LABEL_WHERE} value={doc.whereToGet} isMarathi={isMarathi} />
                {doc.cost ? <DetailRow label={LABEL_COST} value={doc.cost} isMarathi={isMarathi} /> : null}
                {doc.days ? <DetailRow label={LABEL_DAYS} value={doc.days} isMarathi={isMarathi} /> : null}
                {doc.appeal ? <DetailRow label={LABEL_APPEAL} value={doc.appeal} isMarathi={isMarathi} /> : null}
              </div>
              <p className="text-sm text-muted-foreground">
                <Bi mr={doc.note.mr} en={doc.note.en} isMarathi={isMarathi} />
              </p>
            </li>
          );
        })}
      </ol>

      <HonestyNote />
    </div>
  );
}
