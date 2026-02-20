import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { FileText, Send, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLeaveApplications, LeaveApplication } from "@/hooks/useLeaveApplications";
import { format } from "date-fns";

const leaveTypes = [
  { value: "Home Visit", label: "🏠 Home Visit" },
  { value: "Medical", label: "🏥 Medical Leave" },
  { value: "Family Emergency", label: "👨‍👩‍👧 Family Emergency" },
  { value: "Academic", label: "📚 Academic Purpose" },
  { value: "Personal", label: "👤 Personal Leave" },
];

export const LeaveLetterForm = () => {
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { applications, isLoading, submitApplication } = useLeaveApplications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !rollNumber.trim() || !roomNumber.trim() || !leaveType || !fromDate || !toDate || !reason.trim() || !parentContact.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await submitApplication({
      student_name: studentName,
      roll_number: rollNumber,
      room_number: roomNumber,
      leave_type: leaveType,
      start_date: fromDate,
      end_date: toDate,
      reason,
      parent_contact: parentContact,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave application",
        variant: "destructive",
      });
      return;
    }

    // Reset form
    setStudentName("");
    setRollNumber("");
    setRoomNumber("");
    setLeaveType("");
    setFromDate("");
    setToDate("");
    setReason("");
    setParentContact("");

    toast({
      title: "Leave Application Submitted!",
      description: "Your leave application has been sent to the admin for approval.",
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
              <Label htmlFor="studentName">Student Name *</Label>
              <Input
                id="studentName"
                placeholder="Enter your full name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input
                  id="rollNumber"
                  placeholder="e.g., 21CS101"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number *</Label>
                <Input
                  id="roomNumber"
                  placeholder="e.g., A-101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
            </div>

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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No leave applications submitted yet.
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="border rounded-lg p-4 space-y-2 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{app.leave_type}</span>
                  {getStatusBadge(app.status)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(app.start_date)} to {formatDate(app.end_date)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{app.reason}</p>
                {app.status === "Rejected" && app.reject_reason && (
                  <div className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                    <p className="text-xs font-medium text-destructive">Rejection Reason</p>
                    <p className="text-xs text-foreground mt-0.5">{app.reject_reason}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Submitted: {formatDate(app.created_at)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
