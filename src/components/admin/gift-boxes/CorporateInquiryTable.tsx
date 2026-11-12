"use client";

// ============================================================
// components/admin/gift-boxes/CorporateInquiryTable.tsx
// Bảng Danh Sách Yêu Cầu Quà Tặng Doanh Nghiệp B2B (Phase 17)
// ============================================================

import React from "react";
import {
  Building2,
  Phone,
  Mail,
  Calendar,
  FileText,
  Stamp,
  Edit3,
  Trash2,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { AdminCorporateInquiry } from "./types";
import {
  CORPORATE_GIFT_STATUS_CONFIG,
  GIFT_OCCASION_CONFIG,
} from "@/lib/validations/gift-box";

interface CorporateInquiryTableProps {
  inquiries: AdminCorporateInquiry[];
  onOpenQuoteModal: (inquiry: AdminCorporateInquiry) => void;
  onDeleteInquiry: (id: string) => void;
}

export const CorporateInquiryTable: React.FC<CorporateInquiryTableProps> = ({
  inquiries,
  onOpenQuoteModal,
  onDeleteInquiry,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Chưa ấn định";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h4 className="font-bold text-slate-700 text-sm">
          Chưa có yêu cầu quà tặng doanh nghiệp nào
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Khi doanh nghiệp gửi yêu cầu báo giá quà Tết hoặc sự kiện qua form B2B, thông tin sẽ được hiển thị tại đây.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Mã Yêu Cầu</th>
              <th className="px-4 py-3.5">Công Ty & Người Liên Hệ</th>
              <th className="px-4 py-3.5">Dịp Tặng & Số Lượng</th>
              <th className="px-4 py-3.5">Ngân Sách / Suất</th>
              <th className="px-4 py-3.5">Báo Giá Tổng</th>
              <th className="px-4 py-3.5">Hạn Giao & VAT/Logo</th>
              <th className="px-4 py-3.5">Trạng Thái</th>
              <th className="px-4 py-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {inquiries.map((inq) => {
              const statusCfg =
                CORPORATE_GIFT_STATUS_CONFIG[inq.status] ||
                CORPORATE_GIFT_STATUS_CONFIG.PENDING;
              const occasionCfg = GIFT_OCCASION_CONFIG[inq.occasion];

              return (
                <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Mã yêu cầu & Ngày tạo */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                      {inq.inquiryCode}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      {formatDate(inq.createdAt)}
                    </span>
                  </td>

                  {/* Doanh nghiệp & Liên hệ */}
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 line-clamp-1 max-w-[200px]">
                      {inq.companyName}
                    </div>
                    <div className="text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>{inq.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={`tel:${inq.phone}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{inq.phone}</span>
                      </a>
                      <span className="text-slate-300">|</span>
                      <a
                        href={`mailto:${inq.email}`}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
                        title={inq.email}
                      >
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[90px]">{inq.email}</span>
                      </a>
                    </div>
                  </td>

                  {/* Dịp & Số lượng suất */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-800 border border-rose-100">
                      {occasionCfg?.shortLabel || inq.occasion}
                    </span>
                    <div className="font-bold text-slate-900 text-sm mt-1">
                      {inq.quantity} <span className="text-xs font-normal text-slate-500">suất quà</span>
                    </div>
                  </td>

                  {/* Ngân sách mỗi suất */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(inq.budgetPerHamper)}
                    </span>
                    <span className="block text-[10px] text-slate-400">/suất dự kiến</span>
                  </td>

                  {/* Báo giá tổng */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {inq.quotedTotal ? (
                      <span className="font-black text-rose-700 font-mono text-xs">
                        {formatCurrency(inq.quotedTotal)}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Chưa báo giá</span>
                    )}
                  </td>

                  {/* Hạn giao & VAT/Logo */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-[11px] text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(inq.deliveryDeadline)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {inq.requiresVatInvoice && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          HĐ VAT
                        </span>
                      )}
                      {inq.customLogoBranding && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          In Logo
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusCfg.badgeClass}`}
                    >
                      {statusCfg.label}
                    </span>
                  </td>

                  {/* Thao tác */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-1.5">
                    <button
                      onClick={() => onOpenQuoteModal(inq)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                      title="Báo giá & Cập nhật trạng thái"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteInquiry(inq.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                      title="Xóa yêu cầu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
