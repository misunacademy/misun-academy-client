import Image from 'next/image';
import CurrentYear from '@/components/shared/CurrentYear';

export default function FooterBottom() {
  return (
    <>
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-0">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 mt-6 mb-4 flex justify-center px-4 opacity-70 hover:opacity-100 transition-opacity">
        <Image
          src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png"
          alt="Pay with SSLCommerz"
          width={900}
          height={390}
          className="w-full max-w-[350px] sm:max-w-[560px] lg:max-w-[980px] h-auto"
        />
      </div>

      <div className="relative z-10 mt-2">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="flex w-full justify-center py-5">
          <p className="text-sm leading-relaxed text-white/80">
            © <CurrentYear />{' '}
            <span className="text-primary-glow font-medium">Misun Academy</span>
            {' '}— All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
