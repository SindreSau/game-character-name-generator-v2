import Link from 'next/link';
import { ArrowRight, Wand2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import { FadeInSection } from '@/components/general/fade-in-section';

export const metadata: Metadata = {
  title: 'Game Name Generator | Create Unique Character Names Instantly',
  description:
    'Generate unique and creative names for your game characters with our free AI-powered tools. Perfect for game developers, writers, and RPG enthusiasts.',
  keywords:
    'name generator, game character names, fantasy names, game preset names, RPG names, character creator, game development tools',
  metadataBase: new URL('https://gamenamegen.site'),
  openGraph: {
    title: 'Game Name Generator | Create Unique Character Names',
    description:
      'Generate unique and creative names for your game characters with our free AI-powered tools.',
    url: 'https://gamenamegen.site',
    siteName: 'Game Name Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Name Generator',
    description: 'Generate unique and creative names for your game characters',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <FadeInSection delay={50}>
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-teal-500/50">
            Ready to generate unique names for your next character?
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground mb-8">
            Stop struggling with character naming. Our AI-powered tools create
            perfect names for any game genre in seconds.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/form-generator">
                Try it now <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </section>
      </FadeInSection>

      {/* Features Section */}
      <FadeInSection delay={100}>
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FadeInSection
              delay={150}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Wand2 size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">
                The power of generative AI at your fingertips
              </p>
            </FadeInSection>

            <FadeInSection
              delay={200}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="m6 16 6-12 6 12"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-muted-foreground">
                Fine-tune details to fit your character perfectly
              </p>
            </FadeInSection>

            <FadeInSection
              delay={250}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free to Use</h3>
              <p className="text-muted-foreground">
                All our name generation tools are completely free
              </p>
            </FadeInSection>
          </div>
        </section>
      </FadeInSection>

      {/* Tools Section */}
      <FadeInSection delay={300}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-teal-500/70">
            Choose Your Tool
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Character Name Generator Card */}
            <FadeInSection delay={350}>
              <Card className="relative overflow-hidden border-primary/20 transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 size={22} />
                    Character Name Generator
                  </CardTitle>
                  <CardDescription>
                    Create custom names for any game character
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="mb-4">
                    Generate character names with full control over:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Game genre and style
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Gender and name length
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Complexity and uniqueness
                    </li>
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full gap-2">
                    <Link href="/form-generator">
                      Start generating <ArrowRight size={16} />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </FadeInSection>

            {/* Preset Generator Card */}
            <FadeInSection delay={400}>
              <Card className="relative overflow-hidden border-primary/20 opacity-90 transition-all hover:border-primary hover:shadow-md">
                <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                  Coming Soon
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark size={22} />
                    Preset Name Generator
                  </CardTitle>
                  <CardDescription>
                    Generate names based on popular game presets
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="mb-4">
                    Quick name generation using curated presets from:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Popular RPG franchises
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Fantasy and sci-fi universes
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Classic and modern game worlds
                    </li>
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button disabled variant="outline" className="w-full gap-2">
                    Coming Soon <ArrowRight size={16} />
                  </Button>
                </CardFooter>
              </Card>
            </FadeInSection>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
