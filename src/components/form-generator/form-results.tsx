'use client';

import { Copy, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeInSection } from '@/components/general/fade-in-section';
import Spinner from '../general/spinner';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/use-localstorage';

// Define the type for results
export type GeneratedNamesResult = {
  success: boolean;
  message: string;
  names: string[];
  provider?: string;
};

interface FormResultsProps {
  result: GeneratedNamesResult | null;
  isLoading: boolean;
}

export default function FormResults({ result, isLoading }: FormResultsProps) {
  // Use our local storage hook for favorites
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    'favoriteNames',
    []
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard', {
        description: `"${text}" has been copied.`,
        duration: 1500,
      });
    });
  };

  const toggleFavorite = (name: string) => {
    if (favorites.includes(name)) {
      // Remove from favorites
      setFavorites(favorites.filter((favorite) => favorite !== name));
      toast.success('Removed from favorites', {
        description: `"${name}" has been removed from your favorites.`,
        duration: 1500,
      });
    } else {
      // Add to favorites
      setFavorites([...favorites, name]);
      toast.success('Added to favorites', {
        description: `"${name}" has been added to your favorites.`,
        action: {
          label: 'Go to Favorites',
          onClick: () => {
            // Navigate to the favorites page
            window.location.href = '/favorites';
          },
        },
        duration: 1500,
      });
    }
  };

  const isFavorite = (name: string) => favorites.includes(name);

  return (
    <FadeInSection delay={150}>
      <Card className="h-full backdrop-blur-md bg-background/30">
        <CardHeader>
          <CardTitle className="text-foreground">
            <h2>Generated Names</h2>
          </CardTitle>
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
                      <FadeInSection
                        delay={200 + index * 50}
                        key={index}
                        observeScroll={false}
                      >
                        <div className="flex justify-between items-center bg-secondary px-4 py-2 rounded-lg border border-border hover:border-primary transition-all">
                          <span className="text-lg">{name}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(name)}
                              title={
                                isFavorite(name)
                                  ? 'Remove from favorites'
                                  : 'Add to favorites'
                              }
                              className="cursor-pointer"
                            >
                              <Heart
                                size={18}
                                fill={
                                  isFavorite(name)
                                    ? 'currentColor'
                                    : 'transparent'
                                }
                                className={
                                  isFavorite(name)
                                    ? 'text-rose-500'
                                    : 'text-muted-foreground'
                                }
                              />
                            </Button>
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
                        </div>
                      </FadeInSection>
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
              <p className="text-muted-foreground">No names generated yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </FadeInSection>
  );
}
