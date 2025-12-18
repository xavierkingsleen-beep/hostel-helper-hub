import { cn } from "@/lib/utils";

type Status = "Pending" | "In Progress" | "Resolved";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  Pending: "bg-warning/20 text-warning border-warning/30",
  "In Progress": "bg-primary/20 text-primary border-primary/30",
  Resolved: "bg-success/20 text-success border-success/30",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
