import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplaintCard } from "@/components/ComplaintCard";
import { toast } from "@/hooks/use-toast";
import { LogOut, Send, GraduationCap, Plus, List } from "lucide-react";

interface Complaint {
  id: string;
  category: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
}

const categories = [
  { value: "Electrical", label: "⚡ Electrical" },
  { value: "Water", label: "💧 Water" },
  { value: "Cleaning", label: "🧹 Cleaning" },
  { value: "Food", label: "🍽️ Food" },
  { value: "Internet", label: "🌐 Internet" },
  { value: "Ragging", label: "🚨 Ragging" },
  { value: "Play Equipments", label: "🏀 Play Equipments" },
];

// Demo complaints data
const demoComplaints: Complaint[] = [
  {
    id: "1",
    category: "Electrical",
    description: "The light in my room is not working properly, it keeps flickering.",
    status: "In Progress",
    createdAt: "Dec 15, 2024",
  },
  {
    id: "2",
    category: "Internet",
    description: "WiFi connection is very slow in Block A, 3rd floor.",
    status: "Pending",
    createdAt: "Dec 14, 2024",
  },
  {
    id: "3",
    category: "Cleaning",
    description: "Common bathroom needs thorough cleaning.",
    status: "Resolved",
    createdAt: "Dec 10, 2024",
  },
];

const StudentDashboard = () => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>(demoComplaints);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !description.trim()) {
      toast({
        title: "Error",
        description: "Please select a category and enter a description",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        category,
        description,
        status: "Pending",
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setComplaints([newComplaint, ...complaints]);
      setCategory("");
      setDescription("");
      setIsSubmitting(false);

      toast({
        title: "Complaint Submitted!",
        description: "Your complaint has been registered successfully.",
      });
    }, 800);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-primary">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Student</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Raise Complaint Form */}
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
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
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
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Submitting..."
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
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {complaints.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No complaints submitted yet.
                </p>
              ) : (
                complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    category={complaint.category}
                    description={complaint.description}
                    status={complaint.status}
                    createdAt={complaint.createdAt}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
