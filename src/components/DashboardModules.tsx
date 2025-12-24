import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UtensilsCrossed, 
  Phone, 
  BookOpen, 
  ExternalLink, 
  CalendarDays,
  Clock,
} from "lucide-react";
import { useModules } from "@/hooks/useModules";
import { format } from "date-fns";

// Mess Menu Module
export const MessMenuModule = () => {
  const { messMenu, isLoading } = useModules();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayMenu = messMenu.find(m => m.day === today) || messMenu[0];

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            Today's Mess Menu
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <UtensilsCrossed className="w-5 h-5 text-primary" />
          {todayMenu?.day || "Today"}'s Menu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todayMenu ? (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Breakfast</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  7:30 AM - 9:00 AM
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{todayMenu.breakfast}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Lunch</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  12:30 PM - 2:00 PM
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{todayMenu.lunch}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Dinner</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  7:30 PM - 9:00 PM
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{todayMenu.dinner}</p>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-4">No menu available</p>
        )}
      </CardContent>
    </Card>
  );
};

// Emergency Contacts Module
export const EmergencyContactsModule = () => {
  const { emergencyContacts, isLoading } = useModules();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="w-5 h-5 text-destructive" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Phone className="w-5 h-5 text-destructive" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {emergencyContacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No contacts available</p>
        ) : (
          emergencyContacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div>
                <p className="font-medium text-sm">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.role}</p>
              </div>
              <a 
                href={`tel:${contact.phone.replace(/\s/g, '')}`} 
                className="text-sm text-primary hover:underline font-mono"
              >
                {contact.phone}
              </a>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Hostel Rules Module
export const HostelRulesModule = () => {
  const { hostelRules, isLoading } = useModules();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" />
            Hostel Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          Hostel Rules & Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hostelRules.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No rules available</p>
        ) : (
          hostelRules.map((item, index) => (
            <div key={item.id} className="flex items-start gap-2 py-1.5">
              <span className="text-xs font-medium text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm">{item.rule}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Quick Links Module
export const QuickLinksModule = () => {
  const { quickLinks, isLoading } = useModules();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ExternalLink className="w-5 h-5 text-primary" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ExternalLink className="w-5 h-5 text-primary" />
          Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickLinks.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No links available</p>
        ) : (
          quickLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors group"
            >
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {link.title}
              </span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Events Calendar Module
export const EventsCalendarModule = () => {
  const { events, isLoading } = useModules();

  const formatEventDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="w-5 h-5 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No upcoming events</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatEventDate(event.event_date)}
                  {event.event_time && ` at ${event.event_time}`}
                </p>
              </div>
              {event.location && (
                <Badge variant="secondary" className="text-xs">
                  {event.location}
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

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
