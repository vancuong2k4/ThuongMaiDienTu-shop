"use client";

// ============================================================
// components/admin/customers/CustomerTable.tsx
// Bảng Danh Sách Khách Hàng Thông Minh (Optimistic UI & Safe Lock)
// ============================================================

import React, { useState } from "react";
import Image from "next/image";
import {
  Award,
  User,
  Phone,
  Mail,
  Copy,
  Check,
  Eye,
  Calendar,
  ShoppingBag,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { CustomerListItem } from "./types";

interface CustomerTableProps {
  customers: CustomerListItem[];
  currentUserId?: string;
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onToggleActive: (id: string, currentState: boolean) => Promise<void>;
  onViewDetail: (customer: CustomerListItem) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  currentUserId,
  loading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onToggleActive,
  onViewDetail,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const handleToggle = async (customer: CustomerListItem) => {
    if (customer.id === currentUserId) {
      alert("Bạn không thể tự khóa tài khoản quản trị viên của chính mình.");
      return;
    }
    try {
      setTogglingId(customer.id);
      await onToggleActive(customer.id, customer.isActive);
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Generate initials for avatar fallback
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4">Khách Hàng</th>
              <th className="py-3.5 px-4">Số Điện Thoại</th>
              <th className="py-3.5 px-4 text-center">Phân Hạng</th>
              <th className="py-3.5 px-4">Đơn Hàng & Chi Tiêu</th>
              <th className="py-3.5 px-4">Hoạt Động</th>
              <th className="py-3.5 px-4 text-center">Trạng Thái</th>
              <th className="py-3.5 px-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#800028]" />
                    <span className="text-xs font-medium">Đang tải danh sách khách hàng...</span>
                  </div>
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <AlertTriangle className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">Không tìm thấy khách hàng nào</p>
                    <p className="text-xs text-slate-400">Thử thay đổi từ khóa hoặc điều kiện lọc</p>
                  </div>
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const isCurrent = customer.id === currentUserId;
                const isToggling = togglingId === customer.id;
                const isCopied = copiedId === customer.id;

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* 1. Khách Hàng (Avatar, Tên, Email) */}
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {customer.avatar ? (
                          <Image
                            src={customer.avatar}
                            alt={customer.name || customer.email}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[#800028] font-bold text-xs flex items-center justify-center border border-slate-200/80 shrink-0">
                            {getInitials(customer.name, customer.email)}
                          </div>
                        )}

                        <div className="min-w-0 max-w-[220px]">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-800 text-sm truncate">
                              {customer.name || "Khách hàng"}
                            </span>
                            {customer.role === "ADMIN" && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-700 border border-purple-200">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                ADMIN
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                Bạn
                              </span>
                            )}
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{customer.email}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(customer.email, customer.id)}
                              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                              title="Sao chép email"
                            >
                              {isCopied ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Số Điện Thoại */}
                    <td className="py-4 px-4 align-middle">
                      {customer.phone ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a
                            href={`tel:${customer.phone}`}
                            className="hover:text-[#800028] hover:underline"
                          >
                            {customer.phone}
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Chưa cập nhật</span>
                      )}
                    </td>

                    {/* 3. Phân Hạng */}
                    <td className="py-4 px-4 align-middle text-center">
                      {customer.tier === "VIP" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          Khách VIP
                        </span>
                      ) : customer.tier === "REGULAR" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <User className="w-3 h-3" />
                          Khách Quen
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                          Khách Mới
                        </span>
                      )}
                    </td>

                    {/* 4. Đơn Hàng & Chi Tiêu */}
                    <td className="py-4 px-4 align-middle">
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <ShoppingBag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{customer.totalOrders} đơn</span>
                        </div>
                        <p className="text-slate-500 font-medium">
                          Tổng chi:{" "}
                          <span className="font-bold text-[#800028]">
                            {customer.totalSpent.toLocaleString("vi-VN")}₫
                          </span>
                        </p>
                      </div>
                    </td>

                    {/* 5. Hoạt Động (Đơn gần nhất, ngày tạo) */}
                    <td className="py-4 px-4 align-middle">
                      <div className="space-y-0.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Tham gia: {formatDate(customer.createdAt)}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Đơn gần nhất:{" "}
                          {customer.lastOrderAt ? (
                            <span className="text-slate-600 font-medium">
                              {formatDate(customer.lastOrderAt)}
                            </span>
                          ) : (
                            <span className="italic">Chưa mua hàng</span>
                          )}
                        </p>
                      </div>
                    </td>

                    {/* 6. Trạng Thái Hoạt Động (Toggle Switch) */}
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={isToggling || isCurrent}
                          onClick={() => handleToggle(customer)}
                          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#800028]/20 ${
                            customer.isActive ? "bg-[#800028]" : "bg-slate-200"
                          } ${
                            isToggling || isCurrent
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          title={
                            isCurrent
                              ? "Không thể khóa tài khoản của chính mình"
                              : customer.isActive
                              ? "Bấm để khóa tài khoản này"
                              : "Bấm để mở khóa tài khoản"
                          }
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              customer.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {customer.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </div>
                    </td>

                    {/* 7. Thao Tác */}
                    <td className="py-4 px-4 align-middle text-right">
                      <button
                        type="button"
                        onClick={() => onViewDetail(customer)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hồ sơ</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && customers.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          <p>
            Hiển thị trang <span className="font-bold text-slate-700">{page}</span> /{" "}
            <span className="font-bold text-slate-700">{totalPages}</span> (Tổng{" "}
            <span className="font-bold text-slate-700">{totalItems}</span> khách hàng)
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>
            <div className="px-2 py-1 font-bold text-slate-700">{page}</div>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold"
            >
              <span>Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
