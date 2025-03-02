import NameGeneratorForm from '@/components/NameGeneratorForm';

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Game Name Generator
      </h1>
      <NameGeneratorForm />
    </main>
  );
}
