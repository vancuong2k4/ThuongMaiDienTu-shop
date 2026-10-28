"use client";

// ============================================================
// components/admin/dashboard/RecentOrdersTable.tsx
// Bảng Đơn Hàng Mới Nhất Trên Dashboard Admin CMS
// ============================================================

import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { OrderStatus } from "@prisma/client";
import { Eye, Clock, ShoppingBag } from "lucide-react";

interface RecentOrder {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  createdAt: Date;
  itemCount: number;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
}) => {
  if (orders.length === 0) {
    return (
      <div className="py-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Chưa có đơn hàng nào</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Đơn hàng mới từ khách hàng sẽ xuất hiện trực tiếp tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/60">
            <th className="py-2.5 px-3">Mã đơn</th>
            <th className="py-2.5 px-3">Khách hàng</th>
            <th className="py-2.5 px-3">Thanh toán</th>
            <th className="py-2.5 px-3 text-right">Tổng tiền</th>
            <th className="py-2.5 px-3 text-center">Trạng thái đơn</th>
            <th className="py-2.5 px-3 text-right">Thời gian</th>
            <th className="py-2.5 px-3 text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString(
              "vi-VN",
              {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              }
            );

            return (
              <tr
                key={order.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Order Number */}
                <td className="py-3 px-3">
                  <span className="font-mono font-bold text-slate-900 group-hover:text-wine-800 transition-colors">
                    {order.orderNumber}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {order.itemCount} sản phẩm
                  </div>
                </td>

                {/* Customer */}
                <td className="py-3 px-3">
                  <p className="font-bold text-slate-800">
                    {order.recipientName}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {order.recipientPhone}
                  </p>
                </td>

                {/* Payment Method & Status */}
                <td className="py-3 px-3">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-[11px] font-semibold text-slate-700">
                      {order.paymentMethod === "VIETQR"
                        ? "VietQR Napas 24/7"
                        : "Tiền mặt (COD)"}
                    </span>
                    <AdminBadge
                      type="payment"
                      status={order.paymentStatus}
                      className="text-[10px] py-0.5 px-1.5"
                    />
                  </div>
                </td>

                {/* Total */}
                <td className="py-3 px-3 text-right">
                  <span className="font-extrabold text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </td>

                {/* Order Status */}
                <td className="py-3 px-3 text-center">
                  <AdminBadge type="order" status={order.orderStatus} />
                </td>

                {/* Time */}
                <td className="py-3 px-3 text-right text-slate-500 font-medium">
                  <div className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>
                </td>

                {/* Action */}
                <td className="py-3 px-3 text-center">
                  <Link
                    href={`/admin/don-hang?search=${encodeURIComponent(
                      order.orderNumber
                    )}`}
                    title="Xem chi tiết đơn hàng"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-wine-800 hover:bg-wine-50 inline-flex transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
