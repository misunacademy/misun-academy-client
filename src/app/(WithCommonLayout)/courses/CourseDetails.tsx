"use client";


import { useEffect } from "react";
import BannerSection from "@/components/module/course/BannerSection";
import CourseCurriculum from "@/components/module/course/CourseCurriculum";
import CourseWorkflow from "@/components/module/course/CourseWorkflow";
import InstructorSection from "@/components/module/course/InstructorSection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { track } from '@/lib/metaPixel';
import FaqSection from "@/components/module/course/FaqSection";
import EnrollCtaSection from "@/components/module/course/EnrollCtaSection";

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
            <InstructorSection />
            <CourseWorkflow />
            <CourseCurriculum />
            <FaqSection />
            <EnrollCtaSection />
        </div>
    );
};

export default CourseDetails;