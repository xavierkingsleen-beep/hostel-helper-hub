import { StudentLayout } from "@/components/StudentLayout";
import { LeaveLetterForm } from "@/components/LeaveLetterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { useLeaveApplications } from "@/hooks/useLeaveApplications";
import { FileText, List, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function Leave() {
  const { applications, isLoading } = useLeaveApplications();

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Leave Application</h1>
          <p className="text-muted-foreground">Apply for leave and track your applications</p>
        </div>

        <div className="space-y-6">
          {/* Leave Form */}
          <LeaveLetterForm />

          {/* My Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5 text-primary" />
                My Applications
              </CardTitle>
              <CardDescription>
                Track the status of your leave applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No applications submitted yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use the form to apply for leave.
                  </p>
                </div>
              ) : (
                applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">
                              {application.leave_type}
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format(new Date(application.start_date), "MMM dd")} -{" "}
                            {format(new Date(application.end_date), "MMM dd, yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {application.reason}
                          </p>
                        </div>
                        <StatusBadge status={application.status as "Pending" | "In Progress" | "Resolved"} />
                      </div>
                      {application.status === "Rejected" && application.reject_reason && (
                        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                          <p className="text-sm font-medium text-destructive">Rejection Reason</p>
                          <p className="text-sm text-foreground mt-1">{application.reject_reason}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
