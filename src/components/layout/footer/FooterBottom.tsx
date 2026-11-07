import CurrentYear from '@/components/shared/CurrentYear';

export default function FooterBottom() {
  return (
    <>
      {/* <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-0">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div> */}
      {/* <div className="relative z-10 mt-6 mb-4 flex justify-center px-4">
        <div className="text-center w-full">
          <p className="text-sm font-semibold text-white mb-3">Pay with</p>
     
          <div className="mt-4 flex flex-wrap justify-center gap-3 md:gap-4 max-w-[720px] mx-auto">
            <Image
              src={SSLLogo}
              alt="SSLCommerz secure logo"
              width={120}
              height={120}
              className="h-auto max-h-[64px] w-auto object-contain"
            />
            <Image
              src={SSLCommerz}
              alt="SSLCommerz payment gateway"
              width={400}
              height={200}
              className="h-auto max-h-[90px] w-auto object-contain"
            />
          </div>
        </div>
      </div> */}
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
