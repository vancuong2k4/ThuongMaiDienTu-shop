"use client";

// ============================================================
// components/admin/orders/OrderTable.tsx
// Bảng Danh Sách Đơn Hàng & Thao Tác Nhanh Admin CMS
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  ShoppingBag,
  Eye,
  Printer,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export interface OrderItemSummary {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  note: string | null;
  adminNote: string | null;
  transferCode: string | null;
  paidAt: Date | string | null;
  createdAt: Date | string;
  itemCount: number;
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

interface OrderTableProps {
  orders: OrderItemSummary[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  page,
  totalPages,
  total,
  limit,
}) => {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Xử lý đổi trạng thái nhanh trực tiếp trên bảng
  const handleQuickStatusChange = async (
    orderId: string,
    orderNumber: string,
    newStatus: OrderStatus
  ) => {
    if (newStatus === "CANCELLED") {
      const confirmCancel = confirm(
        `Bạn có chắc chắn muốn HỦY đơn hàng ${orderNumber}?\nToàn bộ sản phẩm trong đơn sẽ được tự động hoàn trả số lượng vào kho hàng.`
      );
      if (!confirmCancel) return;
    }

    setUpdatingId(orderId);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: `Admin đổi trạng thái nhanh sang ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể cập nhật trạng thái đơn hàng");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Phân trang
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(newPage));
    router.push(url.pathname + url.search);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">
          Không tìm thấy đơn hàng nào
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Thử thay đổi từ khóa tìm kiếm hoặc chọn tab trạng thái khác.
        </p>
      </div>
    );
  }

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-4">Mã đơn & Thời gian</th>
                <th className="py-3 px-3">Khách hàng & Giao tới</th>
                <th className="py-3 px-3">Thanh toán</th>
                <th className="py-3 px-3 text-right">Tổng thanh toán</th>
                <th className="py-3 px-3 text-center">Trạng thái đơn</th>
                <th className="py-3 px-3 text-center">Cập nhật nhanh</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {orders.map((order) => {
                const isUpdating = updatingId === order.id;

                // Trích xuất địa chỉ tóm tắt
                let displayAddress = order.shippingAddress;
                try {
                  const parsed = JSON.parse(order.shippingAddress);
                  displayAddress = `${parsed.ward || ""}, ${parsed.district || ""}, ${parsed.province || ""}`;
                } catch {
                  // Text format
                }

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* 1. Mã đơn & Thời gian */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/admin/don-hang/${order.orderNumber}`}
                        className="font-mono font-bold text-slate-900 group-hover:text-wine-800 transition-colors text-sm"
                      >
                        {order.orderNumber}
                      </Link>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(order.createdAt)}</span>
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                        {order.itemCount} sản phẩm
                      </span>
                    </td>

                    {/* 2. Khách hàng & Địa chỉ */}
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800 text-sm">
                        {order.recipientName}
                      </p>
                      <p className="text-[11px] font-mono text-slate-600 mt-0.5">
                        {order.recipientPhone}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5" title={displayAddress}>
                        {displayAddress}
                      </p>
                    </td>

                    {/* 3. Phương thức & Trạng thái thanh toán */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          {order.paymentMethod === "VIETQR"
                            ? "VietQR Napas 24/7"
                            : "Tiền mặt (COD)"}
                        </span>
                        <AdminBadge
                          type="payment"
                          status={order.paymentStatus}
                          className="text-[10px] py-0.5 px-2"
                        />
                      </div>
                    </td>

                    {/* 4. Tổng tiền */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-extrabold text-slate-900 text-sm block">
                        {formatCurrency(order.total)}
                      </span>
                      {order.discountAmount > 0 && (
                        <span className="text-[10px] text-emerald-600 block">
                          Đã giảm {formatCurrency(order.discountAmount)}
                        </span>
                      )}
                    </td>

                    {/* 5. Trạng thái đơn hàng */}
                    <td className="py-3.5 px-3 text-center">
                      <AdminBadge type="order" status={order.orderStatus} />
                    </td>

                    {/* 6. Dropdown Đổi trạng thái nhanh */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        {isUpdating ? (
                          <Loader2 className="w-4 h-4 animate-spin text-wine-800" />
                        ) : (
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleQuickStatusChange(
                                order.id,
                                order.orderNumber,
                                e.target.value as OrderStatus
                              )
                            }
                            disabled={order.orderStatus === "CANCELLED" || order.orderStatus === "DELIVERED"}
                            className="py-1 px-2 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 bg-white hover:border-wine-800 disabled:opacity-40 disabled:bg-slate-50 cursor-pointer"
                          >
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="PROCESSING">Đang đóng gói</option>
                            <option value="SHIPPING">Đang giao</option>
                            <option value="DELIVERED">Đã giao</option>
                            <option value="CANCELLED">Hủy đơn</option>
                          </select>
                        )}
                      </div>
                    </td>

                    {/* 7. Thao tác */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Xem chi tiết */}
                        <Link
                          href={`/admin/don-hang/${order.orderNumber}`}
                          title="Xem chi tiết đơn hàng"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-wine-800 hover:bg-wine-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* In phiếu đóng gói */}
                        <Link
                          href={`/admin/don-hang/${order.orderNumber}?print=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="In phiếu đóng gói gửi hàng"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Phân Trang ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 px-2 text-xs text-slate-500">
        <div>
          Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trong tổng số{" "}
          <strong>{total}</strong> đơn hàng
        </div>

        <div className="flex items-center gap-1 self-center sm:self-auto">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400">
                  ...
                </span>
              );
            }
            const isCurrent = p === page;
            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => handlePageChange(Number(p))}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors ${
                  isCurrent
                    ? "bg-wine-800 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
