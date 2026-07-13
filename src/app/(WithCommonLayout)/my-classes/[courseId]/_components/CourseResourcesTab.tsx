import { ExternalLink, FileText } from "lucide-react";
import DarkCard from "./DarkCard";

interface Resource {
    type?: string;
    title?: string;
    url?: string;
    textContent?: string;
    moduleTitle?: string;
    lessonTitle?: string;
    lessonId?: string;
}

export default function CourseResourcesTab({ resources }: { resources: Resource[] }) {
    if (resources.length === 0) {
        return (
            <div className="mt-4 space-y-3">
                <DarkCard className="p-8 text-center">
                    <div className="relative space-y-4">
                        <div className="w-14 h-14 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto">
                            <FileText className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-white">No Resources Available</h3>
                        <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                            Resources will be made available as you progress through the course.
                        </p>
                    </div>
                </DarkCard>
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-3">
            {resources.map((resource, index) => (
                <DarkCard key={index} glowOnHover className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            {resource.type === "link" ? (
                                <ExternalLink className="h-4 w-4 text-primary" />
                            ) : (
                                <FileText className="h-4 w-4 text-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-white mb-0.5">{resource.title}</h4>
                            <p className="text-xs text-white/30 mb-2">
                                {resource.moduleTitle} → {resource.lessonTitle}
                            </p>
                            {resource.type === "link" && resource.url && (
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Open Link <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                            {resource.type === "text" && resource.textContent && (
                                <div className="mt-2 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                                    <p className="text-xs text-white/40 whitespace-pre-wrap">{resource.textContent}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DarkCard>
            ))}
        </div>
    );
}
