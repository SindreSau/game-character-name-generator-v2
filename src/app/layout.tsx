import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/general/theme-provider';
import Link from 'next/link';
import { Toaster } from '@/components/ui/sonner';
import { SiGithub } from '@icons-pack/react-simple-icons';
import Header from '@/components/general/header';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Name Generator',
  description:
    'Generate unique and creative names for your game characters and game presets instantly',
  keywords:
    'name generator, game character names, fantasy names, game preset names, RPG names',
  metadataBase: new URL('https://gamenamegen.site'),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        defer
        src="https://umami.sindresau.me/script.js"
        data-website-id="383c237c-849f-4de8-bf1c-77fa0a9f0116"
        data-domains="gamenamegen.site"
      ></Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow container pt-2 md:pt-3">{children}</main>

            <footer className="text-center border-t p-4 relative">
              <div className="text-xs flex justify-center items-center gap-2 container">
                <div>© 2025 @Github/SindreSau </div>
                <Link
                  href="https://github.com/SindreSau"
                  className="hover:rotate-12 hover:text-primary duration-200 transition-all"
                >
                  <SiGithub size={16} />
                </Link>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
