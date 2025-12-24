import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLeaveApplications, LeaveApplication } from "@/hooks/useLeaveApplications";
import { format } from "date-fns";

export const AdminLeaveManager = () => {
  const { applications, isLoading, updateApplicationStatus } = useLeaveApplications();

  const handleStatusChange = async (id: string, newStatus: "Pending" | "Approved" | "Rejected") => {
    const { error } = await updateApplicationStatus(id, newStatus);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Status Updated",
      description: `Leave application ${newStatus.toLowerCase()}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "Pending").length,
    approved: applications.filter((a) => a.status === "Approved").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Leave Applications
          </CardTitle>
          <CardDescription>
            View and manage student leave applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No leave applications yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">{app.student_name}</TableCell>
                      <TableCell>{app.room_number || "-"}</TableCell>
                      <TableCell>{app.leave_type}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(app.start_date)} to {formatDate(app.end_date)}
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(app.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Leave Application Details</DialogTitle>
                                <DialogDescription>
                                  {app.student_name} - {app.room_number || "No room"}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Leave Type</p>
                                    <p className="font-medium">{app.leave_type}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    {getStatusBadge(app.status)}
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">From</p>
                                    <p className="font-medium">{formatDate(app.start_date)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">To</p>
                                    <p className="font-medium">{formatDate(app.end_date)}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Parent Contact</p>
                                  <p className="font-medium">{app.parent_contact || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Reason</p>
                                  <p className="font-medium">{app.reason}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Select
                            value={app.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                app.id,
                                value as "Pending" | "Approved" | "Rejected"
                              )
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
