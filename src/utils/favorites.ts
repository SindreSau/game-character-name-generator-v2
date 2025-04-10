// Shared type for favorite names
export type FavoriteName = {
  name: string;
  source: string;
  timestamp: string;
};

/**
 * Save a name to favorites in localStorage
 */
export function saveNameToFavorites(name: string, source: string): boolean {
  try {
    // Get existing favorites
    const existingFavoritesJSON = localStorage.getItem('favoriteNames') || '[]';
    let existingFavorites: FavoriteName[] = [];

    try {
      existingFavorites = JSON.parse(existingFavoritesJSON);
      // Ensure it's an array
      if (!Array.isArray(existingFavorites)) {
        existingFavorites = [];
      }
    } catch (error) {
      console.error('Error parsing favorites:', error);
      existingFavorites = [];
    }

    // Add new favorite with metadata
    const newFavorite: FavoriteName = {
      name,
      source,
      timestamp: new Date().toISOString(),
    };

    // Check if already exists
    const alreadyExists = existingFavorites.some((fav) => fav.name === name);

    // Add to favorites if not already present
    if (!alreadyExists) {
      existingFavorites = [newFavorite, ...existingFavorites];
      localStorage.setItem('favoriteNames', JSON.stringify(existingFavorites));
      return true; // Added successfully
    }

    return false; // Already exists
  } catch (error) {
    console.error('Error saving to favorites:', error);
    return false;
  }
}

/**
 * Get all favorites from localStorage
 */
export function getAllFavorites(): FavoriteName[] {
  try {
    const favoritesJSON = localStorage.getItem('favoriteNames');
    if (!favoritesJSON) return [];

    const parsed = JSON.parse(favoritesJSON);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

/**
 * Remove a favorite by index
 */
export function removeFavorite(index: number): string | null {
  try {
    const favorites = getAllFavorites();
    if (index < 0 || index >= favorites.length) return null;

    const removed = favorites[index];
    favorites.splice(index, 1);
    localStorage.setItem('favoriteNames', JSON.stringify(favorites));
    return removed.name;
  } catch (error) {
    console.error('Error removing favorite:', error);
    return null;
  }
}

/**
 * Clear all favorites
 */
export function clearAllFavorites(): boolean {
  try {
    localStorage.removeItem('favoriteNames');
    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return false;
  }
}

/**
 * Format a date string for display
 */
export function formatFavoriteDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error('Date formatting error:', e);
    return 'Unknown date';
  }
}
