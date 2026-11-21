// Sample-only certificate extraction. No OCR runs here: the values and boxes
// below are fixed sample data, not read from any uploaded photo.

export type Box = { x: number; y: number; w: number; h: number };

export type Field<T> = { value: T; box: Box | null };

export type CertificateExtraction = {
  source: 'sample';
  note: string;
  image: { width: number; height: number };
  days: Field<number>;
  employer: Field<string>;
  period: Field<string>;
};

export const SAMPLE_IMAGE = { width: 600, height: 400 } as const;

export const SAMPLE_NOTE = 'Sample extraction — not read from your photo';

// Boxes are in the sample image's own coordinate space (600 x 400).
const SAMPLE_BOXES = {
  days: { x: 60, y: 140, w: 200, h: 56 },
  employer: { x: 60, y: 210, w: 500, h: 56 },
  period: { x: 60, y: 280, w: 500, h: 56 },
} satisfies Record<'days' | 'employer' | 'period', Box>;

const SAMPLE_EMPLOYER = 'गणेश बांधकाम / Ganesh Builders';
const SAMPLE_PERIOD = '१ जाने – ३१ मार्च २०२४ / 1 Jan – 31 Mar 2024';

export function extractSampleCertificate(days: number): CertificateExtraction {
  return {
    source: 'sample',
    note: SAMPLE_NOTE,
    image: { width: SAMPLE_IMAGE.width, height: SAMPLE_IMAGE.height },
    days: { value: days, box: SAMPLE_BOXES.days },
    employer: { value: SAMPLE_EMPLOYER, box: SAMPLE_BOXES.employer },
    period: { value: SAMPLE_PERIOD, box: SAMPLE_BOXES.period },
  };
}

const MARATHI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export function toMarathiDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => MARATHI_DIGITS[Number(d)]);
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Draws the sample certificate as SVG so the crops have real pixels behind them.
export function sampleCertificateSvg(extraction: CertificateExtraction): string {
  const { width, height } = extraction.image;

  const row = (box: Box | null, size: number, value: string) => {
    if (!box) return '';
    const baseline = box.y + box.h / 2 + size * 0.35;
    return [
      `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="#ffffff" stroke="#d6d3d1"/>`,
      `<text x="${box.x + 10}" y="${baseline}" font-size="${size}" font-family="sans-serif" fill="#1f2937">${escapeXml(value)}</text>`,
    ].join('');
  };

  const daysText = `${toMarathiDigits(extraction.days.value)} दिवस / ${extraction.days.value} days`;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="#fffbeb"/>`,
    `<rect x="12" y="12" width="${width - 24}" height="${height - 24}" fill="none" stroke="#b45309" stroke-width="4"/>`,
    `<text x="${width / 2}" y="70" text-anchor="middle" font-size="28" font-family="sans-serif" fill="#78350f">बांधकाम कामगार प्रमाणपत्र / Construction Worker Certificate</text>`,
    `<text x="${width / 2}" y="104" text-anchor="middle" font-size="18" font-family="sans-serif" fill="#57534e">नमुना / Sample</text>`,
    row(extraction.days.box, 26, daysText),
    row(extraction.employer.box, 20, extraction.employer.value),
    row(extraction.period.box, 18, extraction.period.value),
    `<text x="${width - 30}" y="${height - 30}" text-anchor="end" font-size="16" font-family="sans-serif" fill="#78716c">नमुना / Sample</text>`,
    `</svg>`,
  ].join('');
}

export function sampleCertificateDataUri(extraction: CertificateExtraction): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sampleCertificateSvg(extraction))}`;
}
