'use client';

import { useEffect, useState, type ReactNode } from 'react';
import HonestyNote from '@/components/HonestyNote';
import { useLanguage } from '@/hooks/useLanguage';
import {
  SAMPLE_IMAGE,
  extractSampleCertificate,
  sampleCertificateDataUri,
  toMarathiDigits,
  type Box,
  type CertificateExtraction,
} from '@/lib/certificateExtract';
import type { Bilingual } from '@/lib/ruleEngine';

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';
const BTN = 'rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-50';
const BTN_GHOST = 'rounded-md border border-border px-3 py-1.5 text-sm font-semibold';

export const GATE_PROOF_STORAGE_KEY = 'kamgarsaathi.gateProof';
const GATE_DAYS = 90;
const CROP_MAX_W = 260;
const CROP_MAX_H = 56;

const SCENARIO_DAYS = { before: 82, after: 96 } as const;
type Scenario = keyof typeof SCENARIO_DAYS;

type FieldKey = 'days' | 'employer' | 'period';
type FieldState = { text: string; confirmed: boolean; editing: boolean };
type FieldsState = Record<FieldKey, FieldState>;

const DAYS_PATTERN = /^\d{1,3}$/;

function fieldsFrom(extraction: CertificateExtraction): FieldsState {
  const fresh = (text: string): FieldState => ({ text, confirmed: false, editing: false });
  return {
    days: fresh(String(extraction.days.value)),
    employer: fresh(extraction.employer.value),
    period: fresh(extraction.period.value),
  };
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

// Crops the certificate image to one extracted box. No box means no crop, so show "?".
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

type RowProps = {
  label: Bilingual;
  field: FieldState;
  box: Box | null;
  src: string;
  display: Bilingual | null;
  valid: boolean;
  numeric?: boolean;
  isMarathi: boolean;
  onChange: (text: string) => void;
  onEdit: () => void;
  onDone: () => void;
  onConfirm: () => void;
};

function FieldRow({ label, field, box, src, display, valid, numeric, isMarathi, onChange, onEdit, onDone, onConfirm }: RowProps) {
  const labelText = isMarathi ? label.mr : label.en;
  return (
    <div className="flex min-w-0 flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-start">
      <Crop src={src} box={box} label={label.en} />
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-xs text-muted-foreground">{labelText}</p>

        {field.editing ? (
          <div className="flex flex-wrap items-center gap-2">
            <input
              aria-label={label.en}
              value={field.text}
              inputMode={numeric ? 'numeric' : 'text'}
              onChange={(e) => onChange(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1 text-sm"
            />
            <button type="button" onClick={onDone} className={BTN_GHOST}>
              {isMarathi ? 'पूर्ण / Done' : 'Done / पूर्ण'}
            </button>
          </div>
        ) : (
          <p className="break-words text-base font-semibold">
            {display ? <Bi mr={display.mr} en={display.en} isMarathi={isMarathi} /> : field.text}
          </p>
        )}

        {field.editing ? null : field.confirmed ? (
          <Pill>{isMarathi ? 'पुष्टी झाली / Confirmed' : 'Confirmed / पुष्टी झाली'}</Pill>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <Bi mr="हे बरोबर आहे का?" en="Is this right?" isMarathi={isMarathi} />
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={onConfirm} disabled={!valid} className={BTN}>
                {isMarathi ? 'पुष्टी करा / Confirm' : 'Confirm / पुष्टी करा'}
              </button>
              <button type="button" onClick={onEdit} className={BTN_GHOST}>
                {isMarathi ? 'बदला / Edit' : 'Edit / बदला'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GateProofMoment() {
  const { isMarathi } = useLanguage();
  const [ready, setReady] = useState(false);
  const [savedDays, setSavedDays] = useState<number | null>(null);
  const [scenario, setScenario] = useState<Scenario>('after');
  const [fields, setFields] = useState<FieldsState>(() => fieldsFrom(extractSampleCertificate(SCENARIO_DAYS.after)));
  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const extraction = extractSampleCertificate(SCENARIO_DAYS[scenario]);
  const sampleSrc = sampleCertificateDataUri(extraction);
  const previewSrc = objectUrl ?? sampleSrc;

  // Reads the saved days only after mount, so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(GATE_PROOF_STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed === 'number' && Number.isInteger(parsed)) setSavedDays(parsed);
      }
    } catch {
      // Unreadable storage is treated as nothing saved.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!ready) {
    return (
      <p className="p-6 text-muted-foreground">
        <Bi mr="लोड होत आहे…" en="Loading…" isMarathi={isMarathi} />
      </p>
    );
  }

  const daysConfirmed = fields.days.confirmed;
  const daysNumber = Number(fields.days.text);
  const gate: 'unknown' | 'open' | 'short' = !daysConfirmed
    ? 'unknown'
    : daysNumber >= GATE_DAYS
      ? 'open'
      : 'short';
  const shortfall = GATE_DAYS - daysNumber;

  const GATE_STYLE = {
    unknown: 'border-border',
    open: 'border-success bg-success/10',
    short: 'border-destructive bg-destructive/10',
  } as const;

  function chooseScenario(next: Scenario) {
    setScenario(next);
    setFields(fieldsFrom(extractSampleCertificate(SCENARIO_DAYS[next])));
    setSavedDays(null);
  }

  function setField(key: FieldKey, patch: Partial<FieldState>) {
    setFields((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  function confirmField(key: FieldKey) {
    setField(key, { confirmed: true, editing: false });
    if (key === 'days') {
      const n = Number(fields.days.text);
      try {
        window.localStorage.setItem(GATE_PROOF_STORAGE_KEY, JSON.stringify(n));
        setSavedDays(n);
      } catch {
        // Storage may be full or blocked; the confirmation still shows on screen.
      }
    }
  }

  function editField(key: FieldKey) {
    setField(key, { confirmed: false, editing: true });
    if (key === 'days') {
      try {
        window.localStorage.removeItem(GATE_PROOF_STORAGE_KEY);
      } catch {
        // Nothing to remove if storage is blocked.
      }
      setSavedDays(null);
    }
  }

  function changeField(key: FieldKey, text: string) {
    setField(key, { text, confirmed: false });
  }

  const daysValid = DAYS_PATTERN.test(fields.days.text);
  const employerValid = fields.employer.text.trim().length > 0;
  const periodValid = fields.period.text.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
      <header className={CARD}>
        <h1 className="text-xl font-bold sm:text-2xl">
          <Bi mr="दार उघडले का? ९० दिवस तपासा" en="Gate check: 90 days" isMarathi={isMarathi} />
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          <Bi
            mr="प्रमाणपत्राची मूल्ये तुम्ही पुष्टी केल्यावरच गणली जातात."
            en="Values count only after you confirm them."
            isMarathi={isMarathi}
          />
        </p>
      </header>

      <section className={`${CARD} space-y-3`} aria-label={isMarathi ? 'प्रमाणपत्र' : 'Certificate'}>
        <div role="group" aria-label={isMarathi ? 'कालावधी निवडा' : 'Choose period'} className="flex flex-wrap gap-2">
          {(Object.keys(SCENARIO_DAYS) as Scenario[]).map((key) => {
            const active = scenario === key;
            const label = key === 'before' ? { mr: 'आधी', en: 'Before' } : { mr: 'नंतर', en: 'After' };
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => chooseScenario(key)}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${active ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}
              >
                <Bi
                  mr={`${label.mr} — ${toMarathiDigits(SCENARIO_DAYS[key])} दिवस`}
                  en={`${label.en} — ${SCENARIO_DAYS[key]} days`}
                  isMarathi={isMarathi}
                />
              </button>
            );
          })}
        </div>

        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt={isMarathi ? 'प्रमाणपत्राचा फोटो' : 'Certificate photo'}
            className="max-h-72 w-full rounded-md border border-border bg-muted object-contain"
          />
          {file ? null : (
            <span className="absolute right-2 top-2">
              <Pill>{isMarathi ? 'नमुना / Sample' : 'Sample / नमुना'}</Pill>
            </span>
          )}
        </div>

        <label className="block space-y-1 text-sm">
          <Bi mr="तुमचा प्रमाणपत्र फोटो निवडा" en="Choose your certificate photo" isMarathi={isMarathi} />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
        </label>

        <p className="text-sm text-muted-foreground">
          <Bi
            mr={file
              ? 'तुमचा फोटो दाखवला आहे; खालील मूल्ये नमुना आहेत — फोटो वाचला नाही.'
              : 'नमुना प्रमाणपत्र दाखवले आहे.'}
            en={file
              ? 'Your photo is shown; the values below are sample values — the photo was not read.'
              : 'Sample certificate shown.'}
            isMarathi={isMarathi}
          />
        </p>
        <p className="text-xs text-muted-foreground">
          <Bi mr="नमुना काढणी — तुमचा फोटो वाचला नाही" en={extraction.note} isMarathi={isMarathi} />
        </p>

        <FieldRow
          label={{ mr: 'दिवस', en: 'Days' }}
          field={fields.days}
          box={extraction.days.box}
          src={previewSrc}
          display={daysConfirmed || daysValid
            ? { mr: `${toMarathiDigits(fields.days.text)} दिवस`, en: `${fields.days.text} days` }
            : null}
          valid={daysValid}
          numeric
          isMarathi={isMarathi}
          onChange={(text) => changeField('days', text)}
          onEdit={() => editField('days')}
          onDone={() => setField('days', { editing: false })}
          onConfirm={() => confirmField('days')}
        />
        <FieldRow
          label={{ mr: 'नियोक्ता', en: 'Employer' }}
          field={fields.employer}
          box={extraction.employer.box}
          src={previewSrc}
          display={null}
          valid={employerValid}
          isMarathi={isMarathi}
          onChange={(text) => changeField('employer', text)}
          onEdit={() => editField('employer')}
          onDone={() => setField('employer', { editing: false })}
          onConfirm={() => confirmField('employer')}
        />
        <FieldRow
          label={{ mr: 'कालावधी', en: 'Period' }}
          field={fields.period}
          box={extraction.period.box}
          src={previewSrc}
          display={null}
          valid={periodValid}
          isMarathi={isMarathi}
          onChange={(text) => changeField('period', text)}
          onEdit={() => editField('period')}
          onDone={() => setField('period', { editing: false })}
          onConfirm={() => confirmField('period')}
        />
      </section>

      <section className={`${CARD} space-y-3 border-2 ${GATE_STYLE[gate]}`} aria-label={isMarathi ? '९० दिवस गेट' : '90-day gate'}>
        {gate === 'unknown' ? (
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="text-3xl font-bold text-muted-foreground">?</span>
            <p className="text-sm text-muted-foreground">
              <Bi mr="दिवस पुष्टी केल्यावर निकाल दिसेल" en="The result appears after you confirm the days" isMarathi={isMarathi} />
            </p>
          </div>
        ) : gate === 'open' ? (
          <div className="space-y-2 text-success">
            <p className="text-lg font-bold">
              <Bi
                mr="दार उघडले! ९० दिवस पूर्ण — तुम्ही पात्र आहात."
                en="Gate open! 90 days complete — you are eligible."
                isMarathi={isMarathi}
              />
            </p>
            <Pill>{isMarathi ? 'बहुधा पात्र / Likely eligible' : 'Likely eligible / बहुधा पात्र'}</Pill>
          </div>
        ) : (
          <div className="space-y-2 text-destructive">
            <p className="text-lg font-bold">
              <Bi
                mr={`फक्त ${toMarathiDigits(shortfall)} दिवस कमी आहेत.`}
                en={`Only ${shortfall} days short.`}
                isMarathi={isMarathi}
              />
            </p>
          </div>
        )}
      </section>

      {savedDays !== null ? (
        <p className="text-sm text-muted-foreground">
          <Bi
            mr={`सेव्ह केले: ${toMarathiDigits(savedDays)} दिवस`}
            en={`Saved: ${savedDays} days`}
            isMarathi={isMarathi}
          />
        </p>
      ) : null}

      <HonestyNote />
    </div>
  );
}
