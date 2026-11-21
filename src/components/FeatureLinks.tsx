import Link from 'next/link';

type Feature = {
  href: string;
  titleEn: string;
  titleMr: string;
  descEn: string;
  icon: string;
};

const features: Feature[] = [
  {
    href: '/schemes',
    titleEn: 'Scheme rules',
    titleMr: 'योजना नियम',
    descEn: 'Twelve schemes run as rules. Each shows ✓, ✗ or ? with the reason.',
    icon: 'M4 6h16M4 12h10M4 18h7',
  },
  {
    href: '/gate',
    titleEn: '90-day work gate',
    titleMr: '९०-दिवस कामाची अट',
    descEn: 'Prove construction work from a certificate photo, with the crop shown next to each value.',
    icon: 'M12 8v4l3 2M3 12a9 9 0 1018 0 9 9 0 00-18 0',
  },
  {
    href: '/schemes/order',
    titleEn: 'Claim order',
    titleMr: 'दावा क्रम',
    descEn: 'e-Shram first, then insurance and pension, then BOCW benefits, in sequence.',
    icon: 'M5 12l5 5L20 7',
  },
  {
    href: '/schemes/unlocked',
    titleEn: '₹ unlocked total',
    titleMr: '₹ अनलॉक रक्कम',
    descEn: 'Verified amounts only. No unverified ₹ figure is shown.',
    icon: 'M12 3v18M16 7H10a3 3 0 000 6h4a3 3 0 010 6H7',
  },
  {
    href: '/documents',
    titleEn: '6-document checklist',
    titleMr: '६ कागदपत्रांची यादी',
    descEn: 'Where to get each document, cost, days and appeal officer. Tick off and print.',
    icon: 'M9 9l2 2 4-4M9 16h6M5 4h14v16H5z',
  },
  {
    href: '/renewal',
    titleEn: 'Renewal countdown',
    titleMr: 'नूतनीकरण काउंटडाउन',
    descEn: 'Tracked from your registration date and kept on this device.',
    icon: 'M12 7v5l3 2M3 12a9 9 0 1018 0 9 9 0 00-18 0',
  },
];

export default function FeatureLinks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8" data-nexen-id="nx-edd6451e-0">
      <div className="mb-6 min-w-0">
        <h2 className="text-2xl font-bold text-foreground" data-nexen-id="nx-edd6451e-1">
          Everything a worker needs before the counter
        </h2>
        <p className="mt-2 text-sm text-muted-foreground" data-nexen-id="nx-edd6451e-2">
          कामगार, CSC ऑपरेटर आणि कंत्राटदारांसाठी.
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-nexen-id="nx-edd6451e-3">
        {features.map((feature) => (
          <li key={feature.href} className="min-w-0" data-nexen-id="nx-edd6451e-4">
            <Link
              href={feature.href}
              className="block h-full rounded-[var(--radius)] border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
             data-nexen-id="nx-edd6451e-5">
              <span className="grid h-10 w-10 place-items-center rounded-[var(--radius)] bg-secondary text-primary" data-nexen-id="nx-edd6451e-6">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d={feature.icon} />
                </svg>
              </span>
              <h3 className="mt-3 text-base font-semibold text-foreground" data-nexen-id="nx-edd6451e-7">
                {feature.titleEn}
              </h3>
              <p className="text-xs text-muted-foreground" data-nexen-id="nx-edd6451e-8">{feature.titleMr}</p>
              <p className="mt-2 text-sm text-muted-foreground" data-nexen-id="nx-edd6451e-9">{feature.descEn}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}