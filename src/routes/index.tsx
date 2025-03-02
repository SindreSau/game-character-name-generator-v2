'use client';

import NameGeneratorForm from '@/components/NameGeneratorForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Character Name Generator</h1>
      <NameGeneratorForm />
    </div>
  );
}

export default HomeComponent;
