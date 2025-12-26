import Container from '@/components/ui/container';
import { partnerCompany } from '@/constants/partnerCompany';
import Image from 'next/image';

export default function Partner() {
  return (
    <Container className="my-32">
      <h1 className="text-[32px] md:text-3xl lg:text-5xl w-full md:w-3/4 lg:w-full mx-auto font-bold font-bangla text-secondary text-center mb-20">
        আমাদের বিশ্বস্ত <span className="text-primary">চাকরির অংশীদাররা</span>
      </h1>
      <div className="flex items-center justify-center flex-col md:flex-row md:gap-x-8 lg:gap-x-20 gap-y-8 flex-wrap">
        {partnerCompany.map((company, index) => (
          <Image
            key={index}
            src={company}
            alt="কম্পানির লোগো"
            className="h-32 md:h-16 lg:h-32"
          />
        ))}
      </div>
    </Container>
  );
}
