import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hackmate-build-together.varsham-even-1821.chatgpt.site'),
  title: 'Hackmate — Find your people. Build your thing.',
  description: 'Discover compatible teammates, form a balanced team, and ship something brilliant together.',
  applicationName: 'Hackmate',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Hackmate — Find your people. Build your thing.',
    description: 'Discover compatible teammates, form a balanced team, and ship something brilliant together.',
    type: 'website',
    images: [{ url: '/og.png', width: 1680, height: 968, alt: 'Hackmate — Find your people. Build your thing.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hackmate — Find your people. Build your thing.',
    description: 'Find compatible teammates for hackathons and competitions.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#101117',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
