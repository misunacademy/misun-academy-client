import Container from '@/components/ui/container';
import WhyThisCourseModal from './WhyThisCourseModal';
import { VideoThumb } from '@/assets/images';
import { FolderArchive, NotebookPen, Projector } from 'lucide-react';
import PlayButton from '@/components/shared/PlayButton';

export default function WhyThisCourse() {
  return (
    <Container className="mb-20 pt-20">
      <h1 className="text-6xl font-bangla font-bold text-secondary text-center uppercase">
        এই <span className="text-primary">কোর্সটি</span> কেন করবেন?
      </h1>
      <div
        data-dark-section
        className="bg-background-secondary rounded-xl w-[360px] md:w-full h-[504px] lg:h-full aspect-[2.16/1] mt-11 mx-auto relative overflow-hidden cursor-pointer"
      >
        <WhyThisCourseModal>
          {/* <Image src={whythiscource} fill={true} alt="course video" /> */}
          <div
            className="grid grid-cols-2 bg-cover bg-no-repeat bg-center sm:bg-top w-full h-full"
            style={{
              backgroundImage: `url(${VideoThumb.src})`,
            }}
          >


            <div className='w-[132px] md:w-72 lg:w-[410px] text-white mx-6 md:mx-12 lg:mx-24 mt-12 md:mt-20 lg:mt-24'>
              {/* <Image src={logo} alt='Logo' className='w-10 md:hidden mb-6' /> */}
              <h1 className='text-xl md:text-3xl lg:text-5xl font-bold leading-[120%] tracking-[0%] font-bangla'>
                এই কোর্সে সহজ বাংলায় হাতে-কলমে <span className='font-bold text-primary'>গ্রাফিক্স ডিজাইন</span> শিখে ঘরে বসেই ফ্রিল্যান্সিং বা পেশাদার ক্যারিয়ার গড়ার সুযোগ পাবেন।
              </h1>

              <div className='mt-20'>
                <h2 className='text-xl md:text-2xl font-bold font-bangla'>ভিডিওতে  বিস্তারিত দেখুন </h2>
                {/* <p className='text-sm md:text-[16px]'>CEO, Misun Academy</p> */}
              </div>
            </div>
            <div className='flex items-center justify-start'>
              <PlayButton
                size="lg"
                variant="gradient"
                className='hidden md:block'
              />
            </div>



          </div>
        </WhyThisCourseModal>
      </div>
      <div className="font-monaExpanded max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 items-center justify-center">
        <div className="group hover:bg-primary transition-all h-full py-8 md:py-5 md:h-60 bg-background-secondary rounded-3xl flex flex-col items-center justify-center hover:shadow-primary/50 hover:shadow-2xl hover:scale-105 mx-12 md:mx-0">
          <div className="group-hover:text-white transition-all">
            <Projector size={36} />
          </div>
          <span className="text-3xl md:text-5xl font-bold text-primary mt-6 group-hover:text-white transition-all">
            ৬০+
          </span>
          <span className="text-xl md:text-2xl font-medium text-black group-hover:text-white transition-all">
            অনলাইন ক্লাস
          </span>
        </div>
        <div className="group hover:bg-primary transition-all  h-48 md:h-60 py-8 md:py-5 bg-background-secondary rounded-3xl flex flex-col items-center justify-center hover:shadow-primary/50 hover:shadow-2xl hover:scale-105 mx-12 md:mx-0">
          <div className="group-hover:text-white transition-all">
            <NotebookPen size={36} />
          </div>
          <span className="text-3xl md:text-5xl font-bold text-primary mt-6 group-hover:text-white transition-all">
            ৩৫+
          </span>
          <span className="text-xl md:text-2xl font-medium text-black group-hover:text-white transition-all">
            অ্যাসাইনমেন্ট
          </span>
        </div>
        <div className="group hover:bg-primary transition-all h-48 md:h-60 py-8 md:py-5  bg-background-secondary rounded-3xl flex flex-col items-center justify-center hover:shadow-primary/50 hover:shadow-2xl hover:scale-105 mx-12 md:mx-0">
          <div className="group-hover:text-white transition-all">
            <FolderArchive size={36} />
          </div>
          <span className="text-3xl md:text-5xl font-bold text-primary mt-6 group-hover:text-white transition-all">
            ২০+
          </span>
          <span className="text-xl md:text-2xl font-medium text-black group-hover:text-white transition-all">
            রিসোর্স ফোল্ডার
          </span>
        </div>
      </div>
    </Container>
  );
}
