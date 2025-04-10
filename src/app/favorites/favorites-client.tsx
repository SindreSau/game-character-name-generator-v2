'use client';

import { useState, useEffect } from 'react';
import { FadeInSection } from '@/components/general/fade-in-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Trash2, Info } from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  FavoriteName,
  getAllFavorites,
  removeFavorite,
  clearAllFavorites,
  formatFavoriteDate,
} from '@/utils/favorites';

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<FavoriteName[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load favorites when the component mounts
  useEffect(() => {
    setIsClient(true);

    // Get favorites from localStorage
    const loadedFavorites = getAllFavorites();
    setFavorites(loadedFavorites);
  }, []);

  // Remove a favorite
  const handleRemoveFavorite = (index: number) => {
    const removedName = removeFavorite(index);
    if (removedName) {
      // Update the state with the new favorites list
      setFavorites(getAllFavorites());
      toast.success('Name removed from favorites', {
        description: `"${removedName}" has been removed from your favorites.`,
      });
    }
  };

  // Clear all favorites
  const handleClearAllFavorites = () => {
    if (clearAllFavorites()) {
      setFavorites([]);
      toast.success('All favorites cleared', {
        description: 'All saved names have been removed from your favorites.',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FadeInSection delay={50}>
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          My Favorite Names
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-3xl mx-auto">
          View and manage your saved character names
        </p>
      </FadeInSection>

      <FadeInSection delay={100}>
        <div className="max-w-4xl mx-auto">
          {!isClient ? (
            // Loading state while checking localStorage
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading favorites...</p>
            </div>
          ) : favorites.length > 0 ? (
            <>
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllFavorites}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Favorites
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                {favorites.map((favorite, index) => (
                  <Card
                    key={`${favorite.name}-${index}`}
                    className="border-primary/20"
                  >
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-lg">
                        {favorite.name || 'Unnamed'}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFavorite(index)}
                        className="text-muted-foreground hover:text-destructive"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1 text-primary" />
                          <span>{favorite.source || 'Unknown source'}</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center cursor-help">
                                <Info className="h-3 w-3 mr-1" />
                                <span>
                                  {formatFavoriteDate(favorite.timestamp)}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Added to favorites on{' '}
                                {favorite.timestamp
                                  ? new Date(
                                      favorite.timestamp
                                    ).toLocaleString()
                                  : 'Unknown date'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card className="border-primary/20">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  When you find character names you like, save them to your
                  favorites by clicking the heart icon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </FadeInSection>
    </div>
  );
}
