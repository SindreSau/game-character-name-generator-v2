import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/general/theme-provider';
import Link from 'next/link';
import { Toaster } from '@/components/ui/sonner';
import { SiGithub } from '@icons-pack/react-simple-icons';
import Header from '@/components/general/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Game Name Generator',
  description: 'Generate unique names for your games',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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

            <main className="flex-grow container">{children}</main>

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
