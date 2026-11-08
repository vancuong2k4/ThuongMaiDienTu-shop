"use client";

// ============================================================
// components/admin/customers/CustomerDetailModal.tsx
// Modal Hồ Sơ Khách Hàng (Đơn Hàng, Sổ Địa Chỉ & Đánh Giá)
// ============================================================

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Star,
  ExternalLink,
  Award,
  Loader2,
  Calendar,
  CreditCard,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import type { CustomerListItem, CustomerDetailData } from "./types";

interface CustomerDetailModalProps {
  customer: CustomerListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const [detail, setDetail] = useState<CustomerDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "reviews">("orders");

  useEffect(() => {
    if (!isOpen || !customer) {
      setDetail(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/customers/${customer.id}`);
        const data = await res.json();
        if (data.success && data.customer) {
          setDetail(data.customer);
        }
      } catch (err) {
        console.error("Fetch customer detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    setActiveTab("orders");
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-[#800028] flex items-center justify-center font-bold text-sm border border-slate-200">
              <User className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-800">
                  {customer.name || "Khách hàng"}
                </h3>
                {customer.tier === "VIP" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-300">
                    <Award className="w-3 h-3 text-amber-600" />
                    Khách VIP
                  </span>
                ) : customer.tier === "REGULAR" ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Khách Quen
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    Khách Mới
                  </span>
                )}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    customer.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {customer.isActive ? "🟢 Hoạt động" : "🔴 Đang bị khóa"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {customer.email}
                </span>
                {customer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {customer.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Đăng ký: {formatDate(customer.createdAt)}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tổng Chi Tiêu (LTV)
              </p>
              <p className="mt-1 text-xl font-black text-[#800028]">
                {customer.totalSpent.toLocaleString("vi-VN")}₫
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Không tính các đơn bị hủy
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tổng Đơn Hàng Đã Đặt
              </p>
              <p className="mt-1 text-xl font-black text-slate-800">
                {customer.totalOrders} <span className="text-sm font-normal text-slate-500">đơn</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Lịch sử đặt hàng qua website
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Đánh Giá Sản Phẩm
              </p>
              <p className="mt-1 text-xl font-black text-amber-700">
                {customer.reviewCount} <span className="text-sm font-normal text-slate-500">lượt</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Phản hồi & nhận xét thực tế
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "orders"
                  ? "border-[#800028] text-[#800028]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đơn Hàng ({detail?.orders?.length ?? customer.totalOrders})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "addresses"
                  ? "border-[#800028] text-[#800028]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Sổ Địa Chỉ ({detail?.addresses?.length ?? 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "border-[#800028] text-[#800028]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Đánh Giá ({detail?.reviews?.length ?? customer.reviewCount})</span>
            </button>
          </div>

          {/* Tab Content */}
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#800028] mx-auto mb-2" />
              <span className="text-xs">Đang tải hồ sơ khách hàng...</span>
            </div>
          ) : (
            <>
              {/* TAB 1: ORDERS */}
              {activeTab === "orders" && (
                <div>
                  {!detail?.orders || detail.orders.length === 0 ? (
                    <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <p className="text-xs font-semibold text-slate-500">
                        Khách hàng chưa có đơn hàng nào
                      </p>
                    </div>
                  ) : (
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                          <tr>
                            <th className="py-2.5 px-3">Mã Đơn</th>
                            <th className="py-2.5 px-3">Sản Phẩm</th>
                            <th className="py-2.5 px-3">Tổng Tiền</th>
                            <th className="py-2.5 px-3">Thanh Toán</th>
                            <th className="py-2.5 px-3">Trạng Thái</th>
                            <th className="py-2.5 px-3">Ngày Đặt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {detail.orders.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold">
                                <Link
                                  href={`/admin/don-hang/${o.orderNumber}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 text-[#800028] hover:underline"
                                >
                                  <span>{o.orderNumber}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-700">
                                {o.itemCount} món
                              </td>
                              <td className="py-2.5 px-3 font-bold text-slate-800">
                                {o.total.toLocaleString("vi-VN")}₫
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                  {o.paymentMethod}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <AdminBadge type="order" status={o.orderStatus} />
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                                {formatDate(o.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADDRESSES */}
              {activeTab === "addresses" && (
                <div>
                  {!detail?.addresses || detail.addresses.length === 0 ? (
                    <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <p className="text-xs font-semibold text-slate-500">
                        Khách hàng chưa lưu địa chỉ nào trong sổ địa chỉ
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {detail.addresses.map((a) => (
                        <div
                          key={a.id}
                          className={`p-4 rounded-xl border transition-all ${
                            a.isDefault
                              ? "bg-rose-50/30 border-[#800028]/40 ring-1 ring-[#800028]/20"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-slate-800">
                              {a.fullName}
                            </span>
                            {a.isDefault && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#800028] text-white">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {a.phone}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>
                              {a.street}, {a.ward}, {a.district}, {a.province}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: REVIEWS */}
              {activeTab === "reviews" && (
                <div>
                  {!detail?.reviews || detail.reviews.length === 0 ? (
                    <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                      <p className="text-xs font-semibold text-slate-500">
                        Khách hàng chưa có bài đánh giá sản phẩm nào
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {detail.reviews.map((r) => (
                        <div
                          key={r.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <Link
                              href={`/san-pham/${r.product.slug}`}
                              target="_blank"
                              className="font-bold text-xs text-[#800028] hover:underline flex items-center gap-1"
                            >
                              <span>{r.product.name}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                            <span className="text-[11px] text-slate-400">
                              {formatDate(r.createdAt)}
                            </span>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= r.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                            <span className="text-xs font-bold text-slate-700 ml-1">
                              {r.rating}/5 sao
                            </span>
                          </div>

                          {r.content && (
                            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              {r.content}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
