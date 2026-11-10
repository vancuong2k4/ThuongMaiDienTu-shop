"use client";

// ============================================================
// components/storefront/notifications/NotificationHubClient.tsx
// Trung Tâm Quản Lý Thông Báo Đầy Đủ Cho Khách Hàng (Stage 11.4)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Package,
  Tag,
  Crown,
  CheckCheck,
  Check,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
} from "lucide-react";
import type { NotificationType } from "@prisma/client";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  link: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

interface NotificationHubClientProps {
  initialNotifications: NotificationItem[];
  initialUnreadCount: number;
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const NotificationHubClient: React.FC<NotificationHubClientProps> = ({
  initialNotifications,
  initialUnreadCount,
  initialPagination,
}) => {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);

  const [activeType, setActiveType] = useState<string>("ALL");
  const [readFilter, setReadFilter] = useState<string>("ALL");

  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [totalPages, setTotalPages] = useState(initialPagination.totalPages);
  const [totalItems, setTotalItems] = useState(initialPagination.total);
  const [isLoading, setIsLoading] = useState(false);

  // Tải danh sách thông báo theo bộ lọc
  const fetchNotifications = useCallback(
    async (pageToLoad: number) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          limit: "10",
        });

        if (activeType !== "ALL") params.append("type", activeType);
        if (readFilter !== "ALL") params.append("isRead", readFilter);

        const res = await fetch(`/api/notifications?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
          setCurrentPage(data.pagination.page);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.total);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông báo:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [activeType, readFilter]
  );

  useEffect(() => {
    fetchNotifications(1);
  }, [fetchNotifications]);

  // Đánh dấu 1 thông báo đã đọc
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(data.remainingUnread);
      }
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", err);
    }
  };

  // Xóa 1 thông báo
  const handleDeleteNotification = async (id: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thông báo này?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setTotalItems((t) => Math.max(0, t - 1));
      }
    } catch (err) {
      console.error("Lỗi khi xóa thông báo:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getTypeConfig = (type: NotificationType) => {
    switch (type) {
      case "ORDER_STATUS":
        return {
          label: "Đơn Hàng",
          icon: Package,
          badge: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "PROMOTION":
        return {
          label: "Ưu Đãi & Deal",
          icon: Tag,
          badge: "bg-rose-50 text-[#800028] border-rose-200",
        };
      case "LOYALTY_TIER":
        return {
          label: "Hội Viên VIP",
          icon: Crown,
          badge: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "SYSTEM":
      default:
        return {
          label: "Hệ Thống",
          icon: Bell,
          badge: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  const typeTabs = [
    { id: "ALL", label: "Tất cả thông báo" },
    { id: "ORDER_STATUS", label: "📦 Đơn hàng" },
    { id: "PROMOTION", label: "⚡ Khuyến mãi & Flash Sale" },
    { id: "LOYALTY_TIER", label: "👑 THUYNGA Club & VIP" },
    { id: "SYSTEM", label: "🛡️ Hệ thống" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#800028] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Trung Tâm Thông Báo
                </h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#800028] text-xs font-bold border border-rose-200">
                    {unreadCount} chưa đọc
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật đơn hàng, chương trình giờ vàng và đặc quyền hội viên
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-sm shadow-[#800028]/20 shrink-0 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>
        )}
      </div>

      {/* Tabs & Bộ lọc trạng thái đọc */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-xs space-y-3">
        {/* Hàng 1: Tabs phân loại */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {typeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeType === tab.id
                  ? "bg-[#800028] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Hàng 2: Lọc trạng thái đọc */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Trạng thái:</span>
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-hidden focus:border-[#800028]"
            >
              <option value="ALL">Tất cả thông báo</option>
              <option value="UNREAD">Chỉ tin chưa đọc</option>
              <option value="READ">Đã đọc</option>
            </select>
          </div>

          <span className="text-slate-400 text-[11px]">
            Tổng: <strong className="text-slate-700 font-bold">{totalItems}</strong> thông báo
          </span>
        </div>
      </div>

      {/* Danh sách thông báo */}
      {isLoading ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center shadow-xs">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#800028]" />
          <p className="mt-3 text-xs text-slate-500 font-medium">
            Đang tải thông báo của bạn...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-800">
            Không có thông báo nào trong mục này
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Bạn đã xem hết các thông báo hoặc không có thông tin mới phù hợp với bộ lọc.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const config = getTypeConfig(notif.type);
            const Icon = config.icon;

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all hover:shadow-md flex flex-col sm:flex-row items-start justify-between gap-4 ${
                  !notif.isRead
                    ? "border-rose-200/90 bg-rose-50/20 ring-1 ring-rose-200/50"
                    : "border-neutral-200/80"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Icon loại */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border mt-0.5 ${config.badge}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    {/* Badge loại & Thời gian */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.badge}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {formatDate(notif.createdAt)}
                      </span>
                      {!notif.isRead && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#800028] text-white">
                          Mới
                        </span>
                      )}
                    </div>

                    {/* Tiêu đề */}
                    <h3
                      className={`text-sm ${
                        !notif.isRead
                          ? "font-black text-slate-900"
                          : "font-bold text-slate-800"
                      }`}
                    >
                      {notif.title}
                    </h3>

                    {/* Nội dung */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>

                {/* Thao tác nút bấm bên phải */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                  {!notif.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Đánh dấu đã đọc"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã đọc</span>
                    </button>
                  )}

                  {notif.link && (
                    <Link
                      href={notif.link}
                      onClick={() => {
                        if (!notif.isRead) handleMarkAsRead(notif.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#800028] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Xem chi tiết</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(notif.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-neutral-200/90 shadow-xs">
          <p className="text-xs text-slate-500">
            Trang <span className="font-bold">{currentPage}</span> /{" "}
            <span className="font-bold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => fetchNotifications(currentPage - 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-800">
              {currentPage}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => fetchNotifications(currentPage + 1)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
