'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="text-black">
                {isOpen ? <AlignLeft className='text-primary' size={28} /> : <AlignLeft size={28} />}
            </button>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'absolute right-0 top-14 w-[365px] mr-1 bg-gray-100 shadow-lg rounded-lg px-8 pb-10 pt-6 flex flex-col transition-all',
                    isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                )}
            >
                {/* <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/"
                    className="text-lg h-14 flex items-center border-b border-dark">
                    Home
                </Link> */}
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/"
                    className="text-lg h-14 flex items-center border-b border-dark font-bangla"
                >
                    হোম
                </Link>
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/courses"
                    className="text-lg h-14 flex items-center border-b border-dark font-bangla"
                >
                    কোর্স সম্পর্কে
                </Link>
                <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/about"
                    className="text-lg h-14 flex items-center border-b border-dark font-bangla"
                >
                    আমাদের সম্পর্কে
                </Link>
                {/* <Link
                    onClick={() => setIsOpen(!isOpen)}
                    href="/blogs"
                    className="text-lg h-14 flex items-center border-b border-dark"
                >
                    Blogs
                </Link> */}

                <div className='flex space-x-4 pt-6 pb-2'>
                    <Link
                        onClick={() => setIsOpen(!isOpen)}
                        href="/"
                    >
                        <Button className='w-28 font-bangla'>এনরোল করুন</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
