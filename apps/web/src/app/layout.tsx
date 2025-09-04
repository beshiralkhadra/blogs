import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../../styles/globals.css';
import Navigation from '@/components/Navigation';
import { UserProvider } from '@/contexts/appContext';
import { BlogsProvider } from '@/contexts/BlogsContext';
import AppShell from '@/components/AppShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'BlogApp - Share Your Stories',
  description: 'A modern blog platform for writers and readers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <BlogsProvider>
            <AppShell>
            <Navigation />
            {children}
            </AppShell>
          </BlogsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
