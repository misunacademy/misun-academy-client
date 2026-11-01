import BannerSection from "@/components/module/course/BannerSection";
import CourseCurriculum from "@/components/module/course/CourseCurriculum";
import CourseWorkflow from "@/components/module/course/CourseWorkflow";
import InstructorSection from "@/components/module/course/InstructorSection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { TrackView } from "@/components/module/course/TrackView";
import FaqSection from "@/components/module/course/FaqSection";
import EnrollCtaSection from "@/components/module/course/EnrollCtaSection";
import { COURSE_SLUGS } from '@/constants/courses';

const CourseDetails = () => (
    <div>
        <TrackView />
        <BreadcrumbJsonLd />
        <BannerSection courseSlug={COURSE_SLUGS.GRAPHIC_DESIGN} />
        <InstructorSection />
        <CourseWorkflow courseSlug={COURSE_SLUGS.GRAPHIC_DESIGN} />
        <CourseCurriculum />
        <FaqSection />
        <EnrollCtaSection courseSlug={COURSE_SLUGS.GRAPHIC_DESIGN} />
    </div>
);

export default CourseDetails;