import { Metadata } from 'next';
import FavoritesClient from './favorites-client';

export const metadata: Metadata = {
  title: 'Your Favorite Names',
  description: 'View and manage your saved character names',
  keywords: 'favorites, saved names, character names, game names',
  alternates: {
    canonical: 'https://gamenamegen.site/favorites',
  },
  openGraph: {
    title: 'Your Favorite Names | Game Name Generator',
    description: 'View and manage your saved character names',
    url: 'https://gamenamegen.site/favorites',
    siteName: 'Game Name Generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Favorite Names | Game Name Generator',
    description: 'View and manage your saved character names',
  },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
