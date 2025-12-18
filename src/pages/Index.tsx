import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, LogIn, UserPlus, MessageSquare, Shield, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-primary">
              <Home className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl">Hostel Complaint Tracker</CardTitle>
            <CardDescription className="text-base mt-2">
              A digital platform for hostel students to register complaints
              and track issue resolution efficiently.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-5 h-5 text-accent-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Easy Reporting</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-accent-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Track Progress</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-accent-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Secure System</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="default" className="flex-1" size="lg">
                <Link to="/login">
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link to="/register">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help? Contact the hostel administration office.
        </p>
      </div>
    </div>
  );
};

export default Index;
