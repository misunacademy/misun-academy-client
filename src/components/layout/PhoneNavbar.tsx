'use client';

import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Link from 'next/link';
import { useState } from 'react';

export default function PhoneNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={() => setOpen(!open)}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="border-secondary md:hidden">
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Phone Navbar</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col justify-center my-10 border-t border-secondary">
            <Link
              onClick={() => setOpen(false)}
              href="/courses"
              className="h-14 flex items-center border-b border-secondary pl-14"
            >
              Courses
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/about"
              className="h-14 flex items-center border-b border-secondary pl-14"
            >
              About
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/blogs"
              className="h-14 flex items-center border-b border-secondary pl-14"
            >
              Blogs
            </Link>
            <div className='flex space-x-4 pl-14 pt-4'>
              <Link href="/" legacyBehavior>
                <Button className='w-28'>Enroll Now</Button>
              </Link>
              <Link href="/login" legacyBehavior>
                <Button className='w-28' variant="secondary">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
