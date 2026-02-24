/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import Container from '../ui/container';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import MobileNavbar from './MobileNavbar';
import Image from 'next/image';
import MisunLogo from '@/assets/svg/misun-logo-svg.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, UserCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // ensure SSR/CSR markup match
  const navbarRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Normalize role to the dashboard segment used in routes
  const getDashboardSegment = (role?: string) => {
    const normalized = role?.toLowerCase();
    const map: Record<string, string> = {
      superadmin: 'admin',
      admin: 'admin',
      instructor: 'admin',
      learner: 'student',
      student: 'student',
    };
    return map[normalized ?? ''] ?? 'student';
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/');
    }
  };

  useEffect(() => {
    // Defer to next paint to avoid synchronous setState warning
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
      setIsScrolled(window.scrollY > 50);
    };

    // Throttle the scroll event for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check on mount
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use a safe user value that matches the server render until hydration completes
  const safeUser = isHydrated ? user : null;
  const userRole = (safeUser as any)?.role;

  return (
    <div className={cn(
      "fixed top-0 z-[999] w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
      isScrolled
        ? "bg-[#060f0a]/95 backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
        : "bg-transparent border-b border-transparent"
    )}>
      {!isScrolled && (
        <>
          <div className="nav-mask-bg absolute z-10 h-full w-full bg-black/10 transition-opacity duration-500 delay-100"></div>
          <div className="nav-mask-sm absolute z-20 h-full w-full backdrop-blur-sm transition-opacity duration-500 delay-150"></div>
          <div className="nav-mask-md absolute z-30 h-full w-full backdrop-blur-md transition-opacity duration-500 delay-200"></div>
        </>
      )}
      {/* Scrolled state: subtle primary glow along bottom edge */}
      {isScrolled && (
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      )}
      <Container className="relative z-50 max-w-7xl mx-auto">
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
          <div className="flex items-center space-x-8">
            <div
              className={cn(
                'transition-all duration-500 hidden md:flex items-center space-x-10 font-bold tracking-wide',
                {
                  'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]': !isScrolled,
                  'text-white/85': isScrolled,
                }
              )}
            >
              {[
                { name: 'হোম', path: '/' },
                { name: 'কোর্স সম্পর্কে', path: '/courses' },
                { name: 'শিক্ষার্থীদের মতামত', path: '/feedback' },
                { name: 'আমাদের সম্পর্কে', path: '/about' },
              ].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="relative group py-2"
                >
                  <span className="group-hover:text-primary transition-colors duration-300">
                    {link.name}
                  </span>
                  {/* Hover Underline effect */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              ))}

              {!safeUser ? (
                <Link
                  href={"/auth"}
                  className={cn("relative group py-2 font-bold text-primary-glow drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]")}
                >
                  <span className="transition-colors duration-300 group-hover:text-white">লগইন</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              ) : null}
              {/* <div className='flex items-end justify-end space-x-4'>
                <Link href={"/checkout"}>
                  <Button variant="creative" className='w-full sm:w-auto px-6 py-2 h-auto text-sm' onClick={() => {
                    // Use helper to ensure event is queued even if pixel isn't loaded yet
                    import('@/lib/metaPixel').then(({ track }) => track('InitiateCheckout', {
                      content_name: 'Graphic Design Course',
                      content_type: 'course',
                      value: 4000,
                      currency: 'BDT',
                    }));
                  }}>এনরোল করুন</Button>
                </Link>
              </div> */}
              <div className="flex items-center justify-end">
                <Link href="/checkout" className="w-full sm:w-auto block">
                  <div
                    className="relative p-[2px] rounded-full overflow-hidden cursor-pointer
                      shadow-[0_4px_20px_rgba(32,180,134,0.4)] hover:shadow-[0_4px_30px_rgba(32,180,134,0.65)]
                      transition-shadow duration-300 group"
                    onClick={() => {
                      import('@/lib/metaPixel').then(({ track }) =>
                        track('InitiateCheckout', {
                          content_name: 'Graphic Design Course',
                          content_type: 'course',
                          value: 4000,
                          currency: 'BDT',
                        })
                      );
                    }}
                  >
                    {/* Spinning conic border */}
                    <span
                      className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
                      style={{
                        background:
                          'conic-gradient(from 90deg, transparent 20%, hsl(156 70% 42%) 45%, hsl(156 85% 70%) 55%, hsl(156 70% 42%) 70%, transparent 80%)',
                      }}
                    />
                    {/* Inner button */}
                    <div className="relative bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white px-7 py-2.5 rounded-full flex items-center justify-center gap-2
                      group-hover:from-[#0f6e41] group-hover:via-[#18a06a] group-hover:to-[#0f6e41]
                      transition-colors duration-300 w-full h-full overflow-hidden">
                      {/* Shine sweep */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                      <span className="relative font-bold text-sm tracking-wide">এনরোল করুন</span>
                      <svg className="relative w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* User Menu */}
              {safeUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn(
                    "relative h-10 w-10 rounded-full border transition-all duration-300 p-0 overflow-hidden",
                    isScrolled
                      ? "border-primary/40 hover:border-primary hover:shadow-[0_0_15px_hsl(156_70%_42%/0.4)]"
                      : "border-white/40 hover:border-primary hover:shadow-[0_0_15px_hsl(156_70%_42%/0.4)]"
                  )}>
                      {
                        safeUser?.image ? <Image
                          src={safeUser.image || '/default-avatar.png'}
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        /> : <User className={cn("h-6 w-6", isDark && !isScrolled ? "text-white" : "text-primary")} />
                      }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 z-[9999]" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{safeUser?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{safeUser?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${getDashboardSegment(userRole)}/profile`} className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${getDashboardSegment(userRole)}`} className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${getDashboardSegment(userRole)}/settings`} className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem asChild>
                        <Link href={`/support`} className="flex items-center">
                        <HelpCircleIcon className="mr-2 h-4 w-4" />
        
                      Support
                      </Link>
                      </DropdownMenuItem>
                    <DropdownMenuSeparator /> */}
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
            <div className="md:hidden px-3">
              {/* <PhoneNavbar /> */}
              <MobileNavbar isScrolled={isScrolled} />
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
}
