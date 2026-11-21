import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KamgarSaathi',
  description: 'Know your schemes, and why. मराठी प्रथम · Marathi first.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr">
      <body className="font-sans bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}