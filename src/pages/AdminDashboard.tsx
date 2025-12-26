import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { AdminNoticeManager } from "@/components/AdminNoticeManager";
import { AdminModuleEditor } from "@/components/AdminModuleEditor";
import { AdminLeaveManager } from "@/components/AdminLeaveManager";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Settings, ClipboardList, Users, CheckCircle, Clock, Bell, LayoutGrid, FileText } from "lucide-react";

interface Complaint {
  id: string;
  studentName: string;
  roomNo: string;
  category: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
}

// Demo complaints data for admin
const demoComplaints: Complaint[] = [
  {
    id: "1",
    studentName: "John Doe",
    roomNo: "A-101",
    category: "Electrical",
    description: "The light in my room is not working properly, it keeps flickering.",
    status: "In Progress",
    createdAt: "Dec 15, 2024",
  },
  {
    id: "2",
    studentName: "Jane Smith",
    roomNo: "B-205",
    category: "Internet",
    description: "WiFi connection is very slow in Block A, 3rd floor.",
    status: "Pending",
    createdAt: "Dec 14, 2024",
  },
  {
    id: "3",
    studentName: "Mike Johnson",
    roomNo: "C-302",
    category: "Cleaning",
    description: "Common bathroom needs thorough cleaning.",
    status: "Resolved",
    createdAt: "Dec 10, 2024",
  },
  {
    id: "4",
    studentName: "Sarah Wilson",
    roomNo: "A-115",
    category: "Water",
    description: "Low water pressure in the morning hours.",
    status: "Pending",
    createdAt: "Dec 16, 2024",
  },
  {
    id: "5",
    studentName: "Alex Brown",
    roomNo: "D-410",
    category: "Food",
    description: "Food quality has decreased in the mess.",
    status: "In Progress",
    createdAt: "Dec 13, 2024",
  },
];

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(demoComplaints);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  const handleStatusChange = (id: string, newStatus: "Pending" | "In Progress" | "Resolved") => {
    setComplaints(
      complaints.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    toast({
      title: "Status Updated",
      description: `Complaint status changed to ${newStatus}`,
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-primary">
              <Settings className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage all hostel complaints</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Complaints, Notices, Modules, and Leave */}
        <Tabs defaultValue="complaints" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Complaints
            </TabsTrigger>
            <TabsTrigger value="notices" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notice Board
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Edit Modules
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Leave Letters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="complaints">
            {/* Complaints Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  All Complaints
                </CardTitle>
                <CardDescription>
                  View and manage all student complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="min-w-[200px]">Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((complaint) => (
                        <TableRow key={complaint.id} className="hover:bg-accent/50">
                          <TableCell className="font-medium">{complaint.studentName}</TableCell>
                          <TableCell>{complaint.roomNo}</TableCell>
                          <TableCell>{complaint.category}</TableCell>
                          <TableCell className="max-w-[250px] truncate">
                            {complaint.description}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={complaint.status} />
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {complaint.createdAt}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={complaint.status}
                              onValueChange={(value) =>
                                handleStatusChange(
                                  complaint.id,
                                  value as "Pending" | "In Progress" | "Resolved"
                                )
                              }
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notices">
            <AdminNoticeManager />
          </TabsContent>

          <TabsContent value="modules">
            <AdminModuleEditor />
          </TabsContent>

          <TabsContent value="leave">
            <AdminLeaveManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
