"use client";


import { useEffect } from "react";
import BannerSection from "@/components/module/course/BannerSection";
import CourseCurriculum from "@/components/module/course/CourseCurriculum";
import CourseWorkflow from "@/components/module/course/CourseWorkflow";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { track } from '@/lib/metaPixel';

const CourseDetails = () => {
    // Track ViewContent event
    useEffect(() => {
        track("ViewContent", {
            content_name: "Graphic Design Course",
            content_type: "course",
            content_ids: ["rvtheryheyhtwe1234"],
        });
    }, []);
    return (
        <div>
            <BreadcrumbJsonLd />
            <BannerSection />
            <CourseWorkflow />
            <CourseCurriculum />
            {/* <CareerPath />
                <FaqSection /> */}
        </div>
    );
};

export default CourseDetails;