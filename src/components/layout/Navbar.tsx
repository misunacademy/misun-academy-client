'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import Container from '../ui/container';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import MobileNavbar from './MobileNavbar';
import Image from 'next/image';
import { MisunLogo } from '@/assets/svg';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    const handleScroll = () => {
      const navbarHeight = navbar.offsetHeight;
      const sections = document.querySelectorAll<HTMLElement>(
        '[data-dark-section]'
      );

      // Check if any dark section is overlapping with the navbar
      const isOverDarkSection = Array.from(sections).some((section) => {
        const rect = section.getBoundingClientRect();
        // Check if the section is overlapping with the navbar area
        return rect.top <= navbarHeight && rect.bottom >= 0;
      });

      setIsDark(isOverDarkSection);
    };

    // Throttle the scroll event for better performance
    window.addEventListener('scroll', handleScroll);

    // Initial check on mount
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-[999] w-full">
      <div className="nav-mask-bg absolute z-10 h-full w-full bg-white/20 "></div>
      <div className="nav-mask-sm  absolute z-20 h-full w-full backdrop-blur-sm"></div>
      <div className="nav-mask-md absolute z-30 h-full w-full backdrop-blur-md"></div>
      <div className="nav-mask-lg absolute z-40 h-full w-full backdrop-blur-lg"></div>
      <Container className="relative z-50">
        <nav ref={navbarRef} className="h-16 flex items-center justify-between">
          <Link href="/">
            {/* <Logo /> */}
            <Image
              src={MisunLogo}
              alt="Misun Academy"
              width={100}
              height={100}
              className="h-8 w-auto pl-4 md:pl-0"
            />
            {/* <h1 className="text-2xl font-bold text-primary">Misun Academy</h1> */}
          </Link>
          <div className="flex items-center space-x-10">
            <div
              className={cn(
                'transition-all duration-300 hidden md:flex items-center space-x-10 ',
                {
                  'text-white': isDark,
                }
              )}
            >
              <Link href="/" className='hover:text-primary'>হোম</Link>
              <Link href="/courses" className='hover:text-primary'>কোর্স সম্পর্কে</Link>
              <Link href="/about" className='hover:text-primary'>আমাদের সম্পর্কে</Link>
              {/* <Link href="/blogs">Blogs</Link> */}
              <div className='flex items-end justify-end space-x-4'>
                <Link href={"/checkout"}>
                  <Button className='w-28'>এনরোল করুন</Button>
                </Link>
              </div>
            </div>
            <div className="md:hidden px-3">

              {/* <PhoneNavbar /> */}
              <MobileNavbar />
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
}
