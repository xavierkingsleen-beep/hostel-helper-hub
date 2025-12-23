import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  Phone, 
  BookOpen, 
  ExternalLink, 
  CalendarDays,
  Clock,
  AlertTriangle,
  Shield,
  Wifi,
  Droplets
} from "lucide-react";

// Mess Menu Module
const messMenuData = {
  breakfast: { time: "7:30 AM - 9:00 AM", items: ["Idli/Dosa", "Chutney", "Sambar", "Tea/Coffee"] },
  lunch: { time: "12:30 PM - 2:00 PM", items: ["Rice", "Dal", "Sabzi", "Roti", "Salad"] },
  snacks: { time: "5:00 PM - 6:00 PM", items: ["Samosa", "Tea", "Biscuits"] },
  dinner: { time: "7:30 PM - 9:00 PM", items: ["Rice", "Dal", "Paneer/Chicken", "Roti", "Sweet"] },
};

export const MessMenuModule = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <UtensilsCrossed className="w-5 h-5 text-primary" />
        Today's Mess Menu
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {Object.entries(messMenuData).map(([meal, data]) => (
        <div key={meal} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium capitalize text-sm">{meal}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.time}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{data.items.join(" • ")}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Emergency Contacts Module
const emergencyContacts = [
  { name: "Hostel Warden", phone: "+91 98765 43210", available: "24/7" },
  { name: "Security Office", phone: "+91 98765 43211", available: "24/7" },
  { name: "Medical Emergency", phone: "+91 98765 43212", available: "24/7" },
  { name: "Maintenance", phone: "+91 98765 43213", available: "8AM-8PM" },
  { name: "Mess Manager", phone: "+91 98765 43214", available: "7AM-10PM" },
];

export const EmergencyContactsModule = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Phone className="w-5 h-5 text-destructive" />
        Emergency Contacts
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {emergencyContacts.map((contact) => (
        <div key={contact.name} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
          <div>
            <p className="font-medium text-sm">{contact.name}</p>
            <p className="text-xs text-muted-foreground">{contact.available}</p>
          </div>
          <a 
            href={`tel:${contact.phone.replace(/\s/g, '')}`} 
            className="text-sm text-primary hover:underline font-mono"
          >
            {contact.phone}
          </a>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Hostel Rules Module
const hostelRules = [
  { rule: "Gate closes at 10:00 PM", icon: Clock, priority: "high" },
  { rule: "Visitors allowed till 6:00 PM only", icon: Shield, priority: "medium" },
  { rule: "No loud music after 9:00 PM", icon: AlertTriangle, priority: "medium" },
  { rule: "WiFi password changes every month", icon: Wifi, priority: "low" },
  { rule: "Report water leakage immediately", icon: Droplets, priority: "high" },
];

export const HostelRulesModule = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <BookOpen className="w-5 h-5 text-primary" />
        Hostel Rules & Guidelines
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {hostelRules.map((item, index) => (
        <div key={index} className="flex items-start gap-2 py-1.5">
          <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
            item.priority === 'high' ? 'text-destructive' : 
            item.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'
          }`} />
          <span className="text-sm">{item.rule}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Quick Links Module
const quickLinks = [
  { name: "Download ID Card", url: "#", category: "Documents" },
  { name: "Fee Payment Portal", url: "#", category: "Payment" },
  { name: "Leave Application", url: "#", category: "Forms" },
  { name: "Room Change Request", url: "#", category: "Forms" },
  { name: "Hostel Guidelines PDF", url: "#", category: "Documents" },
];

export const QuickLinksModule = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <ExternalLink className="w-5 h-5 text-primary" />
        Quick Links
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {quickLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors group"
        >
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            {link.name}
          </span>
          <Badge variant="secondary" className="text-xs">
            {link.category}
          </Badge>
        </a>
      ))}
    </CardContent>
  </Card>
);

// Events Calendar Module
const upcomingEvents = [
  { name: "Hostel Day Celebration", date: "Dec 25, 2024", type: "Event" },
  { name: "Mess Bill Due", date: "Dec 31, 2024", type: "Payment" },
  { name: "Room Inspection", date: "Jan 5, 2025", type: "Notice" },
  { name: "Cultural Night", date: "Jan 10, 2025", type: "Event" },
  { name: "Semester Fee Due", date: "Jan 15, 2025", type: "Payment" },
];

export const EventsCalendarModule = () => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <CalendarDays className="w-5 h-5 text-primary" />
        Upcoming Events
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {upcomingEvents.map((event, index) => (
        <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
          <div>
            <p className="font-medium text-sm">{event.name}</p>
            <p className="text-xs text-muted-foreground">{event.date}</p>
          </div>
          <Badge 
            variant={event.type === 'Payment' ? 'destructive' : event.type === 'Event' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {event.type}
          </Badge>
        </div>
      ))}
    </CardContent>
  </Card>
);

// Combined Modules Grid Component
export const DashboardModulesGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    <MessMenuModule />
    <EmergencyContactsModule />
    <EventsCalendarModule />
    <HostelRulesModule />
    <QuickLinksModule />
  </div>
);
