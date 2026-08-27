import Link from 'next/link';
import Image from 'next/image';
import MisunLogo from '@/assets/svg/misun-logo-svg.svg';
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import Container from '@/components/ui/container';
import { contactItems, companyLinks, socialLinks } from './contactData';

export default function FooterColumns() {
  return (
    <Container className="relative grid grid-cols-1 md:grid-cols-3 gap-10 py-16 px-6 md:px-0 max-w-7xl mx-auto">
      <div className="order-1 col-start-1 col-span-1 row-start-1 space-y-6">
        <div className="mb-8 mt-2">
          <Image
            src={MisunLogo}
            alt="Misun Academy"
            width={120}
            height={120}
            loading="eager"
            className="h-10 w-auto"
          />
          <div className="mt-2 h-0.5 w-20 bg-gradient-to-r from-primary/60 to-transparent rounded-full" />
        </div>

        <div className="flex flex-col gap-4">
          {contactItems.map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3 group">
              <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-darker via-primary to-emerald-dark flex items-center justify-center shadow-[0_0_12px_hsl(156_70%_42%/0.25)] group-hover:shadow-[0_0_18px_hsl(156_70%_42%/0.45)] transition-shadow">
                {icon}
              </div>
              <p className="text-white/65 text-sm leading-relaxed group-hover:text-white/85 transition-colors">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 order-2 md:my-0">
        <h3 className="text-base font-semibold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent mb-3 tracking-wide">
          কোম্পানি
        </h3>
        <div className="h-0.5 w-12 bg-gradient-to-r from-primary/60 to-transparent rounded-full -mt-2 mb-2" />
        {companyLinks.map(({ href, label }) => (
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

      <div className="space-y-6 order-3 mb-8">
        <div>
          <h3 className="text-base font-semibold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent mb-3 tracking-wide">
            আমাদের অনুসরণ করুন
          </h3>
          <div className="h-0.5 w-12 bg-gradient-to-r from-primary/60 to-transparent rounded-full mb-5" />

          <div className="flex items-center gap-3 ">
            {socialLinks.map(({ href, icon, delay }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className="group relative p-[1.5px] rounded-xl overflow-hidden"
              >
                <AnimatedBorder variant="simple" speed="4s" delay={delay} />
                <div className="relative bg-surface rounded-xl p-2.5 transition-colors group-hover:bg-primary/10">
                  {icon}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 relative overflow-hidden rounded-xl border border-primary/15 bg-primary/5 px-4 py-3">
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
  );
}
