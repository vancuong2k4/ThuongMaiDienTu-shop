"use client";

// ============================================================
// components/admin/gift-boxes/GiftBoxManager.tsx
// Container Điều Phối Quản Lý Hộp Quà Biếu & Yêu Cầu B2B (Phase 17)
// ============================================================

import React, { useState } from "react";
import { AdminGiftBoxTemplate, AdminCorporateInquiry, CorporateGiftKPIs } from "./types";
import { GiftBoxStats } from "./GiftBoxStats";
import { GiftBoxFilters } from "./GiftBoxFilters";
import { CorporateInquiryTable } from "./CorporateInquiryTable";
import { GiftTemplateTable } from "./GiftTemplateTable";
import { CreateGiftTemplateModal } from "./CreateGiftTemplateModal";
import { InquiryQuoteModal } from "./InquiryQuoteModal";

interface GiftBoxManagerProps {
  initialStats: CorporateGiftKPIs;
  initialTemplates: AdminGiftBoxTemplate[];
  initialInquiries: AdminCorporateInquiry[];
}

export const GiftBoxManager: React.FC<GiftBoxManagerProps> = ({
  initialStats,
  initialTemplates,
  initialInquiries,
}) => {
  const [activeTab, setActiveTab] = useState<"inquiries" | "templates">("inquiries");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [stats, setStats] = useState<CorporateGiftKPIs>(initialStats);
  const [templates, setTemplates] = useState<AdminGiftBoxTemplate[]>(initialTemplates);
  const [inquiries, setInquiries] = useState<AdminCorporateInquiry[]>(initialInquiries);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
  const [selectedInquiryForQuote, setSelectedInquiryForQuote] =
    useState<AdminCorporateInquiry | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [resTpl, resInq] = await Promise.all([
        fetch("/api/admin/gift-boxes/templates"),
        fetch("/api/admin/gift-boxes/corporate-inquiries"),
      ]);

      const [dataTpl, dataInq] = await Promise.all([resTpl.json(), resInq.json()]);

      if (dataTpl.success) setTemplates(dataTpl.data);
      if (dataInq.success) setInquiries(dataInq.data);
    } catch (err) {
      console.error("Lỗi khi refresh dữ liệu quà biếu:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleTemplateActive = async (template: AdminGiftBoxTemplate) => {
    try {
      const updatedActive = !template.isActive;
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...t, isActive: updatedActive } : t))
      );

      await fetch(`/api/admin/gift-boxes/templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedActive }),
      });
    } catch (err) {
      console.error("Lỗi khi chuyển trạng thái mẫu vỏ hộp:", err);
      handleRefresh();
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mẫu vỏ hộp quà này?")) return;

    try {
      const res = await fetch(`/api/admin/gift-boxes/templates/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message || "Đã xử lý.");
      handleRefresh();
    } catch (err) {
      console.error("Lỗi khi xóa mẫu vỏ hộp:", err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu doanh nghiệp này?")) return;

    try {
      await fetch(`/api/admin/gift-boxes/corporate-inquiries/${id}`, {
        method: "DELETE",
      });
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa yêu cầu doanh nghiệp:", err);
    }
  };

  // Lọc inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus =
      statusFilter === "ALL" || inq.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      inq.inquiryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  // Lọc templates
  const filteredTemplates = templates.filter((tpl) => {
    return (
      searchTerm === "" ||
      tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tpl.description && tpl.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. 5 KPI Cards */}
      <GiftBoxStats stats={stats} />

      {/* 2. Filters & Tabs */}
      <GiftBoxFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onOpenCreateTemplateModal={() => setIsCreateTemplateModalOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 3. Tables */}
      {activeTab === "inquiries" ? (
        <CorporateInquiryTable
          inquiries={filteredInquiries}
          onOpenQuoteModal={(inq) => setSelectedInquiryForQuote(inq)}
          onDeleteInquiry={handleDeleteInquiry}
        />
      ) : (
        <GiftTemplateTable
          templates={filteredTemplates}
          onToggleActive={handleToggleTemplateActive}
          onDeleteTemplate={handleDeleteTemplate}
        />
      )}

      {/* Modals */}
      <CreateGiftTemplateModal
        isOpen={isCreateTemplateModalOpen}
        onClose={() => setIsCreateTemplateModalOpen(false)}
        onSuccess={handleRefresh}
      />

      <InquiryQuoteModal
        inquiry={selectedInquiryForQuote}
        onClose={() => setSelectedInquiryForQuote(null)}
        onSuccess={handleRefresh}
      />
    </div>
  );
};
