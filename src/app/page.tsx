
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-primary/10 animate-ping" />
          <div className="relative p-4 bg-primary/10 rounded-full">
            <BrainCircuit className="w-16 h-16 text-primary" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Fiftino TaskZen
            </h1>
            <p className="text-lg text-muted-foreground">
            Organizing your work, one task at a time.
            </p>
        </div>
      </div>
    </div>
  );
}
