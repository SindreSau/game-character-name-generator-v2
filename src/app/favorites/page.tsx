import { Metadata } from 'next';
import FavoritesClient from './favorites-client';

export const metadata: Metadata = {
  title: 'Your Favorite Names',
  description: 'View and manage your saved character names',
  keywords: 'favorites, saved names, character names, game names',
  alternates: {
    canonical: 'https://gamenamegen.site/favorites',
  },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
