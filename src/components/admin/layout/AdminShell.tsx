"use client";

// ============================================================
// components/admin/layout/AdminShell.tsx
// Khung bọc giao diện chung cho toàn bộ Admin CMS
// ============================================================

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminShellProps {
  children: React.ReactNode;
  pendingOrdersCount?: number;
  pendingReviewsCount?: number;
  currentUser?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  pendingOrdersCount = 0,
  pendingReviewsCount = 0,
  currentUser,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Restore sidebar state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thuynga_admin_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("thuynga_admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* ── Sidebar (Desktop fixed + Mobile Drawer) ───────────────── */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        pendingReviewsCount={pendingReviewsCount}
        currentUser={currentUser}
      />

      {/* ── Main Workspace Area ────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col transition-[padding] duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Sticky Header */}
        <AdminHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onOpenMobile={() => setIsMobileOpen(true)}
          pendingOrdersCount={pendingOrdersCount}
          pendingReviewsCount={pendingReviewsCount}
          currentUser={currentUser}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
