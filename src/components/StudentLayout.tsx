import { ReactNode } from "react";
import { StudentNavbar } from "./StudentNavbar";

interface StudentLayoutProps {
  children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="container mx-auto px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  );
}
