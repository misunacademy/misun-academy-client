import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Users } from "lucide-react";

interface BatchFilterProps {
    batches: string[];
    selectedBatch: string;
    onBatchChange: (batch: string) => void;
    testimonialCounts: Record<string, number>;
}

export const BatchFilter = ({ batches, selectedBatch, onBatchChange, testimonialCounts }: BatchFilterProps) => {
    return (
        <div className="bg-gradient-card rounded-xl p-6 shadow-testimonial border border-testimonial-border">
            <div className="flex items-center mb-4">
                <Filter className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-lg text-primary font-semibold font-bangla">ব্যাচ অনুযায়ী ফিল্টার করুন</h3>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button
                    variant={selectedBatch === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onBatchChange("all")}
                    className={`transition-all duration-300 transform hover:scale-105 ${selectedBatch
                        ? "shadow-glow"
                        : ""
                        }`}
                >
                    <Users className="w-4 h-4 mr-2" />
                    সকল ব্যাচ
                    <Badge variant="outline" className="ml-2">
                        {Object.values(testimonialCounts).reduce((a, b) => a + b, 0)}
                    </Badge>
                </Button>

                {batches.map((batch) => (
                    <Button
                        key={batch}
                        variant={selectedBatch === batch ? "default" : "outline"}
                        size="sm"
                        onClick={() => onBatchChange(batch)}
                        className={`transition-all duration-300 transform hover:scale-105 ${selectedBatch === batch
                            ? "shadow-glow"
                            : "hover:shadow-glow"
                            }`}
                    >
                        {batch} ব্যাচ
                        <Badge variant="outline" className="ml-2">
                            {testimonialCounts[batch] || 0}
                        </Badge>
                    </Button>
                ))}
            </div>
        </div>
    );
};