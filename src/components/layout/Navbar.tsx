'use client';

import { memo, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Container from '../ui/container';
import { cn } from '@/lib/utils';
import MobileNavbar from './MobileNavbar';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import MisunLogo from '@/assets/svg/misun-logo-svg.svg';


const NavbarAuthSection = dynamic(() => import('./NavbarAuthSection'), {
  ssr: false,
  loading: () => (
    <Link
      href="/auth"
      className={cn('relative group py-2 font-bold text-primary-glow')}
    >
      <span className="transition-colors duration-300 group-hover:text-primary">লগইন</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-300 ease-out" />
    </Link>
  ),
});

const NAV_LINKS = [
  { name: 'হোম', path: '/' },
  { name: 'কোর্সের বিস্তারিত', path: '/courses' },
  { name: 'শিক্ষার্থীদের মতামত', path: '/feedback' },
  { name: 'আমাদের সম্পর্কে', path: '/about' },
  { name: 'বুটক্যাম্প', path: '/bootcamp' },
  { name: 'প্রফেশনাল ইংলিশ', path: `${process.env.NEXT_PUBLIC_EP_FRONTEND_URL}/` },
] as const;

const Navbar = memo(function Navbar() {
  const [isHydrated, setIsHydrated] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={navbarRef}
      className="sticky text-white top-0 z-[999] w-full transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] bg-surface-darker backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
    >
      <Container className="relative z-50 max-w-7xl mx-auto">
        <nav className="h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src={MisunLogo}
              alt="Misun Academy"
              width={100}
              height={100}
              loading="eager"
              className="h-8 w-auto pl-4 md:pl-0"
            />
          </Link>
          <div className="flex items-center space-x-8">
            <div
              className={cn(
                'transition-all duration-500 hidden md:flex items-center space-x-5 font-bold tracking-wide text-white ',
              )}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative group py-2"
                >
                  <span className="group-hover:text-primary transition-colors duration-300 text-xs">
                    {link.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              ))}

              <NavbarAuthSection hydrated={isHydrated} />
            </div>
            <div className="md:hidden px-3">
              <MobileNavbar />
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
});

export default Navbar;
