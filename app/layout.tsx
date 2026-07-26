import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { ToastProvider } from '@/lib/context/ToastContext';
import { ToastViewport } from '@/components/ui/ToastViewport';
import './globals.css';

/**
 * TAD §6: fonts are self-hosted via next/font/local, not next/font/google,  * no runtime request to Google Fonts, which matters for the 3G/budget-Android
 * audience research in Liko_Frontend_Design_Research-1.md §4.2.
 *
 * ACTION REQUIRED (cannot be done in this sandbox, no network access to
 * fetch font files): place the following files before `next build` will
 * succeed:
 *   public/fonts/fraunces/Fraunces-Regular.woff2   (weight 600)
 *   public/fonts/fraunces/Fraunces-Bold.woff2      (weight 700)
 *   public/fonts/source-sans/SourceSans3-Regular.woff2
 *   public/fonts/source-sans/SourceSans3-SemiBold.woff2
 *   public/fonts/ibm-plex-mono/IBMPlexMono-Medium.woff2
 * Source: Google Fonts (Fraunces, Source Sans 3, IBM Plex Mono are all
 * open-license and downloadable as static files) or fonts.google.com's
 * "download family" option, then self-host per next/font/local docs.
 */
const fraunces = localFont({
  src: [
    { path: '../public/fonts/fraunces/Fraunces-Regular.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/fraunces/Fraunces-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
});

const sourceSans = localFont({
  src: [
    { path: '../public/fonts/source-sans/SourceSans3-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/source-sans/SourceSans3-SemiBold.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
});

const plexMono = localFont({
  src: [{ path: '../public/fonts/ibm-plex-mono/IBMPlexMono-Medium.woff2', weight: '500', style: 'normal' }],
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
