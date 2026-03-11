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
import { User, LogOut, UserCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/types/auth';
import { useGetMyEnrollmentsQuery } from '@/redux/api/enrollmentApi';

export default function Navbar() {
  const [isHydrated, setIsHydrated] = useState(false); // ensure SSR/CSR markup match
  const navbarRef = useRef<HTMLDivElement>(null);
  const { user, signOut ,isLoading} = useAuth();
  const router = useRouter();
    const { data: EnrollmentsData, isLoading: isEnrollmentsLoading } = useGetMyEnrollmentsQuery({ status: "active" }, { skip: !user }); 

  
  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/');
    }
  };
  
  const handleEnrollClick = () => {
    import('@/lib/metaPixel').then(({ track }) =>
      track('InitiateCheckout', {
        content_name: 'Graphic Design Course',
        content_type: 'course',
        value: 4000,
        currency: 'BDT',
      })
    );
  };
  
  useEffect(() => {
    // Defer to next paint to avoid synchronous setState warning
    const id = requestAnimationFrame(() => setIsHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);
  

  // Use a safe user value that matches the server render until hydration completes
  const safeUser = isHydrated ? user : null;

  const userRole = (safeUser as AuthUser | null)?.role;
  const isEnrolled = (EnrollmentsData?.data?.length ?? 0) > 0

  if (isLoading || isEnrollmentsLoading) {
    return (
      <div className="sticky top-0 z-[999] w-full bg-[#040a07] backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <Container className="max-w-7xl mx-auto">
          <div className="h-16 flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        </Container>
      </div>
    );
  }
  return (
    <div
      ref={navbarRef}
      className="sticky text-white top-0 z-[999] w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#040a07] backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
    >
      <Container className="relative z-50 max-w-7xl mx-auto">
        <nav className="h-16 flex items-center justify-between">
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
                'transition-all duration-500 hidden md:flex items-center space-x-10 font-bold tracking-wide text-white ',
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
                  <span className="group-hover:text-primary transition-colors duration-300 text-xs">
                    {link.name}
                  </span>
                  {/* Hover Underline effect */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              ))}
              {
                userRole&& userRole.toLowerCase() === 'learner' && isEnrolled&& 
                <Link
                  href={'/my-classes'}
                  className="relative group py-2"
                >
                  <span className="group-hover:text-primary transition-colors duration-300 text-xs">
                    আমার ক্লাসগুলো
                  </span>
                  {/* Hover Underline effect */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              }

              {!safeUser ? (
                <Link
                  href={"/auth"}
                  className={cn("relative group py-2 font-bold text-primary-glow ")}
                >
                  <span className="transition-colors duration-300 group-hover:text-primary">লগইন</span>
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
                <Link href="/checkout" className="w-full sm:w-auto block" onClick={handleEnrollClick}>
                  {/* Spinning glowing border wrapper */}
                  <div className="relative inline-flex p-[1.5px] rounded-full overflow-hidden
                    shadow-[0_4px_24px_rgba(32,180,134,0.35)]
                    hover:shadow-[0_8px_36px_rgba(32,180,134,0.60)]
                    hover:scale-105 hover:-translate-y-0.5
                    active:scale-95 active:translate-y-0
                    transition-all duration-300 ease-out">
                    {/* Rotating conic-gradient border */}
                    <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(156_70%_42%)_25%,hsl(156_85%_70%)_50%,hsl(156_70%_42%)_75%,transparent_100%)]" />
                    <button className="group relative overflow-hidden
                      inline-flex items-center gap-2
                      px-6 py-2
                      text-sm font-bold tracking-wide rounded-full
                      bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38]
                      text-white
                      hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]
                      transition-all duration-300 ease-out">
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                        এনরোল করুন
                      </span>
                      {/* Shine sweep */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    </button>
                  </div>
                </Link>
              </div>

              {/* User Menu */}
              {safeUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-primary/40 transition-all duration-300 p-0 overflow-hidden hover:border-primary hover:shadow-[0_0_15px_hsl(156_70%_42%/0.4)]">
                      {safeUser.image ? (
                        <Image
                          src={safeUser.image}
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 z-[9999]" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{safeUser.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{safeUser.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/profile`} className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem asChild>
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
                    </DropdownMenuItem> */}
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
              <MobileNavbar />
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
}
