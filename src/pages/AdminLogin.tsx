import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { LogIn, ArrowLeft, ShieldCheck, Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !adminCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields including admin code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Demo admin credentials - Replace with actual authentication
    // In production, this should be validated server-side
    setTimeout(() => {
      setIsLoading(false);
      
      // Demo: Check admin credentials (replace with real auth)
      if (adminCode === "ADMIN123" && email && password) {
        toast({
          title: "Welcome Admin!",
          description: "Access granted. Redirecting to admin dashboard...",
        });
        navigate("/admin-dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials. Please check your admin code.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-primary">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>
              Secure access for hostel administrators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hostel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminCode" className="flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Admin Access Code
                </Label>
                <Input
                  id="adminCode"
                  type="password"
                  placeholder="Enter admin code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Demo code: ADMIN123
                </p>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  "Verifying..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border text-center text-sm">
              <span className="text-muted-foreground">Student? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          🔒 This area is restricted to authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
