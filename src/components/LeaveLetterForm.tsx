import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { FileText, Send, Calendar, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface LeaveApplication {
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

interface LeaveLetterFormProps {
  onSubmit?: (application: LeaveApplication) => void;
}

const leaveTypes = [
  { value: "Home Visit", label: "🏠 Home Visit" },
  { value: "Medical", label: "🏥 Medical Leave" },
  { value: "Family Emergency", label: "👨‍👩‍👧 Family Emergency" },
  { value: "Academic", label: "📚 Academic Purpose" },
  { value: "Personal", label: "👤 Personal Leave" },
];

// Demo submitted applications
const demoApplications: LeaveApplication[] = [
  {
    id: "1",
    studentName: "John Doe",
    roomNo: "A-101",
    leaveType: "Home Visit",
    fromDate: "2024-12-20",
    toDate: "2024-12-25",
    reason: "Going home for Christmas vacation",
    parentContact: "+91 98765 43210",
    status: "Approved",
    submittedAt: "Dec 15, 2024",
  },
  {
    id: "2",
    studentName: "John Doe",
    roomNo: "A-101",
    leaveType: "Medical",
    fromDate: "2024-12-10",
    toDate: "2024-12-12",
    reason: "Doctor's appointment and recovery",
    parentContact: "+91 98765 43210",
    status: "Pending",
    submittedAt: "Dec 8, 2024",
  },
];

export const LeaveLetterForm = ({ onSubmit }: LeaveLetterFormProps) => {
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myApplications, setMyApplications] = useState<LeaveApplication[]>(demoApplications);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!leaveType || !fromDate || !toDate || !reason.trim() || !parentContact.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newApplication: LeaveApplication = {
        id: Date.now().toString(),
        studentName: "John Doe", // Would come from auth in real app
        roomNo: "A-101",
        leaveType,
        fromDate,
        toDate,
        reason,
        parentContact,
        status: "Pending",
        submittedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      setMyApplications([newApplication, ...myApplications]);
      onSubmit?.(newApplication);

      // Reset form
      setLeaveType("");
      setFromDate("");
      setToDate("");
      setReason("");
      setParentContact("");
      setIsSubmitting(false);

      toast({
        title: "Leave Application Submitted!",
        description: "Your leave application has been sent to the admin for approval.",
      });
    }, 800);
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

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Leave Application Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Apply for Leave
          </CardTitle>
          <CardDescription>
            Submit a leave application for admin approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date</Label>
                <Input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">To Date</Label>
                <Input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentContact">Parent/Guardian Contact</Label>
              <Input
                id="parentContact"
                placeholder="Enter parent's phone number"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                placeholder="Explain your reason for leave in detail..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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
                  Submit Application
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* My Leave Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            My Leave Applications
          </CardTitle>
          <CardDescription>
            Track the status of your leave applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
          {myApplications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No leave applications submitted yet.
            </p>
          ) : (
            myApplications.map((app) => (
              <div
                key={app.id}
                className="border rounded-lg p-4 space-y-2 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{app.leaveType}</span>
                  {getStatusBadge(app.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {app.fromDate} to {app.toDate}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{app.reason}</p>
                <p className="text-xs text-muted-foreground">Submitted: {app.submittedAt}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
