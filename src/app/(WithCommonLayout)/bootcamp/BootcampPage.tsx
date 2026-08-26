import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { BootcampHero } from './_components/BootcampHero';
import { BootcampPerks } from './_components/BootcampPerks';
import { BootcampDoseSchedule } from './_components/BootcampDoseSchedule';
import { BootcampPayment } from './_components/BootcampPayment';
import { PosterStudio } from './_components/PosterStudio';
import { BootcampRegistrationForm } from './_components/BootcampRegistrationForm';
import { BootcampFaq } from './_components/BootcampFaq';

const BootcampPage = () => (
    <main className="bg-[#0a0a0b]">
        <BootcampHero />
        <BootcampPerks />
        <BootcampDoseSchedule />
        <BootcampPayment />
        <PosterStudio />
        <BootcampRegistrationForm />
        <BootcampFaq />
        <BreadcrumbJsonLd />
    </main>
);

export default BootcampPage;
