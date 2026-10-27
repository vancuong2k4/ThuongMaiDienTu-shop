// ============================================================
// components/storefront/account/OrderListClient.tsx
// Danh sách đơn hàng của người dùng với bộ lọc tabs trạng thái & nút thao tác
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import {
  Package,
  Calendar,
  CreditCard,
  QrCode,
  Truck,
  ChevronRight,
  RotateCcw,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export interface OrderItemSummary {
  id: string;
  variantId: string | null;
  productName: string;
  variantName: string;
  sku: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  paymentMethod: "COD" | "VIETQR";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED"
    | "REFUNDED";
  createdAt: string;
  items: OrderItemSummary[];
}

interface OrderListClientProps {
  initialOrders: UserOrder[];
}

type FilterTab = "ALL" | "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED";

export const OrderListClient: React.FC<OrderListClientProps> = ({ initialOrders }) => {
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrder[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [cancellingOrderNumber, setCancellingOrderNumber] = useState<string | null>(null);

  const addItemToCart = useCartStore((s) => s.addItem);

  // Lọc theo tabs
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PENDING") return order.orderStatus === "PENDING";
    if (activeTab === "PROCESSING")
      return order.orderStatus === "CONFIRMED" || order.orderStatus === "PROCESSING";
    if (activeTab === "SHIPPING") return order.orderStatus === "SHIPPING";
    if (activeTab === "DELIVERED") return order.orderStatus === "DELIVERED";
    if (activeTab === "CANCELLED")
      return order.orderStatus === "CANCELLED" || order.orderStatus === "REFUNDED";
    return true;
  });

  // Hủy đơn hàng
  const handleCancelOrder = async (orderNumber: string) => {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderNumber}?`)) return;

    setCancellingOrderNumber(orderNumber);
    try {
      const res = await fetch(`/api/user/orders/${orderNumber}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Khách hàng hủy trên website" }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Không thể hủy đơn hàng");
        return;
      }

      // Cập nhật trạng thái local
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber ? { ...o, orderStatus: "CANCELLED" } : o
        )
      );
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi hủy đơn hàng");
    } finally {
      setCancellingOrderNumber(null);
    }
  };

  // Mua lại (Thêm các món vào giỏ hàng và chuyển tới /gio-hang)
  const handleReorder = (order: UserOrder) => {
    order.items.forEach((it) => {
      if (it.variantId) {
        addItemToCart({
          variantId: it.variantId,
          productId: "",
          productName: it.productName,
          variantName: it.variantName,
          sku: it.sku,
          price: it.price,
          stock: 99, // fallback stock
          image: it.image,
          quantity: it.quantity,
        });
      }
    });
    router.push("/gio-hang");
  };

  // Helper Badge trạng thái
  const getStatusBadge = (status: UserOrder["orderStatus"]) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Chờ xác nhận
          </span>
        );
      case "CONFIRMED":
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Package className="w-3 h-3" /> Đang chuẩn bị hàng
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Truck className="w-3 h-3" /> Đang giao hàng
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Đã giao thành công
          </span>
        );
      case "CANCELLED":
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <XCircle className="w-3 h-3" /> Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
          Đơn hàng của tôi
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Theo dõi tiến trình xử lý và lịch sử mua sắm của bạn tại THUYNGA Shop.
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-1.5 flex gap-1 overflow-x-auto shadow-xs">
        {[
          { key: "ALL", label: `Tất cả (${orders.length})` },
          {
            key: "PENDING",
            label: `Chờ xác nhận (${orders.filter((o) => o.orderStatus === "PENDING").length})`,
          },
          {
            key: "PROCESSING",
            label: `Đang xử lý (${
              orders.filter((o) => o.orderStatus === "CONFIRMED" || o.orderStatus === "PROCESSING")
                .length
            })`,
          },
          {
            key: "SHIPPING",
            label: `Đang giao (${orders.filter((o) => o.orderStatus === "SHIPPING").length})`,
          },
          {
            key: "DELIVERED",
            label: `Đã giao (${orders.filter((o) => o.orderStatus === "DELIVERED").length})`,
          },
          {
            key: "CANCELLED",
            label: `Đã hủy (${
              orders.filter((o) => o.orderStatus === "CANCELLED" || o.orderStatus === "REFUNDED")
                .length
            })`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as FilterTab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? "bg-[#800028] text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-sm text-neutral-800">
            Không tìm thấy đơn hàng nào
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {activeTab === "ALL"
              ? "Bạn chưa có đơn hàng nào tại THUYNGA Shop. Hãy khám phá ngay các sản phẩm nhập khẩu chính ngạch nhé!"
              : "Không có đơn hàng nào ở trạng thái này."}
          </p>
          <div className="mt-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#800028] text-white text-xs font-bold hover:bg-[#60001e] transition-colors shadow-sm"
            >
              <span>Khám phá sản phẩm ngay</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const totalItemCount = order.items.reduce((s, it) => s + it.quantity, 0);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden hover:border-neutral-300 transition-all"
              >
                {/* Header card đơn hàng */}
                <div className="px-5 py-4 border-b border-neutral-100 bg-neutral-50/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-mono font-bold text-neutral-900 text-sm">
                      #{order.orderNumber}
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-neutral-500 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.orderStatus)}

                    {order.paymentStatus === "PAID" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Chưa thanh toán
                      </span>
                    )}
                  </div>
                </div>

                {/* Danh sách sản phẩm của đơn */}
                <div className="p-5 divide-y divide-neutral-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">
                          {item.productName}
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Phân loại: {item.variantName}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Số lượng: x{item.quantity}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer card đơn hàng: Tổng tiền & Nút thao tác */}
                <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-500">
                      Tổng cộng ({totalItemCount} món):
                    </span>
                    <span className="text-base font-black text-[#800028]">
                      {order.total.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      ({order.paymentMethod === "VIETQR" ? "VietQR 24/7" : "COD"})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Nút hủy đơn (chỉ hiện khi PENDING) */}
                    {order.orderStatus === "PENDING" && (
                      <button
                        onClick={() => handleCancelOrder(order.orderNumber)}
                        disabled={cancellingOrderNumber === order.orderNumber}
                        className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingOrderNumber === order.orderNumber
                          ? "Đang hủy..."
                          : "Hủy đơn hàng"}
                      </button>
                    )}

                    {/* Nút mua lại */}
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3 py-1.5 rounded-xl border border-[#800028] text-xs font-semibold text-[#800028] hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mua lại</span>
                    </button>

                    {/* Nút xem chi tiết */}
                    <Link
                      href={`/tai-khoan/don-hang/${order.orderNumber}`}
                      className="px-4 py-1.5 rounded-xl bg-[#800028] text-white text-xs font-bold hover:bg-[#60001e] transition-colors shadow-xs flex items-center gap-1"
                    >
                      <span>Chi tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
