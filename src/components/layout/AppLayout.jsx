import React from "react";
import { Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "./Navbar";

export default function AppLayout() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await base44.auth.logout("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} onLogout={handleLogout} />
      <main id="main-content" role="main" className="flex-1" tabIndex={-1}>
        <Outlet context={{ user }} />
      </main>
      <footer role="contentinfo" className="border-t bg-white/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Dicionário Colaborativo de Libras</p>
            <div className="flex items-center gap-4">
              <span aria-label="Em conformidade com WCAG 2.1 AA" className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                WCAG 2.1 AA
              </span>
              <span aria-label="Em conformidade com LGPD" className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                LGPD
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}