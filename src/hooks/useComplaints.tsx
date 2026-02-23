import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface Complaint {
  id: string;
  student_id: string;
  student_name: string;
  room_number: string | null;
  category: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  resolution_reason: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  const fetchComplaints = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setComplaints((data as Complaint[]) || []);
    } catch (error: any) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Failed to load complaints",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitComplaint = async (
    category: string,
    description: string,
    studentName: string,
    roomNumber: string,
    imageFile?: File
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a complaint",
        variant: "destructive",
      });
      return false;
    }

    try {
      let image_url: string | null = null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("complaint-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("complaint-images")
          .getPublicUrl(filePath);

        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("complaints").insert({
        student_id: user.id,
        student_name: studentName,
        room_number: roomNumber,
        category,
        description,
        status: "Pending",
        image_url,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Complaint submitted successfully",
      });

      await fetchComplaints();
      return true;
    } catch (error: any) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Error",
        description: "Failed to submit complaint",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateComplaintStatus = async (
    id: string,
    status: "Pending" | "In Progress" | "Resolved",
    resolution_reason?: string
  ) => {
    try {
      const updateData: { status: string; resolution_reason?: string | null } = { status };
      if (status === "Resolved") {
        updateData.resolution_reason = resolution_reason || null;
      } else {
        updateData.resolution_reason = null;
      }

      const { error } = await supabase
        .from("complaints")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status, resolution_reason: updateData.resolution_reason ?? null } : c))
      );

      toast({
        title: "Status Updated",
        description: `Complaint status changed to ${status}`,
      });

      return true;
    } catch (error: any) {
      console.error("Error updating complaint:", error);
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  return {
    complaints,
    isLoading,
    submitComplaint,
    updateComplaintStatus,
    refetch: fetchComplaints,
  };
}
