'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wand2, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const NAV_ITEMS = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About',
    href: '/about',
  },
];

const GENERATOR_ITEMS = [
  {
    title: 'Character Name Generator',
    href: '/form-generator',
    description:
      'Create custom names for game characters with full control over style and genre.',
  },
  {
    title: 'Preset Name Generator',
    href: '#',
    description: 'Coming soon - Generate names based on popular game presets.',
    disabled: true,
  },
];

// Type definitions for the NavLink props
interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isGeneratorsOpen, setIsGeneratorsOpen] = useState(false);

  // Handle closing the menu when window is resized to desktop size
  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (!isMounted) return;

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen, isMounted]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsGeneratorsOpen(false);
  };

  const toggleGenerators = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGeneratorsOpen(!isGeneratorsOpen);
  };

  // Custom NavigationMenuLink that uses Next Link
  const NavLink = ({ href, children, className, ...props }: NavLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={cn(
          'px-4 py-2 text-sm font-medium hover:text-primary transition-colors',
          isActive && 'text-primary',
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="border-b border-zinc-800 p-3 md:p-4 relative">
      <div className="flex justify-between items-center container lg:pr-16  2xl:pr-0">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <span className="bg-gradient-to-r from-primary to-teal-500 text-transparent bg-clip-text font-semibold">
            NameGen
          </span>
          <Wand2 size={16} />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              {NAV_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavLink href={item.href}>{item.title}</NavLink>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors bg-transparent hover:bg-transparent data-[state=open]:bg-transparent focus:bg-transparent data-[state=open]:text-primary">
                  <span>Name Generators</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[350px]">
                    {GENERATOR_ITEMS.map((item) => (
                      <li key={item.title} className="relative">
                        {item.disabled ? (
                          <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none bg-muted/50 cursor-not-allowed">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium leading-none">
                                {item.title}
                              </span>
                              <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                                Coming Soon
                              </span>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Hamburger Menu Button - Always visible in mobile view */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-6 h-6 relative focus:outline-none z-50"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'rotate-45 translate-y-[8px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-current mt-1.5 transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-current mt-1.5 transition-all duration-300 ease-in-out ${
              isMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/15 bg-opacity-20 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 shadow-[-10px_0px_15px_rgba(0,0,0,0.3)] w-9/12 bg-white dark:bg-zinc-900 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="p-6 h-full flex flex-col">
          <nav className="flex-1 mt-8">
            <ul className="space-y-6">
              {NAV_ITEMS.map((item, index) => (
                <li
                  key={item.href}
                  className={`transform transition-all duration-500 ease-out ${
                    isMenuOpen
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-8 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 150}ms` : '0ms',
                  }}
                >
                  <div className="flex justify-end">
                    <Link
                      href={item.href}
                      className="text-lg font-medium py-2 text-right border-r-2 border-transparent hover:border-r-2 hover:border-primary pr-4 transition-all duration-300 ease-in-out"
                      onClick={toggleMenu}
                    >
                      {item.title}
                    </Link>
                  </div>
                </li>
              ))}

              {/* Mobile generators section as accordion */}
              <li
                className={`transform transition-all duration-500 ease-out ${
                  isMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-8 opacity-0'
                }`}
                style={{
                  transitionDelay: isMenuOpen
                    ? `${NAV_ITEMS.length * 150}ms`
                    : '0ms',
                }}
              >
                <div className="flex justify-end">
                  <button
                    onClick={toggleGenerators}
                    className="text-lg font-medium py-2 text-right border-r-2 border-transparent hover:border-r-2 hover:border-primary pr-4 transition-all duration-300 ease-in-out flex items-center"
                  >
                    Name Generators
                    <ChevronRight
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        isGeneratorsOpen ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                </div>

                <ul
                  className={`mt-2 space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    isGeneratorsOpen
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  {GENERATOR_ITEMS.map((item) => (
                    <li key={item.title} className="py-1">
                      <div className="flex justify-end">
                        {item.disabled ? (
                          <div className="text-right pr-4 pl-6 py-1 text-sm text-muted-foreground">
                            {item.title}{' '}
                            <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded ml-1">
                              Soon
                            </span>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            className="text-right pr-4 pl-6 py-1 text-sm hover:text-primary transition-colors"
                            onClick={toggleMenu}
                          >
                            {item.title}{' '}
                            <ArrowRight className="inline ml-1 h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
