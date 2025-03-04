'use client';

import { Wand, Wand2Icon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle closing the menu when window is resized to desktop size
  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
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
  };

  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800 p-3 md:p-4 relative">
      <div className="flex justify-between items-center container">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <span className="bg-gradient-to-r from-green-700 to-green-300 text-transparent bg-clip-text">
            NameGen
          </span>
          <Wand size={16} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative px-2 py-1 font-medium group overflow-hidden"
                  >
                    <span
                      className={`relative z-10 transition duration-300 ${
                        isActive ? 'text-primary font-semibold' : ''
                      }`}
                    >
                      {item.title}
                    </span>

                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary/70 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Hamburger Menu Button - Always visible in mobile view */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 relative focus:outline-none z-50"
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

      {/* Mobile Menu Overlay - Lighter shadow instead of black background */}
      <div
        className={`fixed inset-0 bg-black/15 bg-opacity-20 z-40 transition-opacity duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 shadow-[-10px_0px_15px_rgba(0,0,0,0.3)] w-9/12 bg-white dark:bg-zinc-900 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
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
                  <Link
                    href={item.href}
                    className="text-lg font-medium block py-2 text-right border-r-2 border-transparent hover:border-r-2 hover:border-primary pr-4 transition-all duration-300 ease-in-out"
                    onClick={toggleMenu}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
