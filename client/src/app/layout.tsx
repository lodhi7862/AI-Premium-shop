/**
 * Root Layout Component
 */

import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { Header, Footer } from '@/shared/components/layout';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'AI Premium Shopping Experience',
  description: 'Next-generation ecommerce platform with AI-powered features',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
