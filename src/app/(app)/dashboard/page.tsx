'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SampleLabel from '@/components/SampleLabel';
import SamplePersonaPicker from '@/components/SamplePersonaPicker';
import { useLocalProfile } from '@/hooks/useLocalProfile';
import {
  getProfileDocumentQuest,
  getProfileGate,
  getProfileRenewalCountdown,
  getProfileSchemeStack,
} from '@/lib/api';

type GateView = {
  status: 'open' | 'closed' | 'unconfirmed';
  required_days: number;
  confirmed_days: number | null;
  shortfall_days: number | null;
  certificate_id: string | null;
};

type StackView = {
  schemes: { slug: string; verdict: 'pass' | 'fail' | 'unknown' }[];
  unlocked_inr_verified: number;
  scholarship_eligible: boolean;
};

type QuestView = {
  ticked_count: number;
  total: number;
  pack_ready: boolean;
};

type RenewalView = {
  days_to_renewal: number | null;
  renewal_due_date: string | null;
  first_deadline: string | null;
};

type DashboardData = {
  gate: GateView;
  stack: StackView;
  quest: QuestView;
  renewal: RenewalView;
};

const SECTIONS = [
  { href: '/story-intake', mr: 'माझी कहाणी', en: 'Story & profile' },
  { href: '/rule-engine-evaluation', mr: 'योजना तपासा', en: 'Verdicts' },
  { href: '/gate-proof-moment', mr: '90-दिवस गेट', en: '90-day gate' },
  { href: '/scheme-stack-unlocked', mr: 'योजना क्रम', en: 'Claim order' },
  { href: '/documents', mr: 'कागदपत्रे', en: 'Documents' },
  { href: '/renewal-countdown', mr: 'नूतनीकरण', en: 'Renewal' },
  { href: '/pre-filled-application-pack', mr: 'अर्ज पॅक', en: 'Application pack' },
];

const CARD = 'rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6 min-w-0';

export default function DashboardPage() {
  const { profileId, accessToken, profile, isLoading, error, refetch } = useLocalProfile();
  const [data, setData] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [dashError, setDashError] = useState<string | null>(null);

  useEffect(() => {
    if (!profileId) return;
    let cancelled = false;
    const query = { token: accessToken ?? undefined };
    setDashLoading(true);
    setDashError(null);

    Promise.all([
      getProfileGate(profileId, query),
      getProfileSchemeStack(profileId, query),
      getProfileDocumentQuest(profileId, query),
      getProfileRenewalCountdown(profileId, query),
    ])
      .then(([g, s, d, r]: unknown[]) => {
        if (cancelled) return;
        setData({
          gate: g as GateView,
          stack: s as StackView,
          quest: d as QuestView,
          renewal: r as RenewalView,
        });
      })
      .catch((e: unknown) => {
        if (!cancelled) setDashError(e instanceof Error ? e.message : 'Could not load dashboard');
      })
      .finally(() => {
        if (!cancelled) setDashLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [profileId, accessToken]);

  if (isLoading) {
    return <p className="p-6 text-muted-foreground" data-nexen-id="nx-c8a2f05d-0">लोड होत आहे… / Loading…</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-destructive" data-nexen-id="nx-c8a2f05d-1">
        काहीतरी चुकले. / Something went wrong. ({error})
      </p>
    );
  }

  if (!profileId) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 p-4 sm:p-6">
        <h1 className="text-2xl font-bold" data-nexen-id="nx-c8a2f05d-2">नमस्कार / Welcome</h1>
        <p className="text-muted-foreground" data-nexen-id="nx-c8a2f05d-3">
          नमुना व्यक्ती निवडा किंवा तुमची कहाणी सुरू करा. / Pick a sample persona or start your story.
        </p>
        <SamplePersonaPicker onSelect={() => refetch()} />
      </div>
    );
  }

  const safeSections = SECTIONS;
  const pct =
    data && data.quest.total > 0
      ? Math.round((data.quest.ticked_count / data.quest.total) * 100)
      : 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 p-4 sm:space-y-6 sm:p-6">
      <header className={CARD} data-nexen-id="nx-c8a2f05d-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-xl font-bold sm:text-2xl" data-nexen-id="nx-c8a2f05d-5">
              {profile?.name ?? 'माझे प्रोफाइल / My profile'}
            </h1>
            <p className="text-sm text-muted-foreground" data-nexen-id="nx-c8a2f05d-6">
              {profile?.occupation ?? ''} · {profile?.state ?? ''}
            </p>
          </div>
          {profile?.isSample ? <SampleLabel /> : null}
        </div>
      </header>

      {dashError ? <p className="text-destructive" data-nexen-id="nx-c8a2f05d-7">{dashError}</p> : null}
      {dashLoading && !data ? (
        <p className="text-muted-foreground" data-nexen-id="nx-c8a2f05d-8">डेटा लोड होत आहे… / Loading data…</p>
      ) : null}

      {data ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className={CARD} data-nexen-id="nx-c8a2f05d-9">
            <h2 className="text-base font-semibold" data-nexen-id="nx-c8a2f05d-10">90-दिवस कामाचा गेट / 90-day work gate</h2>
            {data.gate.status === 'open' ? (
              <p className="mt-2 text-success" data-nexen-id="nx-c8a2f05d-11">✓ गेट खुला / Gate open</p>
            ) : data.gate.status === 'closed' ? (
              <p className="mt-2 text-danger" data-nexen-id="nx-c8a2f05d-12">
                ✗ {data.gate.shortfall_days ?? 0} दिवस कमी / {data.gate.shortfall_days ?? 0} days short
              </p>
            ) : (
              <p className="mt-2 text-muted-foreground" data-nexen-id="nx-c8a2f05d-13">
                ? प्रमाणपत्र अजून पुष्टी नाही / Certificate not yet confirmed
              </p>
            )}
            <Link href="/gate-proof-moment" className="mt-3 inline-block text-sm font-medium text-primary underline" data-nexen-id="nx-c8a2f05d-14">
              गेट तपासा / Check gate
            </Link>
          </section>

          <section className={CARD} data-nexen-id="nx-c8a2f05d-15">
            <h2 className="text-base font-semibold" data-nexen-id="nx-c8a2f05d-16">सत्यापित ₹ अनलॉक / Verified ₹ unlocked</h2>
            <p className="mt-2 break-words text-2xl font-bold" data-nexen-id="nx-c8a2f05d-17">
              ₹ {data.stack.unlocked_inr_verified.toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground" data-nexen-id="nx-c8a2f05d-18">
              {data.stack.scholarship_eligible
                ? 'शिष्यवृत्ती पात्र / Scholarship eligible (no amount shown)'
                : 'शिष्यवृत्ती: ? / Scholarship: ? — check at the portal'}
            </p>
            <Link href="/scheme-stack-unlocked" className="mt-3 inline-block text-sm font-medium text-primary underline" data-nexen-id="nx-c8a2f05d-19">
              योजना क्रम पहा / View claim order
            </Link>
          </section>

          <section className={CARD} data-nexen-id="nx-c8a2f05d-20">
            <h2 className="text-base font-semibold" data-nexen-id="nx-c8a2f05d-21">कागदपत्रे / Documents</h2>
            <p className="mt-2 text-sm" data-nexen-id="nx-c8a2f05d-22">
              {data.quest.ticked_count} / {data.quest.total}{' '}
              {data.quest.pack_ready ? '· ✓ पॅक तयार / Pack ready' : ''}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-[var(--radius)] bg-muted">
              <div className="h-2 bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <Link href="/documents" className="mt-3 inline-block text-sm font-medium text-primary underline" data-nexen-id="nx-c8a2f05d-23">
              यादी पहा / Open checklist
            </Link>
          </section>

          <section className={CARD} data-nexen-id="nx-c8a2f05d-24">
            <h2 className="text-base font-semibold" data-nexen-id="nx-c8a2f05d-25">नूतनीकरण / Renewal</h2>
            {data.renewal.days_to_renewal !== null ? (
              <p className="mt-2 text-sm" data-nexen-id="nx-c8a2f05d-26">
                {data.renewal.days_to_renewal} दिवस बाकी / days left
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground" data-nexen-id="nx-c8a2f05d-27">
                {data.renewal.first_deadline ??
                  'नोंदणी तारीख टाका / Enter registration date'}
              </p>
            )}
            <Link href="/renewal-countdown" className="mt-3 inline-block text-sm font-medium text-primary underline" data-nexen-id="nx-c8a2f05d-28">
              काउंटडाउन / Countdown
            </Link>
          </section>
        </div>
      ) : null}

      <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" data-nexen-id="nx-c8a2f05d-29">
        {safeSections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="min-w-0 rounded-[var(--radius)] border border-border bg-card p-4 text-sm font-medium shadow-sm hover:bg-muted"
           data-nexen-id="nx-c8a2f05d-30">
            <span className="block break-words" data-nexen-id="nx-c8a2f05d-31">{s.mr}</span>
            <span className="block break-words text-muted-foreground" data-nexen-id="nx-c8a2f05d-32">{s.en}</span>
          </Link>
        ))}
      </nav>

      <Link href="/my-applications" className="inline-block text-sm font-medium text-primary underline" data-nexen-id="nx-c8a2f05d-33">
        माझे अर्ज / My applications
      </Link>
    </div>
  );
}