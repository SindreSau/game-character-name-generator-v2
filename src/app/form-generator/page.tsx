import type { Metadata } from 'next';
import GenerateNamesForm from '@/components/generate-names-form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Game Character Name Generator Form',
  description:
    'Generate unique and creative names for your game characters with our AI-powered tool. Choose from fantasy, sci-fi, horror, and more game genres.',
  keywords:
    'name generator, character name generator, game character names, fantasy names, game preset names, RPG names, gamertag, gamertag generator, gamertag AI tool, username, username generator, username AI tool, fantasy name generator, novel character names, DnD names, gaming nickname, online persona, unique identifiers, twitch username, discord name, steam name, xbox gamertag, playstation name, MMO character name, MOBA username, battle royale name, sci-fi name generator, villain names, hero names, streamer name ideas, clan name generator, unique name generator, character creator tool, name generator form, name generator AI',
  alternates: {
    canonical: 'https://gamenamegen.site/character-generator',
  },
  openGraph: {
    title: 'Game Character Name Generator | AI Form Tool',
    description:
      'Generate unique and creative names for your game characters with our AI-powered tool. Choose from fantasy, sci-fi, horror, and more game genres.',
    url: 'https://gamenamegen.site/character-generator',
    siteName: 'Game Name Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Character Name Generator | AI Form Tool',
    description:
      'Generate unique and creative names for your game characters with our AI-powered tool.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FormGenerator() {
  return (
    <>
      {/* Structured Data */}
      <Script
        id="schema-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Game Character Name Generator',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description:
              'Generate unique and creative names for your game characters with AI. Choose from fantasy, sci-fi, horror, and more game genres.',
            featureList: [
              'Fantasy character names',
              'Sci-Fi character names',
              'Horror character names',
              'RPG character names',
              'Customizable name complexity',
              'Gender options: neutral, masculine, feminine',
            ],
          }),
        }}
      />

      <section aria-labelledby="page-title">
        <h1
          className="text-xl pt-2 md:pt-0 md:text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-teal-500/50 "
          id="page-title"
        >
          Game Character Name Generator
        </h1>
        <GenerateNamesForm />
      </section>

      <section className="container mx-auto max-w-4xl mb-16">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="about">
            <AccordionTrigger className="text-lg font-medium">
              About the Game Character Name Generator
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm dark:prose-invert mt-4">
                <p>
                  Our character name generator helps you create unique names for
                  your video games, RPGs, and creative projects. Simply select
                  your preferred genre, add style descriptors, choose gender
                  preference, name length, and complexity level. Within seconds,
                  you&apos;ll get a list of unique character names tailored to
                  your specifications.
                </p>

                <h3 className="text-base font-medium mt-4">Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Multiple Genres</strong> - Fantasy, Sci-Fi, Horror,
                    Action, RPG, FPS, MMO, Fighting
                  </li>
                  <li>
                    <strong>Style Customization</strong> - Add specific style
                    descriptors like &quot;Elegant&quot; or
                    &quot;Mysterious&quot;
                  </li>
                  <li>
                    <strong>Gender Options</strong> - Choose from neutral,
                    masculine, or feminine names
                  </li>
                  <li>
                    <strong>Name Length Control</strong> - Generate short,
                    medium, or long names
                  </li>
                  <li>
                    <strong>Complexity Slider</strong> - Adjust from simple to
                    complex naming patterns
                  </li>
                </ul>

                <h3 className="text-base font-medium mt-4">
                  Why Use a Character Name Generator?
                </h3>
                <p>
                  Creating memorable character names is essential for game
                  development, storytelling, and worldbuilding. Our AI-powered
                  tool helps you overcome creative blocks and generates names
                  that fit your game&apos;s universe and atmosphere. Save time
                  in your creative process and focus on other aspects of your
                  game development.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="howto">
            <AccordionTrigger className="text-lg font-medium">
              How to Use This Tool
            </AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm dark:prose-invert mt-4">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <strong>Select a Genre</strong> - Choose the game genre that
                    best fits your project (Fantasy, Sci-Fi, etc.)
                  </li>
                  <li>
                    <strong>Add Style Keywords</strong> - Enter comma-separated
                    style descriptors to influence the name generation
                  </li>
                  <li>
                    <strong>Choose Gender Leaning</strong> - Select neutral,
                    masculine, or feminine name characteristics
                  </li>
                  <li>
                    <strong>Set Name Length</strong> - Pick short, medium, or
                    long names based on your preference
                  </li>
                  <li>
                    <strong>Adjust Complexity</strong> - Use the slider to
                    control how complex the generated names will be
                  </li>
                  <li>
                    <strong>Generate</strong> - Click the &quot;Generate
                    Names&quot; button to get your custom character names
                  </li>
                  <li>
                    <strong>Copy Names</strong> - Click the copy icon next to
                    any name to copy it to your clipboard
                  </li>
                </ol>

                <p className="mt-4">
                  Try different combinations of settings to get a wide variety
                  of character name options. If you&apos;re not satisfied with
                  the results, simply adjust your parameters and generate a new
                  set of names.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </>
  );
}
