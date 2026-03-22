import { Facebook, YouTube } from '@/assets/icons';
import Link from 'next/link';
import Container from '../ui/container';
import { Globe2Icon, Locate, MailCheck, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import MisunLogo from '@/assets/svg/misun-logo-svg.svg';
import FooterBg from '@/assets/images/footer.png';

/***
misunacademybd@gmail.com
phone number : 01778371211
 */
export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden pb-12 md:pb-24 bg-[#060f0a]"
    >
      {/* Decorative image loads lazily and avoids early network cost. */}
    <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={FooterBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
      {/* Dark overlay so text stays readable over the image */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a12] via-[#060a12]/85 to-[#060a12]/60 pointer-events-none z-0" />

      {/* ── Top separator ── */}
      <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
        {/* Outer glow bloom */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-primary/15 to-transparent" />
        {/* Core bright line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
        {/* Soft halo below the line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-b from-primary/40 to-transparent" />
        {/* Travelling shimmer — slides left→right forever */}
        <div
          className="absolute top-0 h-px w-40 opacity-90"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(156 85% 70%), transparent)',
            animation: 'shimmer-line 3s linear infinite',
          }}
        />
        {/* Diamond jewel centrepiece */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* outer ring */}
          <div className="absolute w-7 h-7 rounded-full border border-primary/30 animate-ping opacity-30" />
          <div className="absolute w-5 h-5 rounded-full border border-primary/50" />
          {/* diamond */}
          <div
            className="w-2.5 h-2.5 rotate-45 bg-gradient-to-br from-primary-glow via-primary to-[#0a5f38] shadow-[0_0_12px_hsl(156_70%_42%),0_0_24px_hsl(156_70%_42%/0.5)]"
          />
        </div>
        {/* Short accent lines either side of the diamond */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-0">
          <div className="w-32 h-px bg-gradient-to-l from-primary/70 to-transparent" />
          <div className="w-4" />
          <div className="w-32 h-px bg-gradient-to-r from-primary/70 to-transparent" />
        </div>
      </div>

      {/* shimmer keyframe (injected inline once) */}
      <style>{`
        @keyframes shimmer-line {
          0%   { left: -10rem; }
          100% { left: 110%; }
        }
      `}</style>

      {/* Ambient glow blobs */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none z-[1]" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none z-[1]" />
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl pointer-events-none z-[1]" />

      {/* Main grid */}
      <Container className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 py-16 px-6 md:px-0 max-w-7xl mx-auto">

        {/* ── Column 1: Brand + Contact ── */}
        <div className="order-1 col-start-1 col-span-1 row-start-1 space-y-6">
          {/* Logo / Brand name */}
          <div className="mb-8 mt-2">
            <Image
              src={MisunLogo}
              alt="Misun Academy"
              width={120}
              height={120}
              className="h-10 w-auto"
            />
            <div className="mt-2 h-0.5 w-20 bg-gradient-to-r from-primary/60 to-transparent rounded-full" />
          </div>

          {/* Contact items */}
          <div className="flex flex-col gap-4">
            {[
              {
                icon: <Locate className="w-4 h-4 text-white" />,
                text: '85, Sultan Ahmed Road, Moulavipara, Ward Number: 27, Khulna',
              },
              {
                icon: <PhoneCall className="w-4 h-4 text-white" />,
                text: '+88 01778371211',
              },
              {
                icon: <MailCheck className="w-4 h-4 text-white" />,
                text: 'misunacademybd@gmail.com',
              },
              {
                icon: <Globe2Icon className="w-4 h-4 text-white" />,
                text: 'www.misun-academy.com',
              },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 group">
                {/* Icon badge */}
                <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#0d5c36] via-primary to-[#0a5f38] flex items-center justify-center shadow-[0_0_12px_hsl(156_70%_42%/0.25)] group-hover:shadow-[0_0_18px_hsl(156_70%_42%/0.45)] transition-shadow">
                  {icon}
                </div>
                <p className="text-white/65 text-sm leading-relaxed group-hover:text-white/85 transition-colors">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Column 2: Company Links ── */}
        <div className="flex flex-col gap-3 order-2 md:my-0">
          <h3 className="text-base font-semibold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent mb-3 tracking-wide">
            কোম্পানি
          </h3>
          <div className="h-0.5 w-12 bg-gradient-to-r from-primary/60 to-transparent rounded-full -mt-2 mb-2" />
          {[
            { href: '/', label: 'হোম' },
            { href: '/courses', label: 'কোর্সসমূহ' },
            { href: '/about', label: 'আমাদের সম্পর্কে' },
            { href: '/terms-and-conditions', label: 'শর্তাবলী' },
            { href: '/privacy-policy', label: 'গোপনীয়তা নীতি' },
            { href: '/refund-policy', label: 'রিফান্ড নীতি' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2 text-white/60 hover:text-primary transition-colors text-sm w-fit"
            >
              <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_6px_hsl(156_70%_42%)] transition-all" />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Column 3: Social + License ── */}
        <div className="space-y-6 order-3 mb-8">
          <div>
            <h3 className="text-base font-semibold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent mb-3 tracking-wide">
              আমাদের অনুসরণ করুন
            </h3>
            <div className="h-0.5 w-12 bg-gradient-to-r from-primary/60 to-transparent rounded-full mb-5" />

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <Link
                href="https://www.facebook.com/misunacademy"
                target="_blank"
                className="group relative p-[1.5px] rounded-xl overflow-hidden"
              >
                {/* Spin border */}
                <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                <div className="relative bg-[#060f0a] rounded-xl p-2.5 transition-colors group-hover:bg-primary/10">
                  <Facebook />
                </div>
              </Link>
              <Link
                href="https://www.youtube.com/@misunacademy"
                target="_blank"
                className="group relative p-[1.5px] rounded-xl overflow-hidden"
              >
                <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite_0.5s] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                <div className="relative bg-[#060f0a] rounded-xl p-2.5 transition-colors group-hover:bg-primary/10">
                  <YouTube />
                </div>
              </Link>
            </div>

            {/* Trade license */}
            <div className="mt-6 relative overflow-hidden rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/40 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/40 rounded-tr-xl" />
              <p className="text-white/65 text-sm leading-relaxed">
                Trade License No:{' '}
                <span className="font-semibold text-primary/90">27/536</span>
                <br />
                <span className="text-xs text-white/45">(Khulna City Corporation)</span>
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Divider before SSLCommerz */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-0">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* SSLCommerz badge — single responsive image, scales across all screen sizes */}
      <div className="relative z-10 mt-6 mb-4 flex justify-center px-4 opacity-70 hover:opacity-100 transition-opacity">
        <Image
          src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png"
          alt="Pay with SSLCommerz"
          width={900}
          height={390}
          className="w-full max-w-[350px] sm:max-w-[560px] lg:max-w-[980px] h-auto"
        />
      </div>

      {/* Bottom bar */}
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

    </footer>
  );
}

