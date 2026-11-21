import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BootcampPurchaseStats } from "@/redux/api/bootcampApi";

type SelectableStatus = "all" | "paid" | "pending" | "rejected";

interface BootcampStudentStatsCardsProps {
  stats: BootcampPurchaseStats | undefined;
  activeStatus: SelectableStatus;
  onSelectStatus: (status: SelectableStatus) => void;
}

const countCards: { key: SelectableStatus; label: string; statKey: keyof BootcampPurchaseStats; color: string }[] = [
  { key: "all", label: "Total Buyers", statKey: "total", color: "" },
  { key: "paid", label: "Paid", statKey: "paid", color: "text-green-600" },
  { key: "pending", label: "Pending", statKey: "pending", color: "text-amber-600" },
  { key: "rejected", label: "Failed / Cancelled", statKey: "rejected", color: "text-red-600" },
];

const BootcampStudentStatsCards = ({
  stats,
  activeStatus,
  onSelectStatus,
}: BootcampStudentStatsCardsProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
    {countCards.map((card) => {
      const isActive = activeStatus === card.key;
      return (
        <Card
          key={card.key}
          role="button"
          tabIndex={0}
          aria-pressed={isActive}
          onClick={() => onSelectStatus(card.key)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectStatus(card.key);
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
              {stats ? stats[card.statKey] : 0}
            </CardTitle>
          </CardHeader>
        </Card>
      );
    })}

    <Card>
      <CardHeader className="pb-3">
        <CardDescription>Collected Revenue</CardDescription>
        <CardTitle className="text-3xl text-green-600">
          ৳{(stats?.revenue ?? 0).toLocaleString("en-US")}
        </CardTitle>
      </CardHeader>
    </Card>

    <Card>
      <CardHeader className="pb-3">
        <CardDescription>Today</CardDescription>
        <CardTitle className="text-3xl">{stats?.today ?? 0}</CardTitle>
      </CardHeader>
    </Card>
  </div>
);

export default BootcampStudentStatsCards;
