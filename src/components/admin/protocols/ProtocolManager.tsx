"use client";

// ============================================================
// components/admin/protocols/ProtocolManager.tsx
// Trung Tâm Quản Trị Phác Đồ Dinh Dưỡng & Tư Vấn Dược Sĩ (Phase 16)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { ProtocolStats } from "./ProtocolStats";
import { ProtocolFilters } from "./ProtocolFilters";
import { ProtocolTable } from "./ProtocolTable";
import { ConsultationTable } from "./ConsultationTable";
import { CreateProtocolModal } from "./CreateProtocolModal";
import { ConsultationNoteModal } from "./ConsultationNoteModal";
import {
  HealthProtocolItem,
  ConsultationBookingItem,
  ProtocolKPIs,
} from "./types";
import { ConsultationStatus } from "@prisma/client";

interface ProtocolManagerProps {
  initialKpis: ProtocolKPIs;
  initialProtocols: HealthProtocolItem[];
  initialBookings: ConsultationBookingItem[];
}

export const ProtocolManager: React.FC<ProtocolManagerProps> = ({
  initialKpis,
  initialProtocols,
  initialBookings,
}) => {
  const [kpis, setKpis] = useState<ProtocolKPIs>(initialKpis);
  const [activeTab, setActiveTab] = useState<"protocols" | "consultations">(
    "protocols"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [targetGroupFilter, setTargetGroupFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [protocols, setProtocols] = useState<HealthProtocolItem[]>(initialProtocols);
  const [bookings, setBookings] = useState<ConsultationBookingItem[]>(initialBookings);

  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBookingForNotes, setSelectedBookingForNotes] =
    useState<ConsultationBookingItem | null>(null);

  // Fetch Protocols
  const fetchProtocols = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (targetGroupFilter !== "ALL") params.append("targetGroup", targetGroupFilter);
      if (statusFilter !== "ALL") params.append("isActive", statusFilter);

      const res = await fetch(`/api/admin/protocols?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProtocols(data.data);
        if (data.kpis) setKpis(data.kpis);
      }
    } catch (err) {
      console.error("fetchProtocols error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, targetGroupFilter, statusFilter]);

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/consultations?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error("fetchBookings error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (activeTab === "protocols") {
      fetchProtocols();
    } else {
      fetchBookings();
    }
  }, [activeTab, fetchProtocols, fetchBookings]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTargetGroupFilter("ALL");
    setStatusFilter("ALL");
  };

  // Bật/tắt lưu hành phác đồ
  const handleToggleProtocolActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/protocols/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        setProtocols((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !current } : p))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Không thể cập nhật trạng thái");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi");
    }
  };

  // Xóa phác đồ
  const handleDeleteProtocol = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/protocols/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProtocols((prev) => prev.filter((p) => p.id !== id));
        fetchProtocols();
      } else {
        const data = await res.json();
        alert(data.error || "Không thể xóa phác đồ");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi");
    }
  };

  // Cập nhật trạng thái lịch hẹn tư vấn
  const handleUpdateBookingStatus = async (
    id: string,
    newStatus: ConsultationStatus
  ) => {
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        fetchProtocols(); // cập nhật lại kpis
      } else {
        const data = await res.json();
        alert(data.error || "Không thể cập nhật trạng thái cuộc gọi");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi");
    }
  };

  // Xóa lịch hẹn tư vấn
  const handleDeleteBooking = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Không thể xóa lịch hẹn");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi");
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 Thẻ Thống Kê KPI */}
      <ProtocolStats kpis={kpis} />

      {/* Thanh Bộ Lọc & Tab Switcher */}
      <ProtocolFilters
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setStatusFilter("ALL");
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        targetGroupFilter={targetGroupFilter}
        onTargetGroupChange={setTargetGroupFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Bảng Dữ Liệu Theo Tab */}
      {activeTab === "protocols" ? (
        <ProtocolTable
          protocols={protocols}
          loading={loading}
          onToggleActive={handleToggleProtocolActive}
          onDelete={handleDeleteProtocol}
        />
      ) : (
        <ConsultationTable
          bookings={bookings}
          loading={loading}
          onUpdateStatus={handleUpdateBookingStatus}
          onOpenNotes={(booking) => setSelectedBookingForNotes(booking)}
          onDelete={handleDeleteBooking}
        />
      )}

      {/* Modal Tạo Phác Đồ Mới */}
      <CreateProtocolModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          fetchProtocols();
        }}
      />

      {/* Modal Ghi Chú Dược Sĩ */}
      <ConsultationNoteModal
        booking={selectedBookingForNotes}
        isOpen={Boolean(selectedBookingForNotes)}
        onClose={() => setSelectedBookingForNotes(null)}
        onSaved={() => {
          fetchBookings();
        }}
      />
    </div>
  );
};
