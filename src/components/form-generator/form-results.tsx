'use client';

import { Copy, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeInSection } from '@/components/general/fade-in-section';
import Spinner from '../general/spinner';
import { toast } from 'sonner';
import { saveNameToFavorites } from '@/utils/favorites';

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
  const copyToClipboard = (text: string) => {
    // Create a temporary textarea element to handle mobile compatibility
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Make the textarea invisible but part of the document
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '0';
    textArea.style.top = '0';

    document.body.appendChild(textArea);

    // Handle iOS devices specifically
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // For iOS devices
      const range = document.createRange();
      range.selectNodeContents(textArea);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, text.length);
    } else {
      // For other devices
      textArea.select();
    }

    // Try using the modern clipboard API first
    const copySuccessful = () => {
      document.body.removeChild(textArea);
      toast.success('Copied to clipboard', {
        description: `"${text}" has been copied.`,
        duration: 1500,
      });
    };

    const copyFailed = (err?: unknown) => {
      console.error('Failed to copy text: ', err);
      document.body.removeChild(textArea);
      toast.error('Could not copy to clipboard', {
        description: 'Please try selecting and copying the text manually.',
        duration: 2000,
      });
    };

    // Try the modern approach first, then fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(copySuccessful)
        .catch(copyFailed);
    } else {
      // Fallback for older browsers (might not work in all contexts)
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          copySuccessful();
        } else {
          copyFailed();
        }
      } catch (err) {
        copyFailed(err);
      }
    }
  };

  // Save a name to favorites using the shared utility
  const handleSaveToFavorites = (name: string) => {
    // Use the shared utility function with source information
    const source = 'Form Generator';
    const added = saveNameToFavorites(name, source);

    if (added) {
      toast.success('Added to favorites', {
        description: `"${name}" has been saved to your favorites.`,
        action: {
          label: 'Go to Favorites',
          onClick: () => {
            window.location.href = '/favorites';
          },
        },
        duration: 1500,
      });
    } else {
      toast.info('Already in favorites', {
        description: `"${name}" is already in your favorites.`,
      });
    }
  };

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
                              onClick={() => copyToClipboard(name)}
                              title="Copy to clipboard"
                              className="cursor-pointer"
                            >
                              <Copy size={18} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSaveToFavorites(name)}
                              title="Add to favorites"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <Heart className="h-4 w-4" />
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
