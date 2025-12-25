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
import { User, LogOut, Settings, UserCircle, LayoutDashboard, HelpCircleIcon } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // ensure SSR/CSR markup match
  const navbarRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const { signOut } = useAuth();
  const router = useRouter();

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
    };

    // Throttle the scroll event for better performance
    window.addEventListener('scroll', handleScroll);

    // Initial check on mount
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use a safe user value that matches the server render until hydration completes
  const safeUser = isHydrated ? user : null;

  return (
    <div className="sticky top-0 z-[999] w-full">
      <div className="nav-mask-bg absolute z-10 h-full w-full bg-white/20 "></div>
      <div className="nav-mask-sm  absolute z-20 h-full w-full backdrop-blur-sm"></div>
      <div className="nav-mask-md absolute z-30 h-full w-full backdrop-blur-md"></div>
      <div className="nav-mask-lg absolute z-40 h-full w-full backdrop-blur-lg"></div>
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
              {!safeUser ? (
                <Link href={"/auth"}
                  className='text-emerald-600'
                >
                  লগইন
                </Link>
              ) : null}
              <div className='flex items-end justify-end space-x-4'>
                <Link href={"/checkout"}>
                  <Button className='w-28'>এনরোল করুন</Button>
                </Link>
              </div>
              {/* User Menu */}
              {safeUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-emerald-600">
                      {
                        safeUser.image ?  <Image
                        src={safeUser.image || '/default-avatar.png'}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="absolute top-0 left-0 h-10 w-10 rounded-full object-cover"
                      />:<User className="h-8 w-8 text-emerald-600" />
                      }
                     
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${user?.role}/profile`} className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${user?.role}`} className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${user?.role}/settings`} className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/support`} className="flex items-center">
                        <HelpCircleIcon className="mr-2 h-4 w-4" />
        
                      Support
                      </Link>
                      </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
