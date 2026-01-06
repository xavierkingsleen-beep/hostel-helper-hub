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
import { useComplaints } from "@/hooks/useComplaints";
import { LogOut, Settings, ClipboardList, Users, CheckCircle, Clock, Bell, LayoutGrid, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";

const AdminDashboard = () => {
  const { complaints, isLoading, updateComplaintStatus } = useComplaints();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  const handleStatusChange = async (id: string, newStatus: "Pending" | "In Progress" | "Resolved") => {
    await updateComplaintStatus(id, newStatus);
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
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            <p className="text-muted-foreground mt-2">Loading complaints...</p>
                          </TableCell>
                        </TableRow>
                      ) : complaints.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No complaints found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        complaints.map((complaint) => (
                          <TableRow key={complaint.id} className="hover:bg-accent/50">
                            <TableCell className="font-medium">{complaint.student_name}</TableCell>
                            <TableCell>{complaint.room_number || "-"}</TableCell>
                            <TableCell>{complaint.category}</TableCell>
                            <TableCell className="max-w-[250px] truncate">
                              {complaint.description}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={complaint.status} />
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {format(new Date(complaint.created_at), "MMM dd, yyyy")}
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
                        ))
                      )}
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
