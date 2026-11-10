"use client";

// ============================================================
// components/storefront/notifications/NotificationBell.tsx
// Chuông Báo Đẩy Thời Gian Thực & Popover Thông Báo In-App (Stage 11.3)
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Bell,
  Package,
  Tag,
  Crown,
  CheckCheck,
  ChevronRight,
  Clock,
  ArrowRight,
  X,
  ExternalLink,
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

export const NotificationBell: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && !!session?.user;

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tải danh sách thông báo
  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/notifications?limit=8");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tải khi login và đặt lịch polling nhẹ 45s/lần
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 45000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Đánh dấu 1 thông báo là đã đọc
  const handleItemClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await fetch(`/api/notifications/${notif.id}/read`, {
          method: "PATCH",
        });
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notif.id ? { ...item, isRead: true } : item
          )
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error("Lỗi khi đánh dấu đã đọc:", err);
      }
    }

    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
      });
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", err);
    }
  };

  // Định dạng thời gian tương đối tiếng Việt
  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now.getTime() - past.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 60) return "Vừa xong";
      if (diffMin < 60) return `${diffMin} phút trước`;
      if (diffHour < 24) return `${diffHour} giờ trước`;
      if (diffDay < 7) return `${diffDay} ngày trước`;
      return past.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "ORDER_STATUS":
        return {
          icon: Package,
          bg: "bg-blue-50 text-blue-600 border-blue-200",
        };
      case "PROMOTION":
        return {
          icon: Tag,
          bg: "bg-rose-50 text-[#800028] border-rose-200",
        };
      case "LOYALTY_TIER":
        return {
          icon: Crown,
          bg: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "SYSTEM":
      default:
        return {
          icon: Bell,
          bg: "bg-slate-100 text-slate-700 border-slate-200",
        };
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  const filteredNotifications =
    activeTab === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <div ref={dropdownRef} className="relative select-none">
      {/* Nút Chuông Icon */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2.5 rounded-xl hover:bg-white/10 text-white transition-colors duration-150 flex items-center justify-center group"
        aria-label="Thông báo"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5 text-white/90 group-hover:text-white transition-transform duration-200 group-hover:scale-105" />

        {/* Badge số lượng chưa đọc */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-amber-400 text-[#800028] font-black text-[10px] shadow-sm animate-in zoom-in">
            {unreadCount > 9 ? "9+" : unreadCount}
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75 animate-ping -z-10" />
          </span>
        )}
      </button>

      {/* Popover Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in-0 zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
          {/* Header Popover */}
          <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-slate-800">Thông Báo</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#800028] border border-rose-200 text-[10px] font-bold">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800028] hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đọc tất cả</span>
              </button>
            )}
          </div>

          {/* Tabs phân loại nhanh */}
          <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: "ALL", label: "Tất cả" },
              { id: "ORDER_STATUS", label: "Đơn hàng" },
              { id: "PROMOTION", label: "Ưu đãi" },
              { id: "LOYALTY_TIER", label: "Hội viên" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#800028] text-white shadow-xs"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Danh sách thông báo */}
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1 max-h-80">
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-[#800028]" />
                <p className="mt-2 text-xs text-slate-400">Đang tải...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="mt-3 text-xs font-bold text-slate-700">
                  Không có thông báo mới
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Bạn đã cập nhật tất cả thông tin mới nhất từ THUYNGA Shop.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const config = getTypeIcon(notif.type);
                const Icon = config.icon;

                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => handleItemClick(notif)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-50 relative ${
                      !notif.isRead ? "bg-rose-50/30" : ""
                    }`}
                  >
                    {/* Icon loại thông báo */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${config.bg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-start justify-between gap-1">
                        <p
                          className={`text-xs leading-snug line-clamp-1 ${
                            !notif.isRead
                              ? "font-black text-slate-900"
                              : "font-semibold text-slate-700"
                          }`}
                        >
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#800028] shrink-0 mt-1" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(notif.createdAt)}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Popover: Xem tất cả */}
          <div className="pt-2 px-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/tai-khoan/thong-bao"
              onClick={() => setIsOpen(false)}
              className="w-full py-2 rounded-xl text-center text-xs font-bold text-[#800028] hover:bg-rose-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Xem tất cả thông báo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
