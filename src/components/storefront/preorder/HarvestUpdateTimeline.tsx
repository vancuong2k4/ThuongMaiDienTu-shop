"use client";

// ============================================================
// components/storefront/preorder/HarvestUpdateTimeline.tsx
// Dòng Thời Gian Nhật Ký Thu Hoạch Từ Nông Trường Úc (Phase 21)
// ============================================================

import React from "react";
import {
  Calendar,
  Thermometer,
  CloudSun,
  MapPin,
  CheckCircle2,
  Clock,
} from "lucide-react";

export interface HarvestUpdateItem {
  id: string;
  title: string;
  content: string;
  brixRecorded?: number | null;
  sizeRecordedMm?: number | null;
  weatherCondition?: string | null;
  photos?: any;
  reportedAt: string | Date;
}

interface HarvestUpdateTimelineProps {
  updates: HarvestUpdateItem[];
  farmName: string;
  farmRegion: string;
}

export const HarvestUpdateTimeline: React.FC<HarvestUpdateTimelineProps> = ({
  updates,
  farmName,
  farmRegion,
}) => {
  if (updates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
        <Clock className="w-8 h-8 text-slate-300 mx-auto" />
        <p className="text-xs text-slate-500 font-medium">
          Nông trường đang chuẩn bị bước vào giai đoạn thử nghiệm đầu mùa vụ.
          Nhật ký đo đạc sẽ được truyền hình ảnh trực tiếp từ Úc trong vài ngày tới.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#800028] uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{farmName} • {farmRegion}</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Nhật Ký Tiến Trình Mùa Vụ Nông Trường Úc
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật liên tục từ các chuyên gia nông học bản địa trước giờ xuất hành đường bay Air
          </p>
        </div>

        <span className="self-start sm:self-auto text-[11px] font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
          {updates.length} bản tin hiện trường
        </span>
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {updates.map((item, idx) => {
          const date = new Date(item.reportedAt);
          const dateStr = date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          return (
            <div key={item.id} className="relative group">
              {/* Timeline dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                  idx === 0
                    ? "bg-[#800028] ring-4 ring-rose-100"
                    : "bg-slate-400"
                }`}
              />

              <div className="bg-slate-50/80 group-hover:bg-slate-50 transition-colors rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                {/* Meta pills */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dateStr}</span>
                    {idx === 0 && (
                      <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded uppercase">
                        Mới nhất
                      </span>
                    )}
                  </div>

                  {item.weatherCondition && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200/60">
                      <CloudSun className="w-3 h-3 text-amber-500" />
                      <span>{item.weatherCondition}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#800028] transition-colors">
                  {item.title}
                </h4>

                {/* Content */}
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.content}
                </p>

                {/* Scientific Metric Tags (Brix & Size) */}
                {(item.brixRecorded || item.sizeRecordedMm) && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                    {item.brixRecorded && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200/80">
                        <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                        <span>Độ đường: {item.brixRecorded}° Brix</span>
                      </div>
                    )}

                    {item.sizeRecordedMm && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 text-[#800028] text-xs font-bold border border-rose-200/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#800028]" />
                        <span>Đường kính quả: {item.sizeRecordedMm}mm</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
