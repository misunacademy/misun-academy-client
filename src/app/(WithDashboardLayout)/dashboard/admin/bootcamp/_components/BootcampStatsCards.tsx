import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BootcampStats } from "@/redux/api/bootcampApi";

interface BootcampStatsCardsProps {
  stats: BootcampStats | undefined;
  activeTab: string;
  onSelectTab: (tab: "all" | "pending" | "verified" | "rejected") => void;
}

const statCards = [
  { key: "all", label: "Total Registrations", color: "" },
  { key: "pending", label: "Pending", color: "text-amber-600" },
  { key: "verified", label: "Verified", color: "text-green-600" },
  { key: "rejected", label: "Rejected", color: "text-red-600" },
] as const;

const BootcampStatsCards = ({ stats, activeTab, onSelectTab }: BootcampStatsCardsProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {statCards.map((card) => {
      const isActive = activeTab === card.key;
      return (
        <Card
          key={card.key}
          role="button"
          tabIndex={0}
          aria-pressed={isActive}
          onClick={() => onSelectTab(card.key)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectTab(card.key);
            }
          }}
          className={cn(
            "cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            isActive && "border-primary/50 shadow-md"
          )}
        >
          <CardHeader className="pb-3">
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className={cn("text-3xl", card.color)}>
              {stats ? stats[(card.key === "all" ? "total" : card.key) as keyof BootcampStats] : 0}
            </CardTitle>
          </CardHeader>
        </Card>
      );
    })}
  </div>
);

export default BootcampStatsCards;
