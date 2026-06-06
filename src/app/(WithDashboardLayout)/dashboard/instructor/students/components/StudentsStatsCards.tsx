import { Card, CardContent } from "@/components/ui/card";
import { Layers, Users } from "lucide-react";

interface StudentsStatsCardsProps {
  totalBatches: number;
  totalStudents: number;
}

const StudentsStatsCards = ({ totalBatches, totalStudents }: StudentsStatsCardsProps) => {
  const stats = [
    { icon: Layers, label: "Batches", value: totalBatches, color: "bg-blue-500" },
    { icon: Users, label: "Students", value: totalStudents, color: "bg-violet-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map(({ icon: Icon, label, value, color }) => (
        <Card key={label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StudentsStatsCards;
