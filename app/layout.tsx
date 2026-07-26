import type { Metadata } from 'next';
import { Fraunces, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ToastProvider } from '@/lib/context/ToastContext';
import { ToastViewport } from '@/components/ui/ToastViewport';
import './globals.css';

/**
 * TEMPORARY DEVIATION from TAD §6 (self-hosted next/font/local), agreed as
 * a deliberate quick-unblock for the Netlify deploy: the actual .woff2 font
 * files were never committed to the repo, which failed the build with
 * "Module not found" for each font path. next/font/google fetches and
 * self-hosts these same three families automatically at build time, no
 * local files required, and still avoids a runtime request to Google Fonts
 * (Next.js inlines the font files into the build output either way), so
 * the 3G-performance rationale in Liko_Frontend_Design_Research-1.md §4.2
 * is not meaningfully compromised. Revert to next/font/local (see git
 * history for the prior version of this file) once the real .woff2 files
 * are sourced and committed under public/fonts/, per the README.
 */
const fraunces = Fraunces({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Liko Security Training',
  description: 'PSIRA-accredited security training in Mount Frere.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable} ${plexMono.variable}`}>
      <body>
        <ToastProvider>
          <AuthProvider>
            {children}
            <ToastViewport />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
