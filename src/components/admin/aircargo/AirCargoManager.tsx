"use client";

// ============================================================
// components/admin/aircargo/AirCargoManager.tsx
// Trung Tâm Quản Trị Lô Hàng Bay Air & Minh Bạch HSD (Phase 15)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import { AirCargoStats } from "./AirCargoStats";
import { AirCargoFilters } from "./AirCargoFilters";
import { ShipmentTable } from "./ShipmentTable";
import { BatchTable } from "./BatchTable";
import { CreateShipmentModal } from "./CreateShipmentModal";
import { CreateBatchModal } from "./CreateBatchModal";
import { AirCargoShipmentItem, ProductBatchItem, AirCargoKPIs } from "./types";
import { ShipmentStatus } from "@prisma/client";

interface AirCargoManagerProps {
  initialKpis: AirCargoKPIs;
  initialShipments: AirCargoShipmentItem[];
  initialBatches: ProductBatchItem[];
}

export const AirCargoManager: React.FC<AirCargoManagerProps> = ({
  initialKpis,
  initialShipments,
  initialBatches,
}) => {
  const [kpis, setKpis] = useState<AirCargoKPIs>(initialKpis);
  const [activeTab, setActiveTab] = useState<"shipments" | "batches">("shipments");

  const [searchTerm, setSearchTerm] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [shipments, setShipments] = useState<AirCargoShipmentItem[]>(initialShipments);
  const [batches, setBatches] = useState<ProductBatchItem[]>(initialBatches);

  const [loading, setLoading] = useState(false);
  const [isCreateShipmentOpen, setIsCreateShipmentOpen] = useState(false);
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);

  // Fetch Shipments
  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (carrierFilter !== "ALL") params.append("carrier", carrierFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/admin/aircargo/shipments?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setShipments(data.data);
        if (data.kpis) setKpis(data.kpis);
      }
    } catch (err) {
      console.error("fetchShipments error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, carrierFilter, statusFilter]);

  // Fetch Batches
  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "ALL") params.append("isActive", statusFilter);

      const res = await fetch(`/api/admin/aircargo/batches?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setBatches(data.data);
      }
    } catch (err) {
      console.error("fetchBatches error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  // Refresh whenever filters change
  useEffect(() => {
    if (activeTab === "shipments") {
      fetchShipments();
    } else {
      fetchBatches();
    }
  }, [activeTab, fetchShipments, fetchBatches]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setCarrierFilter("ALL");
    setStatusFilter("ALL");
  };

  // Cập nhật trạng thái chuyến bay
  const handleUpdateShipmentStatus = async (
    id: string,
    newStatus: ShipmentStatus
  ) => {
    try {
      const res = await fetch(`/api/admin/aircargo/shipments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setShipments((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Không thể cập nhật trạng thái chuyến bay");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi cập nhật");
    }
  };

  // Xóa chuyến bay
  const handleDeleteShipment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/aircargo/shipments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setShipments((prev) => prev.filter((s) => s.id !== id));
        fetchShipments();
      } else {
        alert(data.error || "Không thể xóa chuyến bay");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xóa chuyến bay");
    }
  };

  // Bật/tắt lưu hành mã lô
  const handleToggleBatchActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/aircargo/batches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        setBatches((prev) =>
          prev.map((b) => (b.id === id ? { ...b, isActive: !currentActive } : b))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Không thể cập nhật trạng thái lưu hành mã lô");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi cập nhật");
    }
  };

  // Xóa mã lô
  const handleDeleteBatch = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/aircargo/batches/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setBatches((prev) => prev.filter((b) => b.id !== id));
        fetchBatches();
      } else {
        alert(data.error || "Không thể xóa mã lô");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xóa mã lô");
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 Thẻ Thống Kê KPI */}
      <AirCargoStats kpis={kpis} />

      {/* Thanh Lọc & Bộ Công Cụ */}
      <AirCargoFilters
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setStatusFilter("ALL");
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        carrierFilter={carrierFilter}
        onCarrierChange={setCarrierFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
        onOpenCreateModal={() => {
          if (activeTab === "shipments") {
            setIsCreateShipmentOpen(true);
          } else {
            setIsCreateBatchOpen(true);
          }
        }}
      />

      {/* Bảng Dữ Liệu Tương Ứng Với Tab */}
      {activeTab === "shipments" ? (
        <ShipmentTable
          shipments={shipments}
          loading={loading}
          onUpdateStatus={handleUpdateShipmentStatus}
          onDelete={handleDeleteShipment}
        />
      ) : (
        <BatchTable
          batches={batches}
          loading={loading}
          onToggleActive={handleToggleBatchActive}
          onDelete={handleDeleteBatch}
        />
      )}

      {/* Modal Thêm Mới Chuyến Bay */}
      <CreateShipmentModal
        isOpen={isCreateShipmentOpen}
        onClose={() => setIsCreateShipmentOpen(false)}
        onCreated={() => {
          fetchShipments();
        }}
      />

      {/* Modal Thêm Mới Mã Lô Sản Phẩm */}
      <CreateBatchModal
        isOpen={isCreateBatchOpen}
        onClose={() => setIsCreateBatchOpen(false)}
        shipments={shipments}
        onCreated={() => {
          fetchBatches();
        }}
      />
    </div>
  );
};
