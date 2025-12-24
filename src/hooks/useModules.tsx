import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface MessMenuItem {
  id: string;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  sort_order: number;
}

export interface HostelRule {
  id: string;
  rule: string;
  sort_order: number;
}

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  sort_order: number;
}

export interface EventItem {
  id: string;
  title: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
}

export const useModules = () => {
  const [messMenu, setMessMenu] = useState<MessMenuItem[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [hostelRules, setHostelRules] = useState<HostelRule[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchAllModules = async () => {
    setIsLoading(true);
    try {
      const [menuRes, contactsRes, rulesRes, linksRes, eventsRes] = await Promise.all([
        supabase.from("mess_menu").select("*").order("day"),
        supabase.from("emergency_contacts").select("*").order("sort_order"),
        supabase.from("hostel_rules").select("*").order("sort_order"),
        supabase.from("quick_links").select("*").order("sort_order"),
        supabase.from("events").select("*").order("event_date"),
      ]);

      if (menuRes.data) setMessMenu(menuRes.data);
      if (contactsRes.data) setEmergencyContacts(contactsRes.data);
      if (rulesRes.data) setHostelRules(rulesRes.data);
      if (linksRes.data) setQuickLinks(linksRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mess Menu operations
  const updateMessMenu = async (items: MessMenuItem[]) => {
    if (!isAdmin) return { error: new Error("Unauthorized") };

    try {
      for (const item of items) {
        const { error } = await supabase
          .from("mess_menu")
          .upsert({
            id: item.id,
            day: item.day,
            breakfast: item.breakfast,
            lunch: item.lunch,
            dinner: item.dinner,
          });
        if (error) throw error;
      }
      await fetchAllModules();
      toast({ title: "Mess Menu Updated", description: "Changes saved successfully" });
      return { error: null };
    } catch (error) {
      toast({ title: "Error", description: "Failed to update mess menu", variant: "destructive" });
      return { error: error as Error };
    }
  };

  // Emergency Contacts operations
  const saveEmergencyContacts = async (contacts: { name: string; role: string; phone: string }[]) => {
    if (!isAdmin) return { error: new Error("Unauthorized") };

    try {
      await supabase.from("emergency_contacts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      const { error } = await supabase.from("emergency_contacts").insert(
        contacts.map((c, i) => ({ ...c, sort_order: i }))
      );
      if (error) throw error;
      
      await fetchAllModules();
      toast({ title: "Contacts Updated", description: "Changes saved successfully" });
      return { error: null };
    } catch (error) {
      toast({ title: "Error", description: "Failed to update contacts", variant: "destructive" });
      return { error: error as Error };
    }
  };

  // Hostel Rules operations
  const saveHostelRules = async (rules: { rule: string }[]) => {
    if (!isAdmin) return { error: new Error("Unauthorized") };

    try {
      await supabase.from("hostel_rules").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      const { error } = await supabase.from("hostel_rules").insert(
        rules.map((r, i) => ({ ...r, sort_order: i }))
      );
      if (error) throw error;
      
      await fetchAllModules();
      toast({ title: "Rules Updated", description: "Changes saved successfully" });
      return { error: null };
    } catch (error) {
      toast({ title: "Error", description: "Failed to update rules", variant: "destructive" });
      return { error: error as Error };
    }
  };

  // Quick Links operations
  const saveQuickLinks = async (links: { title: string; url: string; icon: string }[]) => {
    if (!isAdmin) return { error: new Error("Unauthorized") };

    try {
      await supabase.from("quick_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      const { error } = await supabase.from("quick_links").insert(
        links.map((l, i) => ({ ...l, sort_order: i }))
      );
      if (error) throw error;
      
      await fetchAllModules();
      toast({ title: "Links Updated", description: "Changes saved successfully" });
      return { error: null };
    } catch (error) {
      toast({ title: "Error", description: "Failed to update links", variant: "destructive" });
      return { error: error as Error };
    }
  };

  // Events operations
  const saveEvents = async (eventItems: Omit<EventItem, "id">[]) => {
    if (!isAdmin) return { error: new Error("Unauthorized") };

    try {
      await supabase.from("events").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      const { error } = await supabase.from("events").insert(eventItems);
      if (error) throw error;
      
      await fetchAllModules();
      toast({ title: "Events Updated", description: "Changes saved successfully" });
      return { error: null };
    } catch (error) {
      toast({ title: "Error", description: "Failed to update events", variant: "destructive" });
      return { error: error as Error };
    }
  };

  useEffect(() => {
    fetchAllModules();
  }, []);

  return {
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
    saveEvents,
    refetch: fetchAllModules,
  };
};
