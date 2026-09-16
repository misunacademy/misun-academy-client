import Image from 'next/image';
import FooterBg from '@/assets/images/footer.png';
import FooterTop from './footer/FooterTop';
import FooterColumns from './footer/FooterColumns';
import FooterBottom from './footer/FooterBottom';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pb-12 md:pb-24 bg-surface">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={FooterBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a12] via-[#060a12]/85 to-[#060a12]/60 pointer-events-none z-0" />

      <FooterTop />

      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none z-[1]" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none z-[1]" />
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl pointer-events-none z-[1]" />

      <FooterColumns />

      <FooterBottom />
    </footer>
  );
}
