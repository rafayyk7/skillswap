import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}

