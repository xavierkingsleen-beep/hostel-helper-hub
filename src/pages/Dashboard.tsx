import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { StudentLayout } from "@/components/StudentLayout";
import { NoticeBoard } from "@/components/NoticeBoard";
import { DashboardModulesGrid } from "@/components/DashboardModules";
import { useAuth } from "@/hooks/useAuth";
import { useComplaints } from "@/hooks/useComplaints";
import { useLeaveApplications } from "@/hooks/useLeaveApplications";
import {
  MessageSquare,
  FileText,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
  Phone,
} from "lucide-react";

export default function Dashboard() {
  const { profile } = useAuth();
  const { complaints } = useComplaints();
  const { applications } = useLeaveApplications();

  const pendingComplaints = complaints.filter((c) => c.status === "Pending").length;
  const pendingLeaves = applications.filter((a) => a.status === "Pending").length;

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {profile?.full_name?.split(" ")[0] || "Student"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening in your hostel today.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{profile?.room_number || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Room</p>
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
                  <p className="text-xl font-bold">{pendingComplaints}</p>
                  <p className="text-xs text-muted-foreground">Pending Complaints</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{pendingLeaves}</p>
                  <p className="text-xs text-muted-foreground">Pending Leaves</p>
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
                  <p className="text-xl font-bold">
                    {complaints.filter((c) => c.status === "Resolved").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notice Board */}
        <NoticeBoard />

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Raise a Complaint
              </CardTitle>
              <CardDescription>
                Report issues with room, mess, or hostel facilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/complaints">
                <Button className="w-full gap-2">
                  Submit Complaint
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Apply for Leave
              </CardTitle>
              <CardDescription>
                Submit leave application for hostel absence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/leave">
                <Button variant="outline" className="w-full gap-2">
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Hostel Info Modules */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Hostel Information</h2>
          <DashboardModulesGrid />
        </div>
      </div>
    </StudentLayout>
  );
}
