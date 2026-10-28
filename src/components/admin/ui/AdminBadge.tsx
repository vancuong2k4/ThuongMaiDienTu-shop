// ============================================================
// components/admin/ui/AdminBadge.tsx
// Huy hiệu trạng thái chuẩn hóa cho hệ thống Admin CMS
// ============================================================

import React from "react";
import {
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Ban,
} from "lucide-react";

export type OrderStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatusType = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

interface AdminBadgeProps {
  type?: "order" | "payment" | "boolean" | "role";
  status?: string;
  label?: string;
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  type = "order",
  status,
  label,
  className = "",
}) => {
  // Trạng thái đơn hàng
  if (type === "order") {
    switch (status) {
      case "PENDING":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 ${className}`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{label || "Chờ xác nhận"}</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80 ${className}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{label || "Đã xác nhận"}</span>
          </span>
        );
      case "PROCESSING":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200/80 ${className}`}
          >
            <Package className="w-3.5 h-3.5 text-indigo-600" />
            <span>{label || "Đang đóng gói"}</span>
          </span>
        );
      case "SHIPPING":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200/80 ${className}`}
          >
            <Truck className="w-3.5 h-3.5 text-cyan-600" />
            <span>{label || "Đang giao hàng"}</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${className}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{label || "Đã giao thành công"}</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200/80 ${className}`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{label || "Đã hủy đơn"}</span>
          </span>
        );
      case "REFUNDED":
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200/80 ${className}`}
          >
            <RotateCcwIcon className="w-3.5 h-3.5 text-purple-600" />
            <span>{label || "Đã hoàn tiền"}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-700">
            {status}
          </span>
        );
    }
  }

  // Trạng thái thanh toán
  if (type === "payment") {
    switch (status) {
      case "PAID":
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{label || "Đã thanh toán"}</span>
          </span>
        );
      case "PENDING":
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}
          >
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{label || "Chờ thanh toán"}</span>
          </span>
        );
      case "FAILED":
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 ${className}`}
          >
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>{label || "Thất bại"}</span>
          </span>
        );
      case "REFUNDED":
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200 ${className}`}
          >
            <Ban className="w-3 h-3 text-purple-600" />
            <span>{label || "Đã hoàn tiền"}</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  }

  // Boolean (Active / Inactive)
  if (type === "boolean") {
    const isActive = status === "true" || status === "ACTIVE" || status === "true";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
        } ${className}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isActive ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"
          }`}
        />
        <span>{label || (isActive ? "Đang kinh doanh" : "Tạm ngưng")}</span>
      </span>
    );
  }

  // Vai trò
  if (type === "role") {
    const isAdmin = status === "ADMIN";
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
          isAdmin
            ? "bg-rose-100 text-[#800028] border border-rose-200"
            : "bg-neutral-100 text-neutral-700 border border-neutral-200"
        } ${className}`}
      >
        <ShieldCheck className="w-3 h-3" />
        <span>{label || (isAdmin ? "Quản trị viên" : "Khách hàng")}</span>
      </span>
    );
  }

  return <span>{label || status}</span>;
};

function RotateCcwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
