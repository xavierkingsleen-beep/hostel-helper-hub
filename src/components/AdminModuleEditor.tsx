import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  UtensilsCrossed, 
  Phone, 
  BookOpen, 
  ExternalLink, 
  CalendarDays,
  Save,
  Plus,
  Trash2,
  Edit2
} from "lucide-react";

// Types for module data
interface MessMeal {
  time: string;
  items: string[];
}

interface MessMenuData {
  breakfast: MessMeal;
  lunch: MessMeal;
  snacks: MessMeal;
  dinner: MessMeal;
}

interface EmergencyContact {
  name: string;
  phone: string;
  available: string;
}

interface HostelRule {
  rule: string;
  priority: "high" | "medium" | "low";
}

interface QuickLink {
  name: string;
  url: string;
  category: string;
}

interface UpcomingEvent {
  name: string;
  date: string;
  type: "Event" | "Payment" | "Notice";
}

// Default data
const defaultMessMenu: MessMenuData = {
  breakfast: { time: "7:30 AM - 9:00 AM", items: ["Idli/Dosa", "Chutney", "Sambar", "Tea/Coffee"] },
  lunch: { time: "12:30 PM - 2:00 PM", items: ["Rice", "Dal", "Sabzi", "Roti", "Salad"] },
  snacks: { time: "5:00 PM - 6:00 PM", items: ["Samosa", "Tea", "Biscuits"] },
  dinner: { time: "7:30 PM - 9:00 PM", items: ["Rice", "Dal", "Paneer/Chicken", "Roti", "Sweet"] },
};

const defaultContacts: EmergencyContact[] = [
  { name: "Hostel Warden", phone: "+91 98765 43210", available: "24/7" },
  { name: "Security Office", phone: "+91 98765 43211", available: "24/7" },
  { name: "Medical Emergency", phone: "+91 98765 43212", available: "24/7" },
  { name: "Maintenance", phone: "+91 98765 43213", available: "8AM-8PM" },
  { name: "Mess Manager", phone: "+91 98765 43214", available: "7AM-10PM" },
];

const defaultRules: HostelRule[] = [
  { rule: "Gate closes at 10:00 PM", priority: "high" },
  { rule: "Visitors allowed till 6:00 PM only", priority: "medium" },
  { rule: "No loud music after 9:00 PM", priority: "medium" },
  { rule: "WiFi password changes every month", priority: "low" },
  { rule: "Report water leakage immediately", priority: "high" },
];

const defaultLinks: QuickLink[] = [
  { name: "Download ID Card", url: "#", category: "Documents" },
  { name: "Fee Payment Portal", url: "#", category: "Payment" },
  { name: "Leave Application", url: "#", category: "Forms" },
  { name: "Room Change Request", url: "#", category: "Forms" },
  { name: "Hostel Guidelines PDF", url: "#", category: "Documents" },
];

const defaultEvents: UpcomingEvent[] = [
  { name: "Hostel Day Celebration", date: "Dec 25, 2024", type: "Event" },
  { name: "Mess Bill Due", date: "Dec 31, 2024", type: "Payment" },
  { name: "Room Inspection", date: "Jan 5, 2025", type: "Notice" },
  { name: "Cultural Night", date: "Jan 10, 2025", type: "Event" },
  { name: "Semester Fee Due", date: "Jan 15, 2025", type: "Payment" },
];

export const AdminModuleEditor = () => {
  const [messMenu, setMessMenu] = useState<MessMenuData>(defaultMessMenu);
  const [contacts, setContacts] = useState<EmergencyContact[]>(defaultContacts);
  const [rules, setRules] = useState<HostelRule[]>(defaultRules);
  const [links, setLinks] = useState<QuickLink[]>(defaultLinks);
  const [events, setEvents] = useState<UpcomingEvent[]>(defaultEvents);

  const handleSaveMessMenu = () => {
    toast({ title: "Mess Menu Updated", description: "Changes saved successfully" });
  };

  const handleSaveContacts = () => {
    toast({ title: "Emergency Contacts Updated", description: "Changes saved successfully" });
  };

  const handleSaveRules = () => {
    toast({ title: "Hostel Rules Updated", description: "Changes saved successfully" });
  };

  const handleSaveLinks = () => {
    toast({ title: "Quick Links Updated", description: "Changes saved successfully" });
  };

  const handleSaveEvents = () => {
    toast({ title: "Events Updated", description: "Changes saved successfully" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-primary" />
          Edit Dashboard Modules
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mess" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-4">
            <TabsTrigger value="mess" className="text-xs">
              <UtensilsCrossed className="w-4 h-4 mr-1" />
              Mess
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-xs">
              <Phone className="w-4 h-4 mr-1" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="rules" className="text-xs">
              <BookOpen className="w-4 h-4 mr-1" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="links" className="text-xs">
              <ExternalLink className="w-4 h-4 mr-1" />
              Links
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              <CalendarDays className="w-4 h-4 mr-1" />
              Events
            </TabsTrigger>
          </TabsList>

          {/* Mess Menu Editor */}
          <TabsContent value="mess" className="space-y-4">
            {(Object.keys(messMenu) as Array<keyof MessMenuData>).map((meal) => (
              <div key={meal} className="border rounded-lg p-4 space-y-3">
                <Label className="capitalize font-semibold">{meal}</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Time</Label>
                    <Input
                      value={messMenu[meal].time}
                      onChange={(e) =>
                        setMessMenu({
                          ...messMenu,
                          [meal]: { ...messMenu[meal], time: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Items (comma separated)</Label>
                    <Input
                      value={messMenu[meal].items.join(", ")}
                      onChange={(e) =>
                        setMessMenu({
                          ...messMenu,
                          [meal]: { ...messMenu[meal], items: e.target.value.split(", ") },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handleSaveMessMenu} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save Mess Menu
            </Button>
          </TabsContent>

          {/* Emergency Contacts Editor */}
          <TabsContent value="contacts" className="space-y-4">
            {contacts.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Contact {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setContacts(contacts.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Name"
                    value={contact.name}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[index].name = e.target.value;
                      setContacts(updated);
                    }}
                  />
                  <Input
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[index].phone = e.target.value;
                      setContacts(updated);
                    }}
                  />
                  <Input
                    placeholder="Available"
                    value={contact.available}
                    onChange={(e) => {
                      const updated = [...contacts];
                      updated[index].available = e.target.value;
                      setContacts(updated);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setContacts([...contacts, { name: "", phone: "", available: "" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Contact
            </Button>
            <Button onClick={handleSaveContacts} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save Contacts
            </Button>
          </TabsContent>

          {/* Hostel Rules Editor */}
          <TabsContent value="rules" className="space-y-4">
            {rules.map((rule, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Rule {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRules(rules.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Input
                      placeholder="Rule"
                      value={rule.rule}
                      onChange={(e) => {
                        const updated = [...rules];
                        updated[index].rule = e.target.value;
                        setRules(updated);
                      }}
                    />
                  </div>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={rule.priority}
                    onChange={(e) => {
                      const updated = [...rules];
                      updated[index].priority = e.target.value as "high" | "medium" | "low";
                      setRules(updated);
                    }}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setRules([...rules, { rule: "", priority: "medium" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Rule
            </Button>
            <Button onClick={handleSaveRules} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save Rules
            </Button>
          </TabsContent>

          {/* Quick Links Editor */}
          <TabsContent value="links" className="space-y-4">
            {links.map((link, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Link {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLinks(links.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Name"
                    value={link.name}
                    onChange={(e) => {
                      const updated = [...links];
                      updated[index].name = e.target.value;
                      setLinks(updated);
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...links];
                      updated[index].url = e.target.value;
                      setLinks(updated);
                    }}
                  />
                  <Input
                    placeholder="Category"
                    value={link.category}
                    onChange={(e) => {
                      const updated = [...links];
                      updated[index].category = e.target.value;
                      setLinks(updated);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setLinks([...links, { name: "", url: "", category: "" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Link
            </Button>
            <Button onClick={handleSaveLinks} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save Links
            </Button>
          </TabsContent>

          {/* Events Editor */}
          <TabsContent value="events" className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Event {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEvents(events.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Event Name"
                    value={event.name}
                    onChange={(e) => {
                      const updated = [...events];
                      updated[index].name = e.target.value;
                      setEvents(updated);
                    }}
                  />
                  <Input
                    placeholder="Date"
                    value={event.date}
                    onChange={(e) => {
                      const updated = [...events];
                      updated[index].date = e.target.value;
                      setEvents(updated);
                    }}
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={event.type}
                    onChange={(e) => {
                      const updated = [...events];
                      updated[index].type = e.target.value as "Event" | "Payment" | "Notice";
                      setEvents(updated);
                    }}
                  >
                    <option value="Event">Event</option>
                    <option value="Payment">Payment</option>
                    <option value="Notice">Notice</option>
                  </select>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setEvents([...events, { name: "", date: "", type: "Event" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Event
            </Button>
            <Button onClick={handleSaveEvents} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save Events
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
