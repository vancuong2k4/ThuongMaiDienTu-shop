"use client";

// ============================================================
// components/storefront/protocols/HealthQuizStepper.tsx
// Trắc Nghiệm Sức Khỏe Đa Tầng Tương Tác (Phase 16)
// ============================================================

import React, { useState, useEffect } from "react";
import {
  Baby,
  Heart,
  Shield,
  Activity,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import { HealthTargetGroup } from "@prisma/client";
import { HEALTH_TARGET_GROUPS_CONFIG } from "@/lib/validations/protocol";

interface QuizOptionData {
  id: string;
  label: string;
  subtitle?: string | null;
  icon?: string | null;
  protocolSlug?: string | null;
}

interface QuizQuestionData {
  id: string;
  targetGroup: HealthTargetGroup;
  questionText: string;
  subtitle?: string | null;
  stepNumber: number;
  questionType: string;
  options: QuizOptionData[];
}

interface HealthQuizStepperProps {
  onComplete: (data: {
    targetGroup: HealthTargetGroup;
    answers: Record<string, any>;
    customerName: string;
    customerPhone: string;
    notes?: string;
  }) => Promise<void>;
  loading: boolean;
}

export const HealthQuizStepper: React.FC<HealthQuizStepperProps> = ({
  onComplete,
  loading,
}) => {
  // Step 0: Chọn Target Group; Step 1 -> N: Các câu hỏi; Step N+1: Thông tin khách hàng
  const [selectedGroup, setSelectedGroup] = useState<HealthTargetGroup | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionData[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Lưu câu trả lời: questionId -> optionId hoặc string
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // Thông tin liên hệ
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Tải câu hỏi khi chọn Target Group
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);
        const res = await fetch(`/api/quiz/questions?targetGroup=${selectedGroup}`);
        const data = await res.json();
        if (data.success && data.data) {
          setQuestions(data.data);
          setCurrentStepIndex(1); // Chuyển sang câu hỏi đầu tiên
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [selectedGroup]);

  // Nhóm biểu tượng cho Step 0
  const groupIcons: Record<string, React.ElementType> = {
    BABY_KIDS: Baby,
    PREGNANT_MOM: Heart,
    POSTPARTUM_MOM: Shield,
    ADULT_HEALTH: Activity,
    ELDERLY: UserCheck,
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStepIndex <= questions.length) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 1) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (currentStepIndex === 1) {
      setSelectedGroup(null);
      setCurrentStepIndex(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError("Vui lòng nhập họ và tên của bạn");
      return;
    }

    if (
      !customerPhone.trim() ||
      !/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(customerPhone.trim())
    ) {
      setFormError("Vui lòng nhập số điện thoại di động hợp lệ (10 số)");
      return;
    }

    if (!selectedGroup) return;

    await onComplete({
      targetGroup: selectedGroup,
      answers,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      notes: notes.trim() || undefined,
    });
  };

  // STEP 0: Chọn Nhóm Đối Tượng Mục Tiêu
  if (currentStepIndex === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-9 space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#800028] text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Bước 1/3: Chọn Đối Tượng Cần Tư Vấn</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bạn Đang Muốn Nhận Phác Đồ Bổ Sung Dinh Dưỡng Cho Ai?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Mỗi giai đoạn phát triển đòi hỏi tỷ lệ vi chất và cơ chế hấp thu hoàn toàn khác nhau.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {Object.entries(HEALTH_TARGET_GROUPS_CONFIG).map(([key, item]) => {
            const Icon = groupIcons[key] || Activity;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedGroup(key as HealthTargetGroup)}
                className="group p-4 bg-slate-50 hover:bg-rose-50/50 rounded-2xl border-2 border-slate-200 hover:border-[#800028] text-left transition-all duration-200 flex items-start gap-3.5 hover:shadow-md cursor-pointer"
              >
                <div className="p-3 bg-white group-hover:bg-[#800028] text-slate-700 group-hover:text-white rounded-xl shadow-xs transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#800028] transition-colors">
                    {item.label}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                    {item.ageRange}
                  </span>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {loadingQuestions && (
          <div className="text-center pt-4">
            <div className="w-6 h-6 border-2 border-[#800028] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Đang chuẩn bị bộ câu hỏi chuyên môn...</p>
          </div>
        )}
      </div>
    );
  }

  // STEP N+1: Nhập Thông Tin Nhận Phác Đồ
  if (currentStepIndex > questions.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-9 space-y-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đã hoàn thành câu hỏi trắc nghiệm!</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Nơi Gửi Phác Đồ Cá Nhân Hóa Của Bạn
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Dược sĩ THUYNGA Shop sẽ dựa trên các câu trả lời để hoàn thiện hồ sơ vi chất độc quyền cho bạn.
          </p>
        </div>

        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Họ Và Tên Của Bạn (Hoặc Tên Bé) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="VD: Mẹ Mai Anh (Bé Bắp)"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Số Điện Thoại Nhận Kết Quả & Tư Vấn *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="VD: 0987654321"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi Chú Thêm Về Thể Trạng / Dị Ứng (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Bé từng bị dị ứng đạm bò nhẹ, mẹ đang mang thai tuần thứ 18..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[#800028] hover:bg-[#660020] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tổng hợp phác đồ...</span>
                </>
              ) : (
                <>
                  <span>Xem Phác Đồ Cá Nhân Hóa Của Tôi</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // CÁC BƯỚC CÂU HỎI TRẮC NGHIỆM (1 -> questions.length)
  const currentQuestion = questions[currentStepIndex - 1];
  const progressPercent = Math.round((currentStepIndex / (questions.length + 1)) * 100);
  const selectedOptionId = answers[currentQuestion.id];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-9 space-y-6 max-w-2xl mx-auto">
      {/* Thanh Tiến Trình (Progress Bar) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">
            Câu hỏi {currentStepIndex}/{questions.length}
          </span>
          <span className="text-[#800028] font-mono">{progressPercent}% Hoàn thành</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#800028] to-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Nội Dung Câu Hỏi */}
      <div className="space-y-1.5 pt-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {currentQuestion.questionText}
        </h3>
        {currentQuestion.subtitle && (
          <p className="text-xs sm:text-sm text-slate-500">
            {currentQuestion.subtitle}
          </p>
        )}
      </div>

      {/* Danh Sách Lựa Chọn (Options) */}
      <div className="space-y-3 pt-1">
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
                isSelected
                  ? "border-[#800028] bg-rose-50/60 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/60"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                  isSelected
                    ? "border-[#800028] bg-[#800028] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="space-y-0.5">
                <span
                  className={`text-xs sm:text-sm font-semibold block ${
                    isSelected ? "text-slate-900" : "text-slate-700"
                  }`}
                >
                  {opt.label}
                </span>
                {opt.subtitle && (
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    {opt.subtitle}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Điều Hướng Trước / Tiếp */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedOptionId}
          className="flex items-center gap-1 px-6 py-2.5 bg-[#800028] hover:bg-[#660020] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>Tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
