import { Metadata } from 'next';
import { Pathofexile2Generator } from '@/components/presets/path-of-exile-2/pathofexile2-generator';
import { FadeInSection } from '@/components/general/fade-in-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Path of Exile 2 Name Generator | Generate Character Names',
  description:
    'Create unique and thematic names for Path of Exile 2 characters with our specialized name generator. Choose from all 12 playable classes and their ascendancies.',
  keywords:
    'Path of Exile 2, PoE 2 names, character names, game names, Warrior, Huntress, Sorceress, Mercenary, Monk, Druid, Ranger, Witch, Templar, Shadow, Marauder, Duelist',
  alternates: {
    canonical: 'https://gamenamegen.site/presets/path-of-exile-2',
  },
  openGraph: {
    title: 'Path of Exile 2 Name Generator | Game Name Generator',
    description: 'Generate unique character names for Path of Exile 2 classes',
    url: 'https://gamenamegen.site/presets/path-of-exile-2',
    siteName: 'Game Name Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Path of Exile 2 Name Generator',
    description: 'Generate unique character names for Path of Exile 2 classes',
  },
};

export default function PathOfExile2Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm">
        <Link href="/presets" className="flex items-center gap-1">
          <ArrowLeft size={16} />
          Back to Presets
        </Link>
      </Button>
      <FadeInSection delay={50}>
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Path of Exile 2 Name Generator
        </h1>
      </FadeInSection>

      <Pathofexile2Generator />
    </div>
  );
}
