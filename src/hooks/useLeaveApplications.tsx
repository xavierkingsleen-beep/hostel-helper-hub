import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface LeaveApplication {
  id: string;
  student_id: string;
  student_name: string;
  roll_number: string | null;
  room_number: string | null;
  phone: string | null;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  parent_contact: string | null;
  address_during_leave: string | null;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
  updated_at: string;
}

export const useLeaveApplications = () => {
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const fetchApplications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("leave_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data as LeaveApplication[]);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leave applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitApplication = async (application: {
    student_name: string;
    roll_number: string;
    room_number: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    parent_contact: string;
    address_during_leave?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      // Fetch profile for phone
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", user.id)
        .maybeSingle();

      const { error } = await supabase.from("leave_applications").insert({
        student_id: user.id,
        student_name: application.student_name,
        roll_number: application.roll_number,
        room_number: application.room_number,
        phone: profile?.phone,
        leave_type: application.leave_type,
        start_date: application.start_date,
        end_date: application.end_date,
        reason: application.reason,
        parent_contact: application.parent_contact,
        address_during_leave: application.address_during_leave,
      });

      if (error) throw error;

      await fetchApplications();
      return { error: null };
    } catch (error) {
      console.error("Error submitting application:", error);
      return { error: error as Error };
    }
  };

  const updateApplicationStatus = async (id: string, status: "Pending" | "Approved" | "Rejected") => {
    if (!isAdmin) return { error: new Error("Unauthorized") };

    try {
      const { error } = await supabase
        .from("leave_applications")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setApplications(applications.map(app => 
        app.id === id ? { ...app, status } : app
      ));
      return { error: null };
    } catch (error) {
      console.error("Error updating status:", error);
      return { error: error as Error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  return {
    applications,
    isLoading,
    submitApplication,
    updateApplicationStatus,
    refetch: fetchApplications,
  };
};
