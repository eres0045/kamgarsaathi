export default function HonestyNote() {
  const points = [
    {
      mr: 'हे निकाल अंदाजे पात्रता आहेत, अंतिम मंजुरी नाही.',
      en: 'These verdicts are likely eligibility, not a final approval.',
    },
    {
      mr: '? चिन्ह असलेल्या बाबी कार्यालयात स्वतः तपासा.',
      en: 'Items marked ? are not yet verified. Check them at the office.',
    },
    {
      mr: 'कोणतीही रक्कम तेव्हाच दाखवली जाते जेव्हा ती सत्यापित असते.',
      en: 'An amount is shown only when it has been verified.',
    },
    {
      mr: 'हे ॲप कोणत्याही वास्तविक व्यक्तीचा दावा करत नाही; नमुना व्यक्ती फक्त उदाहरणासाठी आहेत.',
      en: 'This app does not claim any real person. Sample personas are for illustration only.',
    },
  ];

  const legend = [
    { symbol: '✓', mr: 'पात्र असण्याची शक्यता', en: 'likely eligible' },
    { symbol: '✗', mr: 'पात्र नाही', en: 'not eligible' },
    { symbol: '?', mr: 'तपासणी आवश्यक', en: 'needs verification' },
  ];

  return (
    <section
      aria-label="Honesty note / प्रामाणिकपणाची नोंद"
      className="w-full max-w-full rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm sm:p-6"
     data-nexen-id="nx-6389ca22-0">
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="text-base font-semibold text-foreground sm:text-lg" data-nexen-id="nx-6389ca22-1">
          ही माहिती अंदाजे पात्रता दर्शवते
        </h2>
        <p className="text-sm text-muted-foreground" data-nexen-id="nx-6389ca22-2">
          This information shows likely eligibility.
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-3" data-nexen-id="nx-6389ca22-3">
        {points.map((point) => (
          <li key={point.en} className="flex min-w-0 gap-3" data-nexen-id="nx-6389ca22-4">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
             data-nexen-id="nx-6389ca22-5"/>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="break-words text-sm text-foreground" data-nexen-id="nx-6389ca22-6">{point.mr}</p>
              <p className="break-words text-xs text-muted-foreground" data-nexen-id="nx-6389ca22-7">{point.en}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {legend.map((item) => (
          <div key={item.symbol} className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground"
             data-nexen-id="nx-6389ca22-8">
              {item.symbol}
            </span>
            <span className="break-words text-xs text-muted-foreground" data-nexen-id="nx-6389ca22-9">
              {item.mr} · {item.en}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}