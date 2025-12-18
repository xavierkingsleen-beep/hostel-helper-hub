import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";

interface ComplaintCardProps {
  category: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt?: string;
}

export function ComplaintCard({ category, description, status, createdAt }: ComplaintCardProps) {
  return (
    <Card className="animate-slide-in-left hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">{category}</h4>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            {createdAt && (
              <p className="text-xs text-muted-foreground">
                Submitted: {createdAt}
              </p>
            )}
          </div>
          <StatusBadge status={status} />
        </div>
      </CardContent>
    </Card>
  );
}
