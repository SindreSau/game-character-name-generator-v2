'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center">
        Let&apos;s generate some names!
      </h1>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-lg">
              Are you tired of trying to figure out unique names over and over
              for your characters?
            </p>
            <p className="text-lg">
              Are you a game developer, writer or similar and need some creative
              nudges?
            </p>
            <p className="text-lg font-semibold text-primary">
              Here&apos;s the tool for you!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
