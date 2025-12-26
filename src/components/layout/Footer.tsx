import {
  Facebook,
  YouTube,
} from '@/assets/icons';
import Link from 'next/link';
import Container from '../ui/container';
import { Globe2Icon, Locate, MailCheck, PhoneCall } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-primary/30 to-primary/1">
      <Container className="grid grid-cols-1 md:grid-cols-3 gap-4 py-16 px-6 md:px-0">
        <div className="order-1 col-start-1 col-span-1 row-start-1 space-y-4 order-1">
          <div className="place-self-start mb-10 mt-2">
            {/* <Logo /> */}
            <h1 className='text-2xl font-bold text-primary'>Misun Academy</h1>
          </div>
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Locate className='text-primary w-6 h-6' />
              <p>85, Sultan Ahmed Road, Moulavipara, Ward Number: 27, Khulna</p>
            </div>
            <div className="flex items-center gap-2">
              <PhoneCall className='text-primary w-6 h-6' />
              <p>+88 01970713708</p>
            </div>
            <div className="flex items-center gap-2">
              <MailCheck className='text-primary w-6 h-6' />
              <p>support@misun-academy.com</p>
            </div>
            <div className="flex items-center gap-2">
              <Globe2Icon className='text-primary w-6 h-6' />
              <p>www.misun-academy.com</p>
            </div>

          </div>
        </div>
        <div className="flex flex-col gap-4 order-2 my-10 md:my-0">
          <h1 className="text-xl md:text-[20px] font-semibold">কোম্পানি</h1>
          <div>
            <Link href="/" className="hover:underline hover:text-primary text-md">
              হোম
            </Link>
          </div>

          <div>
            <Link href="/courses" className="hover:underline hover:text-primary">
              কোর্স সম্পর্কে
            </Link>
          </div>
          <div>
            <Link href="/about" className="hover:underline hover:text-primary">
              আমাদের সম্পর্কে
            </Link>
          </div>
          <div>
            <Link href="/terms-and-conditions" className="hover:underline hover:text-primary">
              শর্তাবলী
            </Link>
          </div>
          <div>
            <Link href="/privacy-policy" className="hover:underline hover:text-primary">
              গোপনীয়তা নীতি
            </Link>
          </div>
          <div>
            <Link href="/refund-policy" className="hover:underline hover:text-primary">
              রিফান্ড নীতি
            </Link>
          </div>
        </div>
        <div className="space-y-4 order-3 mb-8">
          <div>
            <h1 className='text-xl md:text-[20px] font-semibold mb-6'>আমাদের অনুসরণ করুন</h1>
            <div className="flex items-center gap-4">
              <Link href="https://www.facebook.com/misunacademy" target='_blank'>
                <Facebook />
              </Link>
              {/* <Link href="https://www.youtube.com/@misunacademy">
              <Instagram />
            </Link>
            <Link href="https://www.linkedin.com">
              <LinkedIn />
            </Link> */}
              <Link href=" https://www.youtube.com/@misunacademy" target='_blank'>
                <YouTube />
              </Link>
            </div>

            <div className='mt-4 md:mt-6'>
              <p className=''>Trade License No: <span className='font-semibold'>27/536</span><br /> <span className='text-sm'>(Khulna City Corporation)</span></p>
            </div>


          </div>
        </div>
      </Container>
      <div className='hidden mt-4 mb-4 sm:flex justify-center'>
        <Image
          src={"https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png"}
          alt='SSLCommerz'
          width={1400}
          height={600}
        />
      </div>
      <div className='flex mb-4 sm:hidden justify-center'>
        <Image
          src={"https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-04.png"}
          alt='SSLCommerz'
          width={1400}
          height={600}
        />
      </div>
      <div className="flex w-full justify-center mb-10">
        <p>© {new Date().getFullYear()} Misun Academy</p>
      </div>
    </footer>
  );
}

