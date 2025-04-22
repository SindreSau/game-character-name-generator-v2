'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { z } from 'zod';
import { WandSparkles, RefreshCw, RotateCcw } from 'lucide-react';
import { getNames } from '@/actions/get-names.server';
import { CharacterNameInput } from '@/types/name-generator';
import { toast } from 'sonner';
import { FadeInSection } from '@/components/general/fade-in-section';
import { useSessionStorage } from '@/hooks/use-session-storage';

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
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CustomSlider } from '../general/custom-slider';
import FormResults, { GeneratedNamesResult } from './form-results';

// Define validation schema with Zod
const formSchema = z.object({
  genre: z.string().min(1, 'Genre is required'),
  styles: z.string().default(''),
  complexity: z.number().min(1).max(5).default(3),
  gender: z.enum(['neutral', 'masculine', 'feminine']).default('neutral'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

type FormValues = z.infer<typeof formSchema>;

// Predefined options for form selects
const GENRE_OPTIONS = [
  'Fantasy',
  'RPG',
  'Sci-Fi',
  'Action',
  'FPS',
  'MMO',
  'Fighting',
  'Horror',
];

// Default values for form initialization
const DEFAULT_FORM_VALUES: FormValues = {
  genre: 'Fantasy',
  styles: '',
  complexity: 3,
  gender: 'neutral',
  length: 'medium',
};

// Style keywords suggestions for randomization
const STYLE_SUGGESTIONS = {
  Fantasy: ['Elven', 'Dwarf', 'Mystic', 'Ancient', 'Noble', 'Magical', 'Royal'],
  RPG: [
    'Adventurer',
    'Rogue',
    'Knight',
    'Wizard',
    'Ranger',
    'Paladin',
    'Druid',
  ],
  'Sci-Fi': [
    'Futuristic',
    'Cybernetic',
    'Galactic',
    'Alien',
    'Cyber',
    'Space',
    'Tech',
  ],
  Action: ['Heroic', 'Bold', 'Fierce', 'Brave', 'Daring', 'Tough', 'Resilient'],
  FPS: [
    'Tactical',
    'Soldier',
    'Gunner',
    'Operative',
    'Commando',
    'Sniper',
    'Elite',
  ],
  MMO: [
    'Legendary',
    'Guild',
    'Champion',
    'Veteran',
    'Master',
    'Epic',
    'Raider',
  ],
  Fighting: [
    'Martial',
    'Warrior',
    'Fighter',
    'Brawler',
    'Gladiator',
    'Monk',
    'Ninja',
  ],
  Horror: ['Sinister', 'Dark', 'Haunted', 'Grim', 'Eerie', 'Macabre', 'Gothic'],
};

export default function GenerateNamesForm() {
  // State for client-side mounting
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use session storage for persisting form values and results
  const [formValues, setFormValues] = useSessionStorage<FormValues>(
    'nameGeneratorForm',
    DEFAULT_FORM_VALUES
  );
  const [generatedResults, setGeneratedResults] =
    useSessionStorage<GeneratedNamesResult | null>(
      'generatedNameResults',
      null
    );

  // Use our stored result from session storage
  const [result, setResult] = useState<GeneratedNamesResult | null>(
    generatedResults
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: formValues, // Use persisted form values
  });

  // Set isMounted after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update form when stored form values change
  useEffect(() => {
    if (isMounted) {
      form.reset(formValues);
    }
  }, [isMounted, form, formValues]);

  // Save form state to session storage when values change
  useEffect(() => {
    if (!isMounted) return;

    const subscription = form.watch((values) => {
      if (values) {
        // Get all current values to ensure we have a complete state
        const currentValues = form.getValues();
        setFormValues(currentValues);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isMounted, setFormValues]);

  // Reset form to default values
  const resetForm = () => {
    form.reset(DEFAULT_FORM_VALUES);
    setFormValues(DEFAULT_FORM_VALUES);
    toast.info('Form has been reset to defaults');
  };

  // Randomize form values - now randomizes everything
  const randomizeForm = () => {
    // Get random values for each field
    const randomGenre =
      GENRE_OPTIONS[Math.floor(Math.random() * GENRE_OPTIONS.length)];

    // Gender randomization
    const genderOptions = ['neutral', 'masculine', 'feminine'];
    const randomGender = genderOptions[
      Math.floor(Math.random() * genderOptions.length)
    ] as 'neutral' | 'masculine' | 'feminine';

    // Length randomization
    const lengthOptions = ['short', 'medium', 'long'];
    const randomLength = lengthOptions[
      Math.floor(Math.random() * lengthOptions.length)
    ] as 'short' | 'medium' | 'long';

    // More varied complexity - truly random between 1-5
    const randomComplexity = Math.round((Math.random() * 4 + 1) * 10) / 10; // Random between 1.0-5.0 with 0.1 steps

    // Get 0-5 random style keywords for the selected genre
    const genreStyles =
      STYLE_SUGGESTIONS[randomGenre as keyof typeof STYLE_SUGGESTIONS] ||
      STYLE_SUGGESTIONS.Fantasy;
    const shuffledStyles = [...genreStyles].sort(() => 0.5 - Math.random());
    const numStyles = Math.floor(Math.random() * 6); // 0 to 5 styles - more variety
    const randomStyles = shuffledStyles.slice(0, numStyles).join(', ');

    // Create randomized values object
    const randomizedValues: FormValues = {
      genre: randomGenre,
      styles: randomStyles,
      complexity: randomComplexity,
      gender: randomGender,
      length: randomLength,
    };

    // Update form with random values AND ensure UI updates
    // This triggers a full re-render of controlled components
    form.reset(randomizedValues);

    // Force UI updates for specific fields to ensure they reflect the new values
    form.setValue('genre', randomGenre, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue('styles', randomStyles, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue('gender', randomGender, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue('length', randomLength, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.setValue('complexity', randomComplexity, {
      shouldDirty: true,
      shouldTouch: true,
    });

    // Update session storage with the randomized values
    sessionStorage.setItem(
      'nameGeneratorForm',
      JSON.stringify(randomizedValues)
    );

    toast.success('Form completely randomized!', {
      description: `Created a ${randomGender} ${randomLength} ${randomGenre} character with complexity ${randomComplexity}`,
    });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Convert comma-separated string to array and trim each value
      const stylesArray = data.styles
        ? data.styles
            .split(',')
            .map((style) => style.trim())
            .filter((style) => style.length > 0)
        : [];

      const input: CharacterNameInput = {
        ...data,
        styles: stylesArray,
      };

      // Await the promise and cast its resolved value.
      const response = await getNames(input);
      const typedResponse = response as unknown as GeneratedNamesResult;

      // Update both states
      setResult(typedResponse);
      setGeneratedResults(typedResponse);
    } catch (error) {
      console.error('Error generating names:', error);
      const errorResult: GeneratedNamesResult = {
        success: false,
        message: 'An unexpected error occurred',
        names: [],
      };
      setResult(errorResult);
      setGeneratedResults(errorResult);

      toast.error('Failed to generate names', {
        description: 'There was an error processing your request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Conditionally render client-specific content
  if (!isMounted) {
    // Return a simple loading state or skeleton that matches the structure
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[600px] bg-background/30 rounded-lg animate-pulse" />
          <div className="h-[600px] bg-background/30 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {/* Form Section */}
        <FadeInSection delay={100}>
          <Card className="h-full backdrop-blur-md bg-background/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground flex justify-between items-center">
                <h2>Create Names</h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    title="Randomize form values"
                    onClick={randomizeForm}
                    disabled={isLoading}
                  >
                    <RefreshCw className="size-4 mr-1" />
                    Randomize
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    title="Reset form to defaults"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    <RotateCcw className="size-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Genre Field */}
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Genre</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} // Use value instead of defaultValue
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GENRE_OPTIONS.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Styles Field */}
                  <FormField
                    control={form.control}
                    name="styles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Styles</FormLabel>
                        <FormDescription>
                          Describe your character with a few keywords
                        </FormDescription>
                        <FormControl>
                          <Input
                            placeholder="Viking, Warrior, Nordic"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Gender Toggle */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender Leaning</FormLabel>
                        <FormControl>
                          <Tabs
                            onValueChange={field.onChange}
                            value={field.value} // Use value instead of defaultValue
                            className="w-full"
                            aria-label="Gender options"
                          >
                            <TabsList className="grid grid-cols-3 w-full">
                              <TabsTrigger value="neutral">Neutral</TabsTrigger>
                              <TabsTrigger value="masculine">
                                Masculine
                              </TabsTrigger>
                              <TabsTrigger value="feminine">
                                Feminine
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name Length Toggle */}
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name Length</FormLabel>
                        <FormControl>
                          <Tabs
                            onValueChange={field.onChange}
                            value={field.value} // Use value instead of defaultValue
                            className="w-full"
                            aria-label="Name length options"
                          >
                            <TabsList className="grid grid-cols-3 w-full">
                              <TabsTrigger value="short">Short</TabsTrigger>
                              <TabsTrigger value="medium">Medium</TabsTrigger>
                              <TabsTrigger value="long">Long</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Complexity Slider */}
                  <FormField
                    control={form.control}
                    name="complexity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel id="complexity-slider-label">
                          Complexity : {field.value}
                        </FormLabel>
                        <FormControl>
                          <div className="relative py-2">
                            <CustomSlider
                              min={1}
                              max={5}
                              step={0.1}
                              defaultValue={[field.value]}
                              value={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="w-full"
                              aria-labelledby="complexity-slider-label"
                            />
                          </div>
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Simple</span>
                          <span>Complex</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        <span>Generate Names</span>
                        <WandSparkles />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </FadeInSection>

        {/* Results Section */}
        <FormResults result={result} isLoading={isLoading} />
      </div>
    </div>
  );
}
