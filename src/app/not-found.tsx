'use client';

import Link from 'next/link';
import { FadeInSection } from '@/components/general/fade-in-section';
import { Button } from '@/components/ui/button';
import { Home, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const NotFoundPage = () => {
  // State for interactive glitch effect
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Create randomized glitch effect
    const scheduleNextGlitch = () => {
      // Random time between 1 and 3 seconds for the next glitch
      const nextGlitchDelay = Math.random() * 2000 + 1000;

      const glitchTimeout = setTimeout(() => {
        setIsGlitching(true);

        // Random glitch duration between 50ms and 120ms
        const glitchDuration = Math.random() * 70 + 50;

        setTimeout(() => {
          setIsGlitching(false);
          scheduleNextGlitch();
        }, glitchDuration);
      }, nextGlitchDelay);

      return glitchTimeout;
    };

    const timeout = scheduleNextGlitch();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh] flex flex-col items-center justify-center">
      <FadeInSection delay={100}>
        {/* 3D-style floating character - cool element */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-teal-500/20 animate-float flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/50 to-teal-500/30 absolute animate-float-delayed" />
            <Wand2 size={32} className="text-primary/70 animate-pulse" />
          </div>

          {/* Shadow effect */}
          <div className="w-16 h-2 bg-black/10 dark:bg-white/5 rounded-full mx-auto mt-3 blur-sm" />
        </div>
      </FadeInSection>

      <FadeInSection delay={200}>
        <div className="text-center max-w-md">
          <h1
            className={`text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-teal-500/50 
              ${isGlitching ? 'glitch-text' : ''}`}
            style={{
              textShadow: isGlitching
                ? '1px 1px 3px rgba(0,255,0,0.25), -1px -1px 3px rgba(0,255,0,0.25)'
                : 'none',
            }}
          >
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The name generator couldn&apos;t find the page you&apos;re looking
            for. Perhaps it was teleported to another dimension?
          </p>

          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home size={16} />
              Home
            </Link>
          </Button>
        </div>
      </FadeInSection>

      {/* Add CSS for the glitch effect */}
      <style jsx global>{`
        @keyframes glitch {
          0% {
            text-shadow: 1px 1px 3px rgba(0, 255, 0, 0.25),
              -1px -1px 3px rgba(0, 255, 0, 0.25);
            transform: translate(0);
          }
          20% {
            text-shadow: -1px 1px 3px rgba(0, 255, 0, 0.3),
              1px -1px 3px rgba(0, 255, 0, 0.3);
            transform: translate(0.5px, 0.5px);
          }
          40% {
            text-shadow: 1px -1px 3px rgba(0, 255, 0, 0.25),
              -1px 1px 3px rgba(0, 255, 0, 0.25);
            transform: translate(-0.5px, -0.5px);
          }
          60% {
            text-shadow: -1px -1px 3px rgba(0, 255, 0, 0.3),
              1px 1px 3px rgba(0, 255, 0, 0.3);
            transform: translate(0.5px, -0.5px);
          }
          80% {
            text-shadow: 0.5px 0.5px 2px rgba(0, 255, 0, 0.25),
              -0.5px -0.5px 2px rgba(0, 255, 0, 0.25);
            transform: translate(-0.25px, 0.25px);
          }
          100% {
            text-shadow: 1px 1px 3px rgba(0, 255, 0, 0.25),
              -1px -1px 3px rgba(0, 255, 0, 0.25);
            transform: translate(0);
          }
        }

        .glitch-text {
          animation: glitch 0.25s steps(5) 1;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) scale(0.8);
          }
          50% {
            transform: translateY(-5px) scale(0.9);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
