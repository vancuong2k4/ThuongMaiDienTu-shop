"use client";

// ============================================================
// components/storefront/account-protocols/AccountProtocolsHubClient.tsx
// Trung Tâm Phác Đồ & Lịch Nhắc Uống Vi Chất Của Tôi (Phase 16)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Flame,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { AccountProtocolItem } from "./types";
import { DailyDosageScheduleCard } from "./DailyDosageScheduleCard";
import { SavedProtocolsList } from "./SavedProtocolsList";

interface AccountProtocolsHubClientProps {
  assessments: AccountProtocolItem[];
}

export const AccountProtocolsHubClient: React.FC<AccountProtocolsHubClientProps> = ({
  assessments,
}) => {
  const [activeTab, setActiveTab] = useState<"schedule" | "saved">("schedule");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    assessments[0]?.id || ""
  );

  const activeAssessment =
    assessments.find((a) => a.id === selectedAssessmentId) || assessments[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Callout */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#800028] to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-rose-200">
              <Stethoscope className="w-3.5 h-3.5 text-rose-300" />
              <span>Chăm Sóc Dinh Dưỡng Cá Nhân Hóa Chuẩn Y Khoa</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Phác Đồ & Lịch Uống Vi Chất Của Tôi
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Theo dõi lịch uống sữa công thức Aptamil, vitamin Úc và men vi sinh hàng ngày theo phác đồ Dược sĩ chuyên môn đã cá nhân hóa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/tu-van-dinh-duong"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#800028] hover:bg-rose-50 text-xs font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Trắc nghiệm phác đồ mới</span>
            </Link>
          </div>
        </div>

        {/* Subtle decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-2xl" />
      </div>

      {/* Selector if user has multiple assessments */}
      {assessments.length > 1 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Stethoscope className="w-4 h-4 text-[#800028]" />
            <span>Đang chọn phác đồ:</span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {assessments.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedAssessmentId(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  item.id === activeAssessment?.id
                    ? "bg-[#800028] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.protocol?.title || "Phác đồ cá nhân"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "schedule"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Lịch Nhắc Uống Hôm Nay</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "saved"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Tất Cả Phác Đồ ({assessments.length})</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {activeTab === "schedule" ? (
        <DailyDosageScheduleCard activeAssessment={activeAssessment} />
      ) : (
        <SavedProtocolsList assessments={assessments} />
      )}

      {/* Safety & Pharmacist Pledge */}
      <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
            Cam Kết An Toàn & Chuẩn Y Khoa Từ Dược Sĩ THUYNGA
          </h4>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            Mọi sản phẩm trong phác đồ đều là Thực phẩm bảo vệ sức khỏe hoặc Sữa dinh dưỡng nhập khẩu chính ngạch bay Air từ Úc, không phải là thuốc và không thay thế thuốc chữa bệnh. Luôn tuân thủ đúng liều lượng chỉ dẫn hoặc liên hệ Dược sĩ hỗ trợ qua Hotline <strong>090.888.6666</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
