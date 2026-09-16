import { Facebook, Youtube, Globe2Icon, Locate, MailCheck, PhoneCall } from 'lucide-react';

export const contactItems = [
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
];

export const companyLinks = [
  { href: '/', label: 'হোম' },
  { href: '/courses', label: 'কোর্সসমূহ' },
  { href: '/about', label: 'আমাদের সম্পর্কে' },
  { href: '/terms-and-conditions', label: 'শর্তাবলী' },
  { href: '/privacy-policy', label: 'গোপনীয়তা নীতি' },
  { href: '/refund-policy', label: 'রিফান্ড নীতি' },
];

export interface SocialLink {
  href: string;
  icon: React.ReactNode;
  delay?: string;
}

export const socialLinks: SocialLink[] = [
  {
    href: 'https://www.facebook.com/misunacademy',
    icon: <Facebook className="w-5 h-5 text-white" />,
  },
  {
    href: 'https://www.youtube.com/@misunacademy',
    icon: <Youtube className="w-5 h-5 text-white" />,
    delay: '0.5s',
  },
];
