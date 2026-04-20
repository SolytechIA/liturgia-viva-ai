import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Outlet } from "react-router-dom";

export const PublicLayout = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <PublicHeader />
    <main className="flex-1">
      <Outlet />
    </main>
    <PublicFooter />
  </div>
);
