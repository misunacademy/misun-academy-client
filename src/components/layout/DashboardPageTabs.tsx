import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface DashboardTabsTrigger {
    value: string;
    label: ReactNode;
}

interface DashboardTabsContent {
    value: string;
    content: ReactNode;
    className?: string;
}

interface DashboardPageTabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    triggers: DashboardTabsTrigger[];
    contents: DashboardTabsContent[];
    className?: string;
}

const DashboardPageTabs = ({ defaultValue, value, onValueChange, triggers, contents, className }: DashboardPageTabsProps) => {
    const tabsProps = value !== undefined ? { value, onValueChange } : { defaultValue };

    return (
        <Tabs {...tabsProps} className={className ?? "space-y-4"}>
            <TabsList
                className="grid w-full gap-2"
                style={{ gridTemplateColumns: `repeat(${Math.max(triggers.length, 1)}, minmax(0, 1fr))` }}
            >
                {triggers.map((trigger) => (
                    <TabsTrigger key={trigger.value} value={trigger.value}>
                        {trigger.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {contents.map((content) => (
                <TabsContent
                    key={content.value}
                    value={content.value}
                    className={content.className ? `space-y-4 ${content.className}` : "space-y-4"}
                >
                    {content.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default DashboardPageTabs;