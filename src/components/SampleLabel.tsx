
export default function SampleLabel({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent ${className}`.trim()}
     data-nexen-id="nx-06a534df-0">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"  data-nexen-id="nx-06a534df-1"/>
      <span className="min-w-0 break-words" data-nexen-id="nx-06a534df-2">नमुना व्यक्ती — Sample persona</span>
    </span>
  );
}