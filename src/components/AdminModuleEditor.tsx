import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useModules, MessMenuItem, EmergencyContact, HostelRule, QuickLink, EventItem } from "@/hooks/useModules";

export const AdminModuleEditor = () => {
  const { 
    messMenu, 
    emergencyContacts, 
    hostelRules, 
    quickLinks, 
    events, 
    isLoading,
    updateMessMenu,
    saveEmergencyContacts,
    saveHostelRules,
    saveQuickLinks,
    saveEvents
  } = useModules();

  // Local state for editing
  const [localMessMenu, setLocalMessMenu] = useState<MessMenuItem[]>([]);
  const [localContacts, setLocalContacts] = useState<{ name: string; role: string; phone: string }[]>([]);
  const [localRules, setLocalRules] = useState<{ rule: string }[]>([]);
  const [localLinks, setLocalLinks] = useState<{ title: string; url: string; icon: string }[]>([]);
  const [localEvents, setLocalEvents] = useState<{ title: string; event_date: string; event_time: string; location: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize local state from database
  useEffect(() => {
    if (messMenu.length > 0) setLocalMessMenu(messMenu);
    if (emergencyContacts.length > 0) {
      setLocalContacts(emergencyContacts.map(c => ({ name: c.name, role: c.role, phone: c.phone })));
    }
    if (hostelRules.length > 0) {
      setLocalRules(hostelRules.map(r => ({ rule: r.rule })));
    }
    if (quickLinks.length > 0) {
      setLocalLinks(quickLinks.map(l => ({ title: l.title, url: l.url, icon: l.icon })));
    }
    if (events.length > 0) {
      setLocalEvents(events.map(e => ({ 
        title: e.title, 
        event_date: e.event_date, 
        event_time: e.event_time || "", 
        location: e.location || "" 
      })));
    }
  }, [messMenu, emergencyContacts, hostelRules, quickLinks, events]);

  const handleSaveMessMenu = async () => {
    setIsSaving(true);
    await updateMessMenu(localMessMenu);
    setIsSaving(false);
  };

  const handleSaveContacts = async () => {
    setIsSaving(true);
    await saveEmergencyContacts(localContacts.filter(c => c.name && c.phone));
    setIsSaving(false);
  };

  const handleSaveRules = async () => {
    setIsSaving(true);
    await saveHostelRules(localRules.filter(r => r.rule));
    setIsSaving(false);
  };

  const handleSaveLinks = async () => {
    setIsSaving(true);
    await saveQuickLinks(localLinks.filter(l => l.title && l.url));
    setIsSaving(false);
  };

  const handleSaveEvents = async () => {
    setIsSaving(true);
    await saveEvents(localEvents.filter(e => e.title && e.event_date).map(e => ({
      title: e.title,
      event_date: e.event_date,
      event_time: e.event_time || null,
      location: e.location || null
    })));
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

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
            {localMessMenu.map((item, index) => (
              <div key={item.id || index} className="border rounded-lg p-4 space-y-3">
                <Label className="font-semibold">{item.day}</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Breakfast</Label>
                    <Input
                      value={item.breakfast}
                      onChange={(e) => {
                        const updated = [...localMessMenu];
                        updated[index] = { ...updated[index], breakfast: e.target.value };
                        setLocalMessMenu(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Lunch</Label>
                    <Input
                      value={item.lunch}
                      onChange={(e) => {
                        const updated = [...localMessMenu];
                        updated[index] = { ...updated[index], lunch: e.target.value };
                        setLocalMessMenu(updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Dinner</Label>
                    <Input
                      value={item.dinner}
                      onChange={(e) => {
                        const updated = [...localMessMenu];
                        updated[index] = { ...updated[index], dinner: e.target.value };
                        setLocalMessMenu(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handleSaveMessMenu} className="w-full" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Mess Menu"}
            </Button>
          </TabsContent>

          {/* Emergency Contacts Editor */}
          <TabsContent value="contacts" className="space-y-4">
            {localContacts.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Contact {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocalContacts(localContacts.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Name"
                    value={contact.name}
                    onChange={(e) => {
                      const updated = [...localContacts];
                      updated[index] = { ...updated[index], name: e.target.value };
                      setLocalContacts(updated);
                    }}
                  />
                  <Input
                    placeholder="Role"
                    value={contact.role}
                    onChange={(e) => {
                      const updated = [...localContacts];
                      updated[index] = { ...updated[index], role: e.target.value };
                      setLocalContacts(updated);
                    }}
                  />
                  <Input
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) => {
                      const updated = [...localContacts];
                      updated[index] = { ...updated[index], phone: e.target.value };
                      setLocalContacts(updated);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setLocalContacts([...localContacts, { name: "", role: "", phone: "" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Contact
            </Button>
            <Button onClick={handleSaveContacts} className="w-full" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Contacts"}
            </Button>
          </TabsContent>

          {/* Hostel Rules Editor */}
          <TabsContent value="rules" className="space-y-4">
            {localRules.map((rule, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Rule {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocalRules(localRules.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <Input
                  placeholder="Rule"
                  value={rule.rule}
                  onChange={(e) => {
                    const updated = [...localRules];
                    updated[index] = { rule: e.target.value };
                    setLocalRules(updated);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setLocalRules([...localRules, { rule: "" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Rule
            </Button>
            <Button onClick={handleSaveRules} className="w-full" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Rules"}
            </Button>
          </TabsContent>

          {/* Quick Links Editor */}
          <TabsContent value="links" className="space-y-4">
            {localLinks.map((link, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Link {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocalLinks(localLinks.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Title"
                    value={link.title}
                    onChange={(e) => {
                      const updated = [...localLinks];
                      updated[index] = { ...updated[index], title: e.target.value };
                      setLocalLinks(updated);
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...localLinks];
                      updated[index] = { ...updated[index], url: e.target.value };
                      setLocalLinks(updated);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setLocalLinks([...localLinks, { title: "", url: "", icon: "Link" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Link
            </Button>
            <Button onClick={handleSaveLinks} className="w-full" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Links"}
            </Button>
          </TabsContent>

          {/* Events Editor */}
          <TabsContent value="events" className="space-y-4">
            {localEvents.map((event, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="font-semibold">Event {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocalEvents(localEvents.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Event Title"
                    value={event.title}
                    onChange={(e) => {
                      const updated = [...localEvents];
                      updated[index] = { ...updated[index], title: e.target.value };
                      setLocalEvents(updated);
                    }}
                  />
                  <Input
                    type="date"
                    value={event.event_date}
                    onChange={(e) => {
                      const updated = [...localEvents];
                      updated[index] = { ...updated[index], event_date: e.target.value };
                      setLocalEvents(updated);
                    }}
                  />
                  <Input
                    placeholder="Time (e.g., 6:00 PM)"
                    value={event.event_time}
                    onChange={(e) => {
                      const updated = [...localEvents];
                      updated[index] = { ...updated[index], event_time: e.target.value };
                      setLocalEvents(updated);
                    }}
                  />
                  <Input
                    placeholder="Location"
                    value={event.location}
                    onChange={(e) => {
                      const updated = [...localEvents];
                      updated[index] = { ...updated[index], location: e.target.value };
                      setLocalEvents(updated);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setLocalEvents([...localEvents, { title: "", event_date: "", event_time: "", location: "" }])}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Event
            </Button>
            <Button onClick={handleSaveEvents} className="w-full" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Events"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
