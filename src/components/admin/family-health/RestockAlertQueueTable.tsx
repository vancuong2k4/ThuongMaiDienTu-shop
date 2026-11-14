"use client";

// ============================================================
// components/admin/family-health/RestockAlertQueueTable.tsx
// Hàng Đợi Khách Hàng Sắp Hết Hộp Thực Phẩm Chức Năng (CRM Hot Lead - Phase 22)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle,
  Clock,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import type { AdminUrgentRestockItem } from "./types";

interface RestockAlertQueueTableProps {
  items: AdminUrgentRestockItem[];
}

export const RestockAlertQueueTable: React.FC<RestockAlertQueueTableProps> = ({
  items,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMessageItem, setActiveMessageItem] = useState<AdminUrgentRestockItem | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRelationBadge = (rel: string) => {
    switch (rel) {
      case "CHILD":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">Bé / Con</span>;
      case "SPOUSE":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Vợ / Chồng</span>;
      case "PARENT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Bố / Mẹ</span>;
      case "GRANDPARENT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">Ông / Bà</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">Bản thân</span>;
    }
  };

  const generateZaloMessage = (item: AdminUrgentRestockItem) => {
    const custName = item.memberProfile.user.name || "Quý khách";
    const memberName = item.memberProfile.fullName;
    const itemName = item.customItemName;
    const remaining = item.servingsRemaining;

    return `Dạ em chào anh/chị ${custName}! Em là Dược sĩ tại THUYNGA Shop (chuyên hàng bay Air Úc). Theo dõi tủ thuốc dinh dưỡng của ${memberName}, em thấy hộp ${itemName} dự kiến chỉ còn khoảng ${remaining} ngày nữa là hết ạ. 
    
Hiện kho THUYNGA Shop vừa đáp chuyến bay Air Cargo mới nhất về Việt Nam với date mới nguyên seal. Em nhắn trước để nếu anh/chị cần tái nạp cho gia đình thì em giữ sẵn 1 hộp ship liền tay, không lo bị gián đoạn liệu trình vi chất của mình ạ! Anh/chị cần em hỗ trợ lên đơn luôn không ạ?`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-base font-black text-gray-900">
              Hàng Đợi Chăm Sóc Khách Sắp Hết Hộp (Lead Tái Nạp CRM)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Tự động phát hiện dựa trên số viên còn lại &le; 7 ngày trong tủ thuốc gia đình
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-200">
          {items.length} Khách hàng cần liên hệ
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold">Tất cả tủ thuốc gia đình đều còn đủ lượng dùng!</p>
          <p className="text-xs text-gray-400 mt-1">
            Không có khách hàng nào còn dưới 7 liều trong hệ thống lúc này.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Khách Hàng (Chủ Tài Khoản)</th>
                <th className="py-3 px-4">Thành Viên Sử Dụng</th>
                <th className="py-3 px-4">Sản Phẩm Đang Uống</th>
                <th className="py-3 px-4 text-center">Còn Lại (Liều/Viên)</th>
                <th className="py-3 px-4 text-center">Mức Độ</th>
                <th className="py-3 px-4 text-right">Thao Tác Chăm Sóc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {items.map((item) => {
                const user = item.memberProfile.user;
                const isUrgent = item.servingsRemaining <= 3;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 text-sm">
                        {user.name || "Khách hàng THUYNGA"}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        {user.phone ? (
                          <a
                            href={`tel:${user.phone}`}
                            className="flex items-center gap-1 text-emerald-700 hover:underline font-bold"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{user.phone}</span>
                          </a>
                        ) : (
                          <span className="text-gray-400">Chưa có SĐT</span>
                        )}
                        {user.email && (
                          <span className="text-gray-400 truncate max-w-[150px]">
                            {user.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">
                        {item.memberProfile.fullName}
                      </div>
                      <div className="mt-1">
                        {getRelationBadge(item.memberProfile.relation)}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span>{item.customItemName}</span>
                        {item.product && (
                          <Link
                            href={`/san-pham/${item.product.slug}`}
                            target="_blank"
                            className="text-gray-400 hover:text-[#800028]"
                            title="Xem sản phẩm trên sàn"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {item.brandName ? `Hãng: ${item.brandName} • ` : ""}
                        Liều dùng: {item.dosageText}
                      </div>
                    </td>

                    {/* Remaining */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full font-black text-xs ${
                          isUrgent
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {item.servingsRemaining} ngày
                      </span>
                    </td>

                    {/* Level */}
                    <td className="py-3.5 px-4 text-center">
                      {isUrgent ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Gấp (&le; 3 ngày)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Cảnh báo (&le; 7 ngày)</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {user.phone && (
                          <a
                            href={`tel:${user.phone}`}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                            title="Gọi điện trực tiếp"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setActiveMessageItem(item)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#800028] rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                          title="Tạo kịch bản Zalo/SMS Dược sĩ"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Kịch Bản SMS</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Kịch bản tư vấn Modal */}
      {activeMessageItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#800028]" />
                <h3 className="font-black text-gray-900 text-sm">
                  Kịch Bản Chăm Sóc Zalo/SMS Dược Sĩ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessageItem(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">
                Khách hàng: <strong>{activeMessageItem.memberProfile.user.name}</strong> • SĐT:{" "}
                <strong>{activeMessageItem.memberProfile.user.phone || "Chưa có"}</strong>
              </p>
              <textarea
                readOnly
                value={generateZaloMessage(activeMessageItem)}
                className="w-full h-44 text-xs font-mono p-3 bg-slate-50 border border-gray-200 rounded-xl leading-relaxed text-gray-800 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400">
                Gợi ý: Dán vào Zalo hoặc phần mềm gọi thoại CSKH
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      generateZaloMessage(activeMessageItem),
                      activeMessageItem.id
                    )
                  }
                  className="px-4 py-2 bg-[#800028] hover:bg-[#5c001e] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {copiedId === activeMessageItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã Copy!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Tin Nhắn</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMessageItem(null)}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
