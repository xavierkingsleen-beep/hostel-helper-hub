import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StudentLayout } from "@/components/StudentLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { useComplaints } from "@/hooks/useComplaints";
import { useAuth } from "@/hooks/useAuth";
import { Send, Plus, List, Loader2, Camera, X } from "lucide-react";
import { format } from "date-fns";

const categories = [
  { value: "Electrical", label: "⚡ Electrical" },
  { value: "Water", label: "💧 Water" },
  { value: "Cleaning", label: "🧹 Cleaning" },
  { value: "Food", label: "🍽️ Food" },
  { value: "Internet", label: "🌐 Internet" },
  { value: "Ragging", label: "🚨 Ragging" },
  { value: "Play Equipments", label: "🏀 Play Equipments" },
  { value: "Other", label: "📝 Other" },
];

export default function Complaints() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [studentName, setStudentName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { complaints, isLoading, submitComplaint } = useComplaints();
  const { profile } = useAuth();

  // Pre-fill from profile
  useState(() => {
    if (profile) {
      setStudentName(profile.full_name || "");
      setRoomNumber(profile.room_number || "");
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description.trim() || !studentName.trim()) {
      return;
    }

    setIsSubmitting(true);
    const success = await submitComplaint(category, description, studentName, roomNumber, selectedFile || undefined);
    if (success) {
      setCategory("");
      setDescription("");
      clearFile();
    }
    setIsSubmitting(false);
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Complaints</h1>
          <p className="text-muted-foreground">Submit and track your complaints</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Submit Complaint Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Raise Complaint
              </CardTitle>
              <CardDescription>
                Submit a new complaint for quick resolution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Your Name *</Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter your name"
                      defaultValue={profile?.full_name || ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Input
                      id="roomNumber"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      placeholder="e.g., A-101"
                      defaultValue={profile?.room_number || ""}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Attach Photo (optional)</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {previewUrl ? (
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={clearFile}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-dashed"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Add Photo
                    </Button>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !category || !description.trim() || !studentName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Complaints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                My Complaints
              </CardTitle>
              <CardDescription>
                Track the status of your submitted complaints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No complaints submitted yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the form to submit your first complaint.
                  </p>
                </div>
              ) : (
                complaints.map((complaint) => (
                  <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">
                            {complaint.category}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {complaint.description}
                          </p>
                          {complaint.image_url && (
                            <img
                              src={complaint.image_url}
                              alt="Complaint photo"
                              className="w-20 h-20 object-cover rounded-lg border border-border mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setViewImageUrl(complaint.image_url)}
                            />
                          )}
                          {complaint.status === "Resolved" && complaint.resolution_reason && (
                            <div className="bg-accent/50 border border-accent rounded-lg p-3 mb-3">
                              <p className="text-sm font-medium text-foreground">Resolution Note</p>
                              <p className="text-sm text-muted-foreground mt-1">{complaint.resolution_reason}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Submitted: {format(new Date(complaint.created_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <StatusBadge status={complaint.status} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full-size image viewer dialog */}
      <Dialog open={!!viewImageUrl} onOpenChange={() => setViewImageUrl(null)}>
        <DialogContent className="max-w-3xl">
          {viewImageUrl && (
            <img src={viewImageUrl} alt="Complaint photo" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
