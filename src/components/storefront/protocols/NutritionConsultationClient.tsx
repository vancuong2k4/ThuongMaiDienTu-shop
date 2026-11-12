"use client";

// ============================================================
// components/storefront/protocols/NutritionConsultationClient.tsx
// Container Trắc Nghiệm Dinh Dưỡng & Khám Phá Phác Đồ Storefront (Phase 16)
// ============================================================

import React, { useState } from "react";
import { HealthQuizStepper } from "./HealthQuizStepper";
import { ProtocolResultShowcase } from "./ProtocolResultShowcase";
import { BookConsultationModal } from "./BookConsultationModal";
import { HealthTargetGroup } from "@prisma/client";

interface NutritionConsultationClientProps {
  initialProtocol?: any;
}

export const NutritionConsultationClient: React.FC<NutritionConsultationClientProps> = ({
  initialProtocol,
}) => {
  const [currentProtocol, setCurrentProtocol] = useState<any>(initialProtocol || null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleCompleteQuiz = async (formData: {
    targetGroup: HealthTargetGroup;
    answers: Record<string, any>;
    customerName: string;
    customerPhone: string;
    notes?: string;
  }) => {
    try {
      setLoading(true);
      const res = await fetch("/api/quiz/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (res.ok && resData.success && resData.data) {
        setAssessmentData({
          assessmentId: resData.data.assessmentId,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          pricing: resData.data.pricing,
        });
        setCurrentProtocol(resData.data.protocol);
      } else {
        alert(resData.error || "Không thể phân tích phác đồ dinh dưỡng");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi kết nối khi đánh giá phác đồ");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentProtocol(null);
    setAssessmentData(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      {!currentProtocol && (
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#800028] text-xs font-bold uppercase tracking-wider">
            <span>Dịch Vụ Tư Vấn Độc Quyền</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Khám Phá Phác Đồ Dinh Dưỡng Chuẩn Y Khoa Của Bạn
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Trả lời trắc nghiệm nhanh 2 phút để nhận lộ trình bổ sung vi chất Úc
            bay air được thiết kế chuyên biệt bởi Dược sĩ THUYNGA Shop.
          </p>
        </div>
      )}

      {/* Main Content Area: Quiz Stepper vs Result Showcase */}
      {currentProtocol ? (
        <ProtocolResultShowcase
          protocol={currentProtocol}
          pricing={assessmentData?.pricing}
          assessmentId={assessmentData?.assessmentId}
          customerName={assessmentData?.customerName}
          onOpenConsultationModal={() => setIsConsultationModalOpen(true)}
          onRetakeQuiz={handleRetakeQuiz}
        />
      ) : (
        <HealthQuizStepper
          onComplete={handleCompleteQuiz}
          loading={loading}
        />
      )}

      {/* Modal Đặt Lịch Tư Vấn 1-1 */}
      <BookConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        assessmentId={assessmentData?.assessmentId}
        defaultName={assessmentData?.customerName}
        defaultPhone={assessmentData?.customerPhone}
      />
    </div>
  );
};
