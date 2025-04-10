'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { WandSparkles, RefreshCw, Info, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { FadeInSection } from '@/components/general/fade-in-section';
import { generatePoE2CharacterNames } from '@/actions/generate-poe2-names.server';
import { saveNameToFavorites } from '@/utils/favorites';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  PoE2CharacterInput,
  PoE2Class,
  PoE2ElementalTag,
} from '@/types/name-generator';
import { SelectionCard } from '@/components/general/selection-card';

// Define Path of Exile 2 classes
const POE2_CLASSES = [
  {
    id: 'Warrior',
    name: 'Warrior',
    description:
      'The Warrior pounds the ground with big, chunky attacks and can shrug off the hits of smaller enemies with large amounts of armour. Hit hard with heavy slams, stun and knockback foes, and utilize strong defenses.',
    gender: 'masculine',
  },
  {
    id: 'Huntress',
    name: 'Huntress',
    description:
      'The Huntress is a spear wielding Azmeri warrior, exiled for using skill gem power. She excels in both melee and ranged combat, dashing in and out of battle with her dexterous spear.',
    gender: 'feminine',
  },
  {
    id: 'Sorceress',
    name: 'Sorceress',
    description:
      'The Sorceress bends the elements to her will, unleashing devastation with fire, cold, and lightning spells from afar. Weave a flurry of elemental magic to control and destroy your foes.',
    gender: 'feminine',
  },
  {
    id: 'Mercenary',
    name: 'Mercenary',
    description:
      'The Mercenary wields a versatile crossbow with different ammo types for power and mobility. Combo abilities with elemental rounds (cold, fire, lightning) to exploit enemy weaknesses at any range.',
    gender: 'masculine',
  },
  {
    id: 'Monk',
    name: 'Monk',
    description:
      'The Monk is a fast and furious melee fighter who dashes in and out of combat, building momentum for powerful finishers with quick strikes and high mobility.',
    gender: 'masculine',
  },
  {
    id: 'Ranger',
    name: 'Ranger',
    description:
      'The Ranger is quick and deadly, peppering enemies with arrows from long range and using agility to vault away from danger. Utilize crowd control to slow or freeze your foes.',
    gender: 'feminine',
  },
  {
    id: 'Witch',
    name: 'Witch',
    description:
      "Death and decay are the Witch's weapons. Call forth hordes of undead minions and cast powerful chaos spells with plague and withering afflictions, or use fast and deadly osteomancy.",
    gender: 'feminine',
  },
];

// Define damage types
const DAMAGE_TYPES: {
  id: PoE2ElementalTag;
  name: string;
  description: string;
}[] = [
  {
    id: 'Fire',
    name: 'Fire',
    description: 'Burns enemies over time with ignite effects',
  },
  {
    id: 'Ice',
    name: 'Cold',
    description: 'Slows and freezes enemies with chill and freeze effects',
  },
  {
    id: 'Lightning',
    name: 'Lightning',
    description: 'Shocks enemies, increasing damage taken',
  },
  {
    id: 'Physical',
    name: 'Physical',
    description: 'Direct damage mitigated by armor, can cause bleeding',
  },
  {
    id: 'Chaos',
    name: 'Chaos',
    description: 'Bypasses energy shield and applies poison effects',
  },
  {
    id: 'Poison',
    name: 'Poison',
    description: 'Causes damage over time, ignoring armor and shields',
  },
];

// Form schema
const formSchema = z.object({
  class: z.string().min(1, 'Class selection is required'),
  elementalTag: z.string().optional(), // Single tag selection
  additionalStyles: z
    .string()
    .max(100, 'Additional styles must be under 100 characters')
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Name generation result type
type GeneratedNamesResult = {
  success: boolean;
  message: string;
  names: string[];
  provider?: string;
};

export function Pathofexile2Generator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedNamesResult | null>(null);

  // Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class: 'Warrior', // Default to first class
      elementalTag: 'Fire', // Default to first damage type
      additionalStyles: '',
    },
  });

  // Random class and damage type selection
  const randomizeSelection = () => {
    // Randomize character class
    const randomClass =
      POE2_CLASSES[Math.floor(Math.random() * POE2_CLASSES.length)].id;

    // Randomize damage type
    const randomDamageType =
      DAMAGE_TYPES[Math.floor(Math.random() * DAMAGE_TYPES.length)].id;

    // Update form values - using setValue with shouldDirty and shouldTouch to ensure UI updates
    form.setValue('class', randomClass, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    form.setValue('elementalTag', randomDamageType, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    try {
      // Get selected class info
      const selectedClass = POE2_CLASSES.find((c) => c.id === data.class);

      if (!selectedClass) {
        throw new Error('Invalid class selected');
      }

      const input: PoE2CharacterInput = {
        count: 6,
        class: data.class as PoE2Class,
        elementalTags: data.elementalTag
          ? [data.elementalTag as PoE2ElementalTag]
          : [], // Convert single tag to array
        additionalStyles: data.additionalStyles || '',
      };

      // Generate names using the specialized PoE2 action
      const response = await generatePoE2CharacterNames(input);
      setResult(response);

      if (!response.success) {
        toast.error('Failed to generate names', {
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Error generating names:', error);
      toast.error('An error occurred', {
        description: 'Failed to generate Path of Exile 2 character names.',
      });
      setResult({
        success: false,
        message: 'An unexpected error occurred',
        names: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get current selected class and elemental tag
  const selectedClass = POE2_CLASSES.find((c) => c.id === form.watch('class'));

  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
        Create unique and thematic character names for any of the
        {' ' + POE2_CLASSES.length + ' '} classes in Path of Exile 2. Set in the
        dark world of Wraeclast, 20 years after the events of the original game.
      </p>

      {/* Main content: Form and Results */}
      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Form takes up 3 columns on lg screens */}
        <div className="lg:col-span-3">
          <FadeInSection delay={100}>
            <Card className="border-primary/20 h-full">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl sm:text-2xl">
                    Path of Exile 2 Character Names
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    title="Randomize selections"
                    onClick={randomizeSelection}
                    disabled={isLoading}
                    className="self-start sm:self-auto"
                  >
                    <RefreshCw className="size-4 mr-2" />
                    Random
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-1 gap-6">
                      {/* Class Selection - Updated with value instead of defaultValue */}
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Character Class</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                              disabled={isLoading}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <ScrollArea className="">
                                  {POE2_CLASSES.map((classOption) => (
                                    <SelectItem
                                      key={classOption.id}
                                      value={classOption.id}
                                      className="flex items-center gap-2"
                                    >
                                      <div>
                                        <div>{classOption.name}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {selectedClass?.description}
                              {selectedClass && (
                                <span className="ml-2 inline-flex items-center">
                                  <Badge variant="outline" className="text-xs">
                                    {selectedClass.gender === 'masculine'
                                      ? 'Masculine Names'
                                      : selectedClass.gender === 'feminine'
                                      ? 'Feminine Names'
                                      : 'Neutral Names'}
                                  </Badge>
                                </span>
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Elemental Damage Types - As Radio Groups */}
                      <FormField
                        control={form.control}
                        name="elementalTag"
                        render={({ field }) => (
                          <FormItem>
                            <div className="mb-2">
                              <FormLabel className="flex items-center gap-2">
                                Primary Damage Type
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info
                                        size={14}
                                        className="text-muted-foreground cursor-help"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        Select the primary damage type your
                                        character specializes in.
                                        <br />
                                        This will influence name generation.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormDescription>
                                Select your character&apos;s main elemental
                                affinity
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {DAMAGE_TYPES.map((type) => (
                                <SelectionCard
                                  key={type.id}
                                  id={type.id}
                                  value={type.id}
                                  title={type.name}
                                  description={type.description}
                                  isSelected={field.value === type.id}
                                  onSelect={(value) => field.onChange(value)}
                                  disabled={isLoading}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Additional Styles */}
                      <FormField
                        control={form.control}
                        name="additionalStyles"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Styles (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. blood magic, celestial, corrupted, etc."
                                {...field}
                                disabled={isLoading}
                                className="w-full"
                              />
                            </FormControl>
                            <FormDescription>
                              Add any specific themes or characteristics for
                              your character
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        className="gap-2 w-full sm:w-auto"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="animate-spin h-4 w-4 text-current"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Generating...
                          </span>
                        ) : (
                          <>
                            <span>Generate {selectedClass?.name} Names</span>
                            <WandSparkles />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </FadeInSection>
        </div>

        {/* Results takes up 2 columns on lg screens */}
        <div className="lg:col-span-2 ">
          <PoE2Results
            result={result}
            selectedClass={selectedClass}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Lore Section - Now with updated styling to match form generator */}
      <FadeInSection delay={300}>
        <section className="container mx-auto max-w-4xl mb-16 text-muted-foreground">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="lore">
              <AccordionTrigger className="text-lg font-medium">
                Path of Exile 2 Lore
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-sm dark:prose-invert mt-4">
                  <p>
                    The events of Path of Exile 2 unfold twenty years after
                    Kitava, the Karui God of Corruption, was slain by the Exile
                    in the first Path of Exile. You&apos;ll play as a new Exile
                    in the dark world of Wraeclast, encountering figures from
                    the original story.
                  </p>

                  <h3 className="text-base font-medium mt-4">
                    Character Classes
                  </h3>
                  <p>
                    Path of Exile 2 features {POE2_CLASSES.length} playable
                    classes, each with 3 Ascendancies, creating{' '}
                    {POE2_CLASSES.length * 3} combinations to support various
                    playstyles. Six classes are inspired by the original Path of
                    Exile, while six are unique to PoE 2.
                  </p>

                  <div className="mt-4">
                    <h4 className="text-base font-medium">Damage Types</h4>
                    <p className="text-sm">
                      Path of Exile 2 features {DAMAGE_TYPES.length} core damage
                      types that influence character builds:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span className="font-medium">Physical:</span> Direct
                        damage mitigated by armor
                      </li>
                      <li>
                        <span className="font-medium">Fire:</span> Burns with
                        ignite effects
                      </li>
                      <li>
                        <span className="font-medium">Cold:</span> Slows and
                        freezes enemies
                      </li>
                      <li>
                        <span className="font-medium">Lightning:</span> Shocks
                        enemies, increases damage taken
                      </li>
                      <li>
                        <span className="font-medium">Chaos:</span> Bypasses
                        energy shield, applies poison
                      </li>
                      <li>
                        <span className="font-medium">Poison:</span> Causes
                        damage over time, ignoring armor and shields
                      </li>
                    </ul>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground italic">
                      Use this name generator to create perfect character names
                      that fit the dark fantasy style of Path of Exile 2&apos;s
                      world and the specific class you&apos;ve chosen to play.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </FadeInSection>
    </div>
  );
}

// Results component
function PoE2Results({
  result,
  selectedClass,
  isLoading,
}: {
  result: GeneratedNamesResult | null;
  selectedClass?: (typeof POE2_CLASSES)[number];
  isLoading: boolean;
}) {
  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    toast.success('Copied to clipboard', {
      description: `"${name}" has been copied to your clipboard.`,
    });
  };

  const saveToFavorites = (name: string) => {
    // Use the shared utility function with proper source
    const source = `Path of Exile 2 - ${selectedClass?.name || 'Character'}`;
    const added = saveNameToFavorites(name, source);

    if (added) {
      toast.success('Added to favorites', {
        description: `"${name}" has been saved to your favorites.`,
      });
    } else {
      toast.info('Already in favorites', {
        description: `"${name}" is already in your favorites.`,
      });
    }
  };

  if (!result && !isLoading) {
    return (
      <FadeInSection delay={200} className="h-full">
        <Card className="border-primary/20 h-full">
          <CardHeader className="pb-2">
            <CardTitle>
              {selectedClass
                ? `${selectedClass.name} Names`
                : 'Generated Names'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              Select options and click &quot;Generate&quot; to create character
              names.
            </div>
          </CardContent>
        </Card>
      </FadeInSection>
    );
  }

  return (
    <FadeInSection delay={200} className="h-full">
      <Card className="border-primary/20 h-full">
        <CardHeader className="pb-2">
          <CardTitle>
            {selectedClass ? `${selectedClass.name} Names` : 'Generated Names'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Generating names...</p>
            </div>
          ) : result?.names && result.names.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {result.names.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="flex items-center justify-between border rounded-md p-3 hover:bg-accent/40 transition-colors"
                >
                  <span className="font-medium">{name}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(name)}
                      title="Copy to clipboard"
                    >
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
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => saveToFavorites(name)}
                      title="Save to favorites"
                    >
                      <Heart className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {result?.message ||
                'No names generated yet. Try generating some names!'}
            </div>
          )}
        </CardContent>
      </Card>
    </FadeInSection>
  );
}
