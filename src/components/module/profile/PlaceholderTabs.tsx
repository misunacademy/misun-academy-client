import { GraduationCap, Briefcase, Award, Clock, ShoppingBag } from "lucide-react";

export function EducationTab() {
    return (
        <PlaceholderTab 
            title="Education" 
            icon={<GraduationCap className="w-12 h-12 text-primary/40 mb-4" />}
            message="Your educational background details will appear here. This feature is coming in a future update."
        />
    );
}

export function ExperienceTab() {
    return (
        <PlaceholderTab 
            title="Job Experience History" 
            icon={<Briefcase className="w-12 h-12 text-primary/40 mb-4" />}
            message="A detailed timeline of your past roles and responsibilities will be available here soon."
        />
    );
}

export function HiredTab() {
    return (
        <PlaceholderTab 
            title="Got Hired" 
            icon={<Award className="w-12 h-12 text-primary/40 mb-4" />}
            message="Showcase your success stories! Placement details will be tracked here soon."
        />
    );
}

export function CourseRequestTab() {
    return (
        <PlaceholderTab 
            title="Course Requests" 
            icon={<Clock className="w-12 h-12 text-primary/40 mb-4" />}
            message="Submit and track your requests for new courses or topics here in a future update."
        />
    );
}

export function OrdersTab() {
    return (
        <PlaceholderTab 
            title="Order History" 
            icon={<ShoppingBag className="w-12 h-12 text-primary/40 mb-4" />}
            message="Your past course purchases and transactions will be listed here."
        />
    );
}

export function CertificationTab() {
    return (
        <PlaceholderTab 
            title="Certifications" 
            icon={<Award className="w-12 h-12 text-primary/40 mb-4" />}
            message="Access, download, and verify your course completion certificates here."
        />
    );
}

// Reusable layout for unimplemented tabs
function PlaceholderTab({ title, icon, message }: { title: string, icon: React.ReactNode, message: string }) {
    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold">{title}</h2>
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center py-20 text-center">
                {icon}
                <h3 className="text-xl text-white/90 font-medium mb-2">Coming Soon</h3>
                <p className="text-white/50 max-w-md">
                    {message}
                </p>
            </div>
        </div>
    );
}
