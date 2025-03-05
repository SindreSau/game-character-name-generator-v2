import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Lightbulb,
  MoveRight,
  AlertTriangle,
} from 'lucide-react';
import { Metadata } from 'next';
import { FadeInSection } from '@/components/general/fade-in-section';

export const metadata: Metadata = {
  title: 'About Game Name Generator',
  description:
    'Learn about our AI-powered name generation tools for game characters and how they can help game developers and writers.',
  keywords:
    'about name generator, game character names, fantasy names, name generator tools',
  alternates: {
    canonical: 'https://gamenamegen.site/about',
  },
};

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <FadeInSection delay={50}>
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-teal-500/50">
          Let&apos;s generate some names!
        </h1>
      </FadeInSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
        <FadeInSection delay={100} className="md:col-span-2">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-primary" size={22} />
                The Problem We Solve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Creating unique character names can be challenging for game
                developers and writers:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    Are you tired of trying to figure out unique names over and
                    over for your characters?
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    Are you a game developer, writer or similar and need some
                    creative nudges?
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span className="font-semibold text-primary">
                    Here&apos;s the tool for you!
                  </span>
                </li>
              </ul>

              <div className="mt-6">
                <Button asChild className="gap-2">
                  <Link href="/form-generator">
                    Try the name generator <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeInSection>

        <FadeInSection delay={150}>
          <Card className="border-primary/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="text-primary" size={22} />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our name generator uses advanced AI to create unique character
                names that fit your specific requirements:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    You specify the genre, style, and other parameters
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    Our AI analyzes naming patterns from your selected genre
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    The generator creates unique names matching your criteria
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    You can easily copy names directly to your clipboard
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </FadeInSection>

        <FadeInSection delay={200}>
          <Card className="border-primary/20 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-primary" size={22} />
                Why Use Our Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Our generator is the perfect solution for:</p>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    Game developers needing character names that fit their world
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    Writers struggling with naming characters consistently
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    RPG players looking for the perfect character name
                  </span>
                </li>
                <li className="flex gap-2">
                  <MoveRight
                    className="text-primary mt-1 flex-shrink-0"
                    size={18}
                  />
                  <span>
                    Anyone who needs creative inspiration for naming characters
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </FadeInSection>
      </div>

      <FadeInSection delay={250}>
        <div className="max-w-4xl mx-auto text-center mt-12">
          <Button asChild size="lg" className="gap-2">
            <Link href="/form-generator">
              Generate names now <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </FadeInSection>
    </div>
  );
}
