
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SamplePersonaPicker from '@/components/SamplePersonaPicker';
import FeatureLinks from '@/components/FeatureLinks';
import HonestyNote from '@/components/HonestyNote';
import SampleLabel from '@/components/SampleLabel';
import { useLocalProfile } from '@/hooks/useLocalProfile';
import type { Profile } from '@/types/profile';

export default function HomePage() {
  const router = useRouter();
  const { saveProfileId, error } = useLocalProfile();
  const [saveError, setSaveError] = useState<string | null>(null);

  function handlePersonaSelect(profile: Profile) {
    if (!profile?.id || !profile.accessToken) {
      setSaveError(
        'नमुना व्यक्ती उघडता आली नाही. पुन्हा प्रयत्न करा. / Could not open the sample persona. Please try again.',
      );
      return;
    }
    setSaveError(null);
    saveProfileId(profile.id, profile.accessToken);
    router.push('/story-intake');
  }

  const message = saveError ?? (error ? String(error) : null);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans" data-nexen-id="nx-3393394e-0">
      <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-10 sm:px-6">
        <section className="space-y-4" data-nexen-id="nx-3393394e-1">
          <span className="inline-flex rounded-full bg-card px-3 py-1 text-sm font-semibold text-muted-foreground border border-border" data-nexen-id="nx-3393394e-2">
            मराठी प्रथम · Marathi first
          </span>
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl min-w-0" data-nexen-id="nx-3393394e-3">
            तुमच्या हक्काच्या योजना, एका ठिकाणी.
          </h1>
          <p className="text-base text-muted-foreground" data-nexen-id="nx-3393394e-4">
            Know your schemes, and why. KamgarSaathi shows construction and gig workers which schemes
            they may be eligible for, the reason for each verdict, and what to bring to the office.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Link
              href="/story-intake"
              className="inline-flex w-full items-center justify-center rounded-[var(--radius)] bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm sm:w-auto"
             data-nexen-id="nx-3393394e-5">
              मराठीत सुरू करा → Start in Marathi
            </Link>
          </div>
        </section>

        <section className="space-y-4 rounded-[var(--radius)] border border-border bg-card p-6 shadow-sm" data-nexen-id="nx-3393394e-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold min-w-0" data-nexen-id="nx-3393394e-7">
              नमुना व्यक्ती निवडा · Pick a sample persona
            </h2>
            <SampleLabel />
          </div>
          <SamplePersonaPicker onSelect={handlePersonaSelect} />
          {message && (
            <p role="alert" className="text-sm text-destructive" data-nexen-id="nx-3393394e-8">
              {message}
            </p>
          )}
        </section>

        <FeatureLinks />
        <HonestyNote />
      </div>
    </main>
  );
}