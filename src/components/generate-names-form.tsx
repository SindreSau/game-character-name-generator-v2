'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Copy, GripHorizontal, WandSparkles } from 'lucide-react';
import { generateCharacterNames } from '@/actions/get-names.server';
import { CharacterNameInput } from '@/types/name-generator';
import { toast } from 'sonner';

// shadcn/ui components
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
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Spinner from './general/spinner';

// Define a type for the resolved value
type ResolvedGenerateCharacterNamesReturnType = {
  success: boolean;
  message: string;
  names: string[];
  provider?: string;
};

// Define validation schema with Zod
const formSchema = z.object({
  genre: z.string().min(1, 'Genre is required'),
  styles: z.string(),
  complexity: z.number().min(1).max(10).default(5),
  gender: z.enum(['neutral', 'masculine', 'feminine']).default('neutral'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
});

type FormValues = z.infer<typeof formSchema>;

// Predefined options for form selects
const GENRE_OPTIONS = [
  'Fantasy',
  'Sci-Fi',
  'Horror',
  'Action',
  'RPG',
  'FPS',
  'MMO',
  'Fighting',
];

export default function GenerateNamesForm() {
  // Use the resolved type for state
  const [result, setResult] =
    useState<ResolvedGenerateCharacterNamesReturnType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genre: 'Fantasy',
      styles: '',
      complexity: 3,
      gender: 'neutral',
      length: 'medium',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Convert comma-separated string to array and trim each value
      const stylesArray = data.styles
        .split(',')
        .map((style) => style.trim())
        .filter((style) => style.length > 0);

      const input: CharacterNameInput = {
        ...data,
        styles: stylesArray,
      };

      // Await the promise and cast its resolved value.
      const response = await generateCharacterNames(input);
      setResult(
        response as unknown as ResolvedGenerateCharacterNamesReturnType
      );
    } catch (error) {
      console.error('Error generating names:', error);
      const errorResult: ResolvedGenerateCharacterNamesReturnType = {
        success: false,
        message: 'An unexpected error occurred',
        names: [],
      };
      setResult(errorResult);

      toast.error('Failed to generate names', {
        description: 'There was an error processing your request.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard', {
        description: `"${text}" has been copied.`,
        duration: 1500,
      });
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-30rem)]">
        {/* Form Section */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground">Create Names</CardTitle>
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
                          defaultValue={field.value}
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
                        <FormControl>
                          <Input
                            placeholder="Elegant, Mysterious, Epic (comma separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter styles separated by commas
                        </FormDescription>
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
                            defaultValue={field.value}
                            className="w-full"
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
                            defaultValue={field.value}
                            className="w-full"
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
                        <FormLabel>Complexity: {field.value}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="w-full"
                            />
                            <div className="absolute -top-1 left-0 right-0 pointer-events-none flex justify-between opacity-0">
                              <GripHorizontal
                                size={16}
                                className="text-primary opacity-70"
                              />
                            </div>
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
        </div>

        {/* Results Section */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-foreground">Generated Names</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center size-full">
                  <Spinner />
                </div>
              ) : result ? (
                <div>
                  {result.success ? (
                    result.names && result.names.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {result.names.map((name: string, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center bg-secondary p-3 rounded-lg border border-border hover:border-primary transition-all"
                          >
                            <span className="text-lg">{name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(name)}
                              title="Copy to clipboard"
                              className="cursor-pointer"
                            >
                              <Copy size={18} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No names were generated.
                      </p>
                    )
                  ) : (
                    <div className="text-destructive p-4 border border-destructive bg-destructive/10 rounded-lg">
                      <p className="font-medium">Error</p>
                      <p>{result.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-muted rounded-lg">
                  <p className="text-muted-foreground">
                    No names generated yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
