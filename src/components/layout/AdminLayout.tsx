"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-6 py-4 dark:border-border dark:bg-card dark:text-foreground">
          <div className="flex items-center justify-between text-sm text-muted-foreground dark:text-muted-foreground">
            <p>&copy; 2026 AdminLTE Dashboard. degsin by TrongAnIT.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
