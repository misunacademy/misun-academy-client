import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import { Users } from "lucide-react";
import TeamMemberCard from './_components/TeamMemberCard';
import AboutStorySection from './_components/AboutStorySection';
import AboutMissionVisionSection from './_components/AboutMissionVisionSection';
import AboutCtaSection from './_components/AboutCtaSection';
import { ajeful, debrotto, mehedi, mithun, neyemur, rohan,ruponpaul ,puspita, sakin } from "@/assets/teamMembers/index";

export const metadata = genMeta({
  title: 'আমাদের সম্পর্কে | MISUN Academy',
  description: 'MISUN Academy-র লক্ষ্য ও ভিশন। আমাদের টিম সম্পর্কে জানুন এবং ডিজিটাল শিক্ষার এই যাত্রায় অংশীদার হন। | Learn about MISUN Academy, our mission, vision, and the team behind Bangladesh\'s leading graphic design and freelancing courses.',
  keywords: ['MISUN Academy', 'About MISUN', 'Graphic Design Team', 'MISUN Team', 'মিসুন একাডেমি', 'ডিজিটাল শিক্ষা', 'গ্রাফিক্স ডিজাইন টিম'],
  slug: 'about',
});

const teamMembers = [
  { name: "Mithun Sarkar", role: "Founder & CEO", company: "MISUN Academy", image: mithun },
  { name: "Puspita Singha", role: "Lead Instructor, English For Professional Communication", company: "MISUN Academy", image: puspita },
  { name: "Debbroto Biswas", role: "Senior Visualizer", company: "MISUN Academy", image: debrotto },
  { name: "Rupon Paul", role: "Graphic Designer", company: "MISUN Academy", image: ruponpaul },
  { name: "Rohan", role: "Video Editor", company: "MISUN Academy", image: rohan },
  { name: "Ajeful Mallick", role: "Design And Social Media Coordinator", company: "MISUN Academy", image: ajeful },
  { name: "Mehedi Hasan", role: "Web Developer", company: "MISUN Academy", image: mehedi },
  { name: "S. M. Nayemur Rahman", role: "Marketing Executive", company: "MISUN Academy", image: neyemur },
  { name: "Nafiun Sakin", role: "Community Growth Manager", company: "MISUN Academy", image: sakin },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-surface font-bangla overflow-hidden">
      {/* <AboutHeroSection /> */}
      <section className="relative bg-surface overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-10 right-1/3 w-96 h-96 bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/90">Our Team</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-[140%]">
              <span className="bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">Meet Our </span>
              <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_hsl(156_70%_42%/0.45)]">Visionary Team</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto">
              ডিজিটাল শিক্ষার রূপান্তরের পেছনে MISUN Academy&apos;র প্রতিভাবান টিমের সদস্যরা
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </section>

      <AboutStorySection />
      <AboutMissionVisionSection />
      <AboutCtaSection />
    </div>
  );
};

export default AboutUs;
