'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Heart, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { FadeInSection } from '@/components/general/fade-in-section';
import { useLocalStorage } from '@/hooks/use-localstorage';
import Spinner from '@/components/general/spinner';

export default function FavoritesClient() {
  // Use our localStorage hook for favorites
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    'favoriteNames',
    []
  );
  const [mounted, setMounted] = useState(false);

  // Handle client-side rendering for localStorage access
  useEffect(() => {
    setMounted(true);
  }, []);

  const removeFavorite = (name: string) => {
    const originalFavorites = [...favorites];
    setFavorites(favorites.filter((favorite) => favorite !== name));
    toast.success('Removed from favorites', {
      description: `"${name}" has been removed from your favorites.`,
      action: {
        label: 'Undo',
        onClick: () => {
          setFavorites(originalFavorites); // Restore the original favorites
        },
      },
      closeButton: true,
      duration: 6000,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard', {
        description: `"${text}" has been copied.`,
        duration: 1500,
      });
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    toast.success('Favorites cleared', {
      description: 'All favorites have been removed.',
      duration: 1500,
    });
  };

  // Don't render favorites until client-side
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-teal-500/50">
            Your Favorite Names
          </h1>
          <Card className="border-primary/20">
            <CardContent className="py-12">
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <FadeInSection delay={50}>
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-teal-500/50">
          Your Favorite Names
        </h1>
      </FadeInSection>

      <div className="mx-auto mb-12">
        <FadeInSection delay={100}>
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-foreground">
                <div className="flex items-center gap-2">Saved Names</div>
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href="/form-generator"
                  className="flex items-center gap-1"
                >
                  <ArrowLeft size={16} />
                  Back to Generator
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {favorites.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {favorites.map((name, index) => (
                      <FadeInSection
                        delay={150 + index * 50}
                        key={index}
                        observeScroll={false}
                      >
                        <div className="flex justify-between items-center bg-secondary px-4 py-3 rounded-lg border border-border hover:border-primary transition-all">
                          <span className="md:text-lg overflow-x-auto">
                            {name}
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFavorite(name)}
                              title="Remove from favorites"
                              className="cursor-pointer text-rose-500 hover:text-rose-700 hover:bg-background/50"
                            >
                              <Heart size={18} fill="currentColor" />
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

                  <FadeInSection delay={200}>
                    <div className="flex justify-end mt-6">
                      <Button
                        variant="destructive"
                        onClick={clearAllFavorites}
                        className="flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Clear All Favorites
                      </Button>
                    </div>
                  </FadeInSection>
                </div>
              ) : (
                <FadeInSection delay={150}>
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-muted rounded-lg">
                    <Heart size={48} className="text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      No favorites saved yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Generate names and mark them as favorites to see them here
                    </p>
                    <Button asChild>
                      <Link href="/form-generator">Go to Name Generator</Link>
                    </Button>
                  </div>
                </FadeInSection>
              )}
            </CardContent>
          </Card>
        </FadeInSection>

        {favorites.length > 0 && (
          <FadeInSection delay={250}>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-6 px-4 md:px-0">
                Need more character names for your game or story?
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link href="/form-generator">Generate more names</Link>
              </Button>
            </div>
          </FadeInSection>
        )}
      </div>
    </div>
  );
}
