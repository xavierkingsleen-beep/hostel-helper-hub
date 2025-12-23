import { useState } from "react";
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

interface LeaveApplication {
  id: string;
  studentName: string;
  roomNo: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  parentContact: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

// Demo leave applications
const demoLeaveApplications: LeaveApplication[] = [
  {
    id: "1",
    studentName: "John Doe",
    roomNo: "A-101",
    leaveType: "Home Visit",
    fromDate: "2024-12-20",
    toDate: "2024-12-25",
    reason: "Going home for Christmas vacation to celebrate with family.",
    parentContact: "+91 98765 43210",
    status: "Pending",
    submittedAt: "Dec 15, 2024",
  },
  {
    id: "2",
    studentName: "Jane Smith",
    roomNo: "B-205",
    leaveType: "Medical",
    fromDate: "2024-12-18",
    toDate: "2024-12-19",
    reason: "Need to visit the hospital for regular health checkup.",
    parentContact: "+91 98765 43211",
    status: "Approved",
    submittedAt: "Dec 14, 2024",
  },
  {
    id: "3",
    studentName: "Mike Johnson",
    roomNo: "C-302",
    leaveType: "Family Emergency",
    fromDate: "2024-12-16",
    toDate: "2024-12-17",
    reason: "Family emergency - grandmother is hospitalized.",
    parentContact: "+91 98765 43212",
    status: "Approved",
    submittedAt: "Dec 15, 2024",
  },
  {
    id: "4",
    studentName: "Sarah Wilson",
    roomNo: "A-115",
    leaveType: "Academic",
    fromDate: "2024-12-22",
    toDate: "2024-12-23",
    reason: "Attending inter-college competition at nearby university.",
    parentContact: "+91 98765 43213",
    status: "Pending",
    submittedAt: "Dec 16, 2024",
  },
  {
    id: "5",
    studentName: "Alex Brown",
    roomNo: "D-410",
    leaveType: "Personal",
    fromDate: "2024-12-24",
    toDate: "2024-12-26",
    reason: "Personal work - need to renew passport and documents.",
    parentContact: "+91 98765 43214",
    status: "Rejected",
    submittedAt: "Dec 13, 2024",
  },
];

export const AdminLeaveManager = () => {
  const [applications, setApplications] = useState<LeaveApplication[]>(demoLeaveApplications);
  const [selectedApp, setSelectedApp] = useState<LeaveApplication | null>(null);

  const handleStatusChange = (id: string, newStatus: "Pending" | "Approved" | "Rejected") => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
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

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "Pending").length,
    approved: applications.filter((a) => a.status === "Approved").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

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
                    <TableCell className="font-medium">{app.studentName}</TableCell>
                    <TableCell>{app.roomNo}</TableCell>
                    <TableCell>{app.leaveType}</TableCell>
                    <TableCell className="text-sm">
                      {app.fromDate} to {app.toDate}
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {app.submittedAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedApp(app)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Leave Application Details</DialogTitle>
                              <DialogDescription>
                                {app.studentName} - {app.roomNo}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Leave Type</p>
                                  <p className="font-medium">{app.leaveType}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  {getStatusBadge(app.status)}
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">From</p>
                                  <p className="font-medium">{app.fromDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">To</p>
                                  <p className="font-medium">{app.toDate}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Parent Contact</p>
                                <p className="font-medium">{app.parentContact}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};
