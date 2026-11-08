"use client";

// ============================================================
// components/admin/orders/OrderDetailView.tsx
// Giao Diện Chi Tiết Đơn Hàng & Thao Tác Quản Trị CMS
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";
import {
  ShoppingBag,
  ArrowLeft,
  Printer,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  AlertTriangle,
  User,
  MapPin,
  CreditCard,
  Tag,
  Check,
  Save,
  Loader2,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";

export interface OrderDetailData {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  note: string | null;
  adminNote: string | null;
  transferCode: string | null;
  paidAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  } | null;
  voucher?: {
    id: string;
    code: string;
    type: string;
    value: any;
  } | null;
  items: Array<{
    id: string;
    productName: string;
    variantName: string;
    sku: string;
    price: number;
    quantity: number;
    image: string | null;
    variant?: {
      id: string;
      sku: string;
      stock: number;
      weight: number | null;
    } | null;
  }>;
  statusHistory: Array<{
    id: string;
    status: OrderStatus;
    note: string | null;
    createdAt: Date | string;
  }>;
}

interface OrderDetailViewProps {
  order: OrderDetailData;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  const router = useRouter();

  // State đổi trạng thái đơn
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.orderStatus);
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // State cập nhật thanh toán
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  // State ghi chú nội bộ
  const [adminNote, setAdminNote] = useState(order.adminNote || "");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedMessage, setNoteSavedMessage] = useState(false);

  // Parse shipping address
  let parsedAddress: {
    addressDetail?: string;
    ward?: string;
    district?: string;
    province?: string;
  } = {};
  try {
    parsedAddress = JSON.parse(order.shippingAddress);
  } catch {
    // raw text
  }

  // ── Xử lý Cập nhật Trạng thái Đơn hàng ─────────────────────
  const handleUpdateStatus = async () => {
    if (selectedStatus === order.orderStatus) return;

    if (selectedStatus === "CANCELLED") {
      const confirmCancel = confirm(
        `Xác nhận HỦY đơn hàng ${order.orderNumber}?\nSố lượng sản phẩm trong đơn sẽ được tự động hoàn trả vào kho hàng.`
      );
      if (!confirmCancel) return;
    }

    setIsUpdatingStatus(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể cập nhật trạng thái đơn hàng");
      }

      setStatusNote("");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // ── Xử lý Đánh dấu Đã thanh toán (PAID) ─────────────────────
  const handleMarkAsPaid = async () => {
    const confirmPay = confirm(
      `Xác nhận đơn hàng ${order.orderNumber} ĐÃ THANH TOÁN thành công?`
    );
    if (!confirmPay) return;

    setIsUpdatingPayment(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "PAID",
          paidAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể cập nhật trạng thái thanh toán");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // ── Xử lý Lưu Ghi Chú Nội Bộ ──────────────────────────────
  const handleSaveAdminNote = async () => {
    setIsSavingNote(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/note`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNote: adminNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu ghi chú");
      }

      setNoteSavedMessage(true);
      setTimeout(() => setNoteSavedMessage(false), 2000);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setIsSavingNote(false);
    }
  };

  // Các bước tiến trình 5 giai đoạn
  const timelineSteps: Array<{
    status: OrderStatus;
    label: string;
    icon: React.ElementType;
  }> = [
    { status: "PENDING", label: "Chờ xác nhận", icon: Clock },
    { status: "CONFIRMED", label: "Đã xác nhận", icon: CheckCircle2 },
    { status: "PROCESSING", label: "Đang đóng gói", icon: Package },
    { status: "SHIPPING", label: "Đang giao hàng", icon: Truck },
    { status: "DELIVERED", label: "Đã giao thành công", icon: CheckCircle2 },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "SHIPPING":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return -1;
    }
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  return (
    <div className="space-y-6">
      {/* ── Thanh Điều Hướng Trên Cùng ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/don-hang"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-wine-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách đơn hàng</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            href={`/admin/don-hang/${order.orderNumber}/in`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In Phiếu Đóng Gói (Packing Slip)</span>
          </Link>
        </div>
      </div>

      {/* ── Khối Timeline Tiến Trình ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        {order.orderStatus === "CANCELLED" ? (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Đơn hàng này đã bị HỦY</h4>
              <p className="text-xs text-rose-700 mt-0.5">
                Toàn bộ số lượng sản phẩm trong đơn đã được tự động hoàn trả về kho hàng.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Tiến Trình Xử Lý Đơn Hàng
              </span>
              <AdminBadge type="order" status={order.orderStatus} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {timelineSteps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                const Icon = step.icon;

                return (
                  <div
                    key={step.status}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? "border-wine-800 bg-wine-50/50 shadow-xs"
                        : isPassed
                        ? "border-emerald-200 bg-emerald-50/30 text-emerald-900"
                        : "border-slate-100 bg-slate-50/50 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isCurrent
                            ? "bg-wine-800 text-white"
                            : isPassed
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {isPassed && !isCurrent ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p
                      className={`text-xs font-bold truncate ${
                        isCurrent ? "text-wine-800" : isPassed ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Khu Vực Chính 2 Cột ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── CỘT TRÁI (2 CỘT): Danh Sách Sản Phẩm & Tổng Tiền ──── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Danh Sách Sản Phẩm */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-wine-800" />
                <span>Sản Phẩm Trong Đơn ({order.items.length})</span>
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {item.productName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Phân loại: <span className="font-semibold text-slate-700">{item.variantName}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">
                          SKU: {item.sku}
                        </span>
                        {item.variant && (
                          <span>(Tồn kho hiện tại: {item.variant.stock})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng Kết Tài Chính */}
            <div className="p-5 bg-slate-50/70 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính hàng hóa:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Phí vận chuyển giao tận nơi:</span>
                <span className="font-semibold text-slate-800">
                  {order.shippingFee > 0 ? formatCurrency(order.shippingFee) : "Miễn phí"}
                </span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>
                    Giảm giá voucher ({order.voucher?.code || "Khuyến mãi"}):
                  </span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-slate-900">Tổng tiền thanh toán:</span>
                <span className="text-lg font-black text-wine-800">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Lịch Sử Chuyển Trạng Thái */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-wine-800" />
              <span>Nhật Ký Tiến Trình Vận Đơn</span>
            </h3>

            {order.statusHistory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                Chưa có ghi chép nhật ký nào.
              </p>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {order.statusHistory.map((hist) => (
                  <div key={hist.id} className="relative">
                    <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-wine-800 ring-4 ring-white" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <AdminBadge type="order" status={hist.status} className="text-[10px] py-0 px-2" />
                      <span className="text-xs text-slate-400 font-mono">
                        {formatDateTime(hist.createdAt)}
                      </span>
                    </div>
                    {hist.note && (
                      <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {hist.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CỘT PHẢI (1 CỘT): Thao Tác Quản Trị & Thông Tin Khách ── */}
        <div className="space-y-6">
          {/* Thao Tác Chuyển Trạng Thái */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Thao Tác Quản Trị
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cập nhật trạng thái đơn
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="PROCESSING">Đang đóng gói</option>
                <option value="SHIPPING">Đang giao hàng</option>
                <option value="DELIVERED">Đã giao thành công</option>
                <option value="CANCELLED">Hủy đơn hàng (Hoàn kho)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú tiến trình (Tùy chọn)
              </label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Ví dụ: Đã đóng gói xong, giao cho Viettel Post..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
              />
            </div>

            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={isUpdatingStatus || selectedStatus === order.orderStatus}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-wine-800 hover:bg-wine-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isUpdatingStatus ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Cập Nhật Tiến Trình</span>
            </button>

            {/* Nút Xác nhận thanh toán nhanh */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Thanh toán:</span>
                <AdminBadge type="payment" status={order.paymentStatus} />
              </div>

              {order.paymentStatus !== "PAID" && (
                <button
                  type="button"
                  onClick={handleMarkAsPaid}
                  disabled={isUpdatingPayment}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isUpdatingPayment ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CreditCard className="w-3.5 h-3.5" />
                  )}
                  <span>Xác Nhận Đã Thanh Toán (PAID)</span>
                </button>
              )}

              {order.paidAt && (
                <p className="text-[11px] text-slate-400 font-mono text-center">
                  Đã thanh toán lúc: {formatDateTime(order.paidAt)}
                </p>
              )}
            </div>
          </div>

          {/* Thông Tin Khách Hàng & Giao Hàng */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-wine-800" />
              <span>Người Nhận & Giao Hàng</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Họ tên:</span>
                <span className="font-bold text-slate-900 text-sm block">
                  {order.recipientName}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                <a
                  href={`tel:${order.recipientPhone}`}
                  className="font-mono font-bold text-wine-800 hover:underline block"
                >
                  {order.recipientPhone}
                </a>
              </div>

              {order.user && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Tài khoản đặt mua:</span>
                  <span className="text-slate-700 block font-medium">
                    {order.user.email}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px] mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Địa chỉ giao hàng:</span>
                </span>
                <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  {parsedAddress.addressDetail
                    ? `${parsedAddress.addressDetail}, ${parsedAddress.ward || ""}, ${parsedAddress.district || ""}, ${parsedAddress.province || ""}`
                    : order.shippingAddress}
                </p>
              </div>

              {order.note && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px] mb-1">
                    Lời nhắn từ khách:
                  </span>
                  <p className="text-slate-700 italic bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                    &ldquo;{order.note}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ghi Chú Nội Bộ (Admin Note) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-wine-800" />
              <span>Ghi Chú Nội Bộ</span>
            </h3>

            <p className="text-[11px] text-slate-400">
              Chỉ nhân viên quản trị nhìn thấy (khách hàng không thấy).
            </p>

            <textarea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Nhập ghi chú giao dịch, lời dặn shipper, thông tin đối soát..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
            />

            <div className="flex items-center justify-between">
              {noteSavedMessage ? (
                <span className="text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã lưu!</span>
                </span>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleSaveAdminNote}
                disabled={isSavingNote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isSavingNote ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                <span>Lưu ghi chú</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
