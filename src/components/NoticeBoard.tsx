import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Calendar, Utensils, PartyPopper, AlertCircle, IndianRupee } from "lucide-react";

interface Notice {
  id: string;
  title: string;
  description: string;
  type: "event" | "mess" | "billing" | "important" | "general";
  date: string;
  isNew?: boolean;
}

const typeConfig = {
  event: { icon: PartyPopper, color: "bg-purple-500/10 text-purple-600 border-purple-500/20", label: "Event" },
  mess: { icon: Utensils, color: "bg-orange-500/10 text-orange-600 border-orange-500/20", label: "Mess" },
  billing: { icon: IndianRupee, color: "bg-green-500/10 text-green-600 border-green-500/20", label: "Billing" },
  important: { icon: AlertCircle, color: "bg-red-500/10 text-red-600 border-red-500/20", label: "Important" },
  general: { icon: Bell, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", label: "General" },
};

// Demo notices
const demoNotices: Notice[] = [
  {
    id: "1",
    title: "Hostel Annual Day Celebration",
    description: "Join us for the annual hostel day celebration on Dec 28th with cultural programs, games, and dinner.",
    type: "event",
    date: "Dec 20, 2024",
    isNew: true,
  },
  {
    id: "2",
    title: "December Mess Bill Due",
    description: "Mess bill for December is ₹4,500. Last date to pay: Dec 25, 2024. Pay at hostel office or online.",
    type: "billing",
    date: "Dec 18, 2024",
    isNew: true,
  },
  {
    id: "3",
    title: "Mess Menu Updated",
    description: "New mess menu effective from Dec 20th. Special items added for weekends. Check notice board for details.",
    type: "mess",
    date: "Dec 17, 2024",
  },
  {
    id: "4",
    title: "Winter Vacation Notice",
    description: "Hostel will remain closed from Dec 24 to Jan 2. Students must vacate rooms by Dec 23, 6 PM.",
    type: "important",
    date: "Dec 15, 2024",
  },
  {
    id: "5",
    title: "Sports Tournament Registration",
    description: "Inter-hostel sports tournament starting Jan 5th. Register for cricket, football, or badminton at warden office.",
    type: "event",
    date: "Dec 12, 2024",
  },
  {
    id: "6",
    title: "Water Supply Timing Change",
    description: "Due to maintenance, water supply will be available from 6 AM - 8 AM and 5 PM - 7 PM on Dec 22.",
    type: "general",
    date: "Dec 10, 2024",
  },
];

export function NoticeBoard() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notice Board
        </CardTitle>
        <CardDescription>
          Stay updated with hostel announcements, events, and mess bills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {demoNotices.map((notice) => {
              const config = typeConfig[notice.type];
              const Icon = config.icon;
              
              return (
                <div
                  key={notice.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground">{notice.title}</h4>
                        {notice.isNew && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notice.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {notice.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
