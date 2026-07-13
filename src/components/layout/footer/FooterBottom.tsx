import Image from 'next/image';

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
          <p className="text-white/40 text-sm tracking-wide">
            © {new Date().getFullYear()}{' '}
            <span className="text-primary/70 font-medium">Misun Academy</span>
            {' '}— All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
