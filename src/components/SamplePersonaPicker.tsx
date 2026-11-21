'use client';

import { useEffect, useState } from 'react';
import { createPersonaProfile, getPersonas } from '@/lib/api';
import type { Persona } from '@/types/persona';
import type { Profile } from '@/types/profile';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocalProfile } from '@/hooks/useLocalProfile';

interface SamplePersonaPickerProps {
  onSelect?: (profile: Profile) => void;
}

const SAMPLE_LABEL = 'नमुना व्यक्ती — Sample persona';

export default function SamplePersonaPicker({ onSelect }: SamplePersonaPickerProps) {
  const { isMarathi } = useLanguage();
  const { saveProfileId } = useLocalProfile();

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPersonas()
      .then((list) => {
        if (active) setPersonas(Array.isArray(list) ? list.filter((p) => p.isSample) : []);
      })
      .catch(() => {
        if (active) setLoadError('Could not load sample personas. / नमुना व्यक्ती लोड होऊ शकल्या नाहीत.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleSelect(persona: Persona) {
    if (isSaving) return;
    setSelectedId(persona.id);
    setSubmitError(null);
    setIsSaving(true);
    try {
      const profile = await createPersonaProfile(persona.id, {});
      saveProfileId(profile.id);
      onSelect?.(profile);
    } catch {
      setSubmitError(
        'Could not load this persona. Please try again. / ही व्यक्ती लोड करता आली नाही. पुन्हा प्रयत्न करा.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  const safePersonas = Array.isArray(personas) ? personas : [];

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground" data-nexen-id="nx-0567428b-0">
        {isMarathi ? 'लोड होत आहे…' : 'Loading…'}
      </p>
    );
  }

  if (loadError) {
    return <p className="text-sm text-destructive" data-nexen-id="nx-0567428b-1">{loadError}</p>;
  }

  return (
    <section className="w-full max-w-full space-y-3" data-nexen-id="nx-0567428b-2">
      <p className="text-sm text-muted-foreground" data-nexen-id="nx-0567428b-3">
        {isMarathi
          ? 'एक नमुना व्यक्ती निवडा आणि त्यांची माहिती पहा.'
          : 'Choose one sample persona to see their details.'}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {safePersonas.map((persona) => {
          const isSelected = selectedId === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              aria-pressed={isSelected}
              disabled={isSaving}
              onClick={() => handleSelect(persona)}
              className={`w-full min-w-0 rounded-[var(--radius)] border bg-card p-4 text-left shadow-sm transition disabled:opacity-60 ${
                isSelected ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary'
              }`}
             data-nexen-id="nx-0567428b-4">
              <span className="inline-flex max-w-full rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary" data-nexen-id="nx-0567428b-5">
                {SAMPLE_LABEL}
              </span>
              <h3 className="mt-3 truncate text-base font-semibold text-foreground" data-nexen-id="nx-0567428b-6">{persona.name}</h3>
              <dl className="mt-2 space-y-1 text-sm" data-nexen-id="nx-0567428b-7">
                <div className="flex min-w-0 gap-2">
                  <dt className="shrink-0 text-muted-foreground" data-nexen-id="nx-0567428b-8">
                    {isMarathi ? 'वय' : 'Age'}
                  </dt>
                  <dd className="min-w-0 break-words text-foreground" data-nexen-id="nx-0567428b-9">{persona.age}</dd>
                </div>
                <div className="flex min-w-0 gap-2">
                  <dt className="shrink-0 text-muted-foreground" data-nexen-id="nx-0567428b-10">
                    {isMarathi ? 'काम' : 'Work'}
                  </dt>
                  <dd className="min-w-0 break-words text-foreground" data-nexen-id="nx-0567428b-11">{persona.work}</dd>
                </div>
                <div className="flex min-w-0 gap-2">
                  <dt className="shrink-0 text-muted-foreground" data-nexen-id="nx-0567428b-12">
                    {isMarathi ? 'ठिकाण' : 'Place'}
                  </dt>
                  <dd className="min-w-0 break-words text-foreground" data-nexen-id="nx-0567428b-13">{persona.place}</dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>

      {isSaving && (
        <p className="text-sm text-muted-foreground" data-nexen-id="nx-0567428b-14">
          {isMarathi ? 'माहिती जतन होत आहे…' : 'Saving persona…'}
        </p>
      )}
      {submitError && <p className="text-sm text-destructive" data-nexen-id="nx-0567428b-15">{submitError}</p>}
    </section>
  );
}