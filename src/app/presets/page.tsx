import { Metadata } from 'next';
import Link from 'next/link';
import { FadeInSection } from '@/components/general/fade-in-section';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Game Name Presets | Character Name Generator',
  description:
    'Generate character names using presets from popular games like Path of Exile 2, Diablo, Elder Scrolls, and more.',
  keywords:
    'game name presets, Path of Exile 2 names, character name generator, game-specific names, RPG character names',
  alternates: {
    canonical: 'https://gamenamegen.site/presets',
  },
  openGraph: {
    title: 'Game Presets | Character Name Generator',
    description: 'Generate character names using presets from popular games',
    url: 'https://gamenamegen.site/presets',
    siteName: 'Game Name Generator',
    type: 'website',
  },
};

// Define the preset options - add more as needed
const PRESET_OPTIONS = [
  {
    id: 'poe2',
    title: 'Path of Exile 2',
    description:
      'Generate character names inspired by the dark fantasy world of Path of Exile 2',
    imageUrl: '/images/presets/poe2-preset.jpg',
    available: true,
    href: '/presets/path-of-exile-2',
    tags: ['ARPG', 'Dark Fantasy', 'Gothic'],
  },
  {
    id: 'diablo',
    title: 'Diablo IV',
    description:
      'Create demonic, angelic, and mortal names fit for the world of Sanctuary',
    imageUrl: '/images/presets/diablo-preset.jpg',
    available: false,
    href: '/presets/diablo',
    tags: ['ARPG', 'Dark Fantasy', 'Demonic'],
  },
];

export default function PresetsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <FadeInSection delay={50}>
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Game Preset Name Generators
        </h1>
        <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
          Choose a game preset to generate character names specifically designed
          to fit that game&apos;s world and lore. Each preset uses specialized
          prompts to create authentic-feeling character names.
        </p>
      </FadeInSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRESET_OPTIONS.map((preset, index) => (
          <FadeInSection delay={100 + index * 50} key={preset.id}>
            <Card
              className={`h-full border-primary/20 transition-all hover:border-primary/50 ${
                !preset.available ? 'opacity-70' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{preset.title}</CardTitle>
                  {!preset.available && (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
                <CardDescription>{preset.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {preset.tags.map((tag) => (
                    <span
                      key={`${preset.id}-${tag}`}
                      className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  asChild={preset.available}
                  disabled={!preset.available}
                  className="w-full gap-2"
                >
                  {preset.available ? (
                    <Link href={preset.href}>
                      Generate Names <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <span>Coming Soon</span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </FadeInSection>
        ))}
      </div>

      <FadeInSection delay={300}>
        <div className="mt-12 text-center text-muted-foreground">
          <p className="mb-4">Need a more customizable name generator?</p>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/form-generator">
              Try the Custom Generator <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </FadeInSection>
    </div>
  );
}
