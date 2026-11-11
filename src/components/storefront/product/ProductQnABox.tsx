// ============================================================
// components/storefront/product/ProductQnABox.tsx
// Phân hệ Hỏi Đáp Chuyên Gia Sữa & TPCN Úc (Community Q&A - Phase 14)
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  MessageCircleQuestion,
  Send,
  ShieldCheck,
  User,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface AnswerItem {
  id: string;
  answer: string;
  isOfficial: boolean;
  createdAt: string;
  user: {
    name: string;
    avatar: string | null;
    role: string;
  };
}

interface QuestionItem {
  id: string;
  question: string;
  isAnswered: boolean;
  createdAt: string;
  user: {
    name: string;
    avatar: string | null;
    membershipTier?: string | null;
  };
  answers: AnswerItem[];
}

interface ProductQnABoxProps {
  productId: string;
  productSlug: string;
  productName: string;
}

export const ProductQnABox: React.FC<ProductQnABoxProps> = ({
  productSlug,
  productName,
}) => {
  const { data: session } = useSession();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [replyQuestionId, setReplyQuestionId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productSlug}/qa`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productSlug) {
      fetchQuestions();
    }
  }, [productSlug]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      showToast("error", "Vui lòng đăng nhập để gửi câu hỏi");
      return;
    }
    if (!questionInput.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể gửi câu hỏi");
      }

      showToast("success", data.message || "Gửi câu hỏi thành công!");
      setQuestionInput("");
      setShowAskModal(false);
      await fetchQuestions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      showToast("error", msg);
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    if (!session?.user) {
      showToast("error", "Vui lòng đăng nhập để gửi câu trả lời");
      return;
    }
    if (!answerInput.trim()) return;

    setIsSubmittingAnswer(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/qa/${questionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: answerInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể gửi câu trả lời");
      }

      showToast("success", "Cảm ơn bạn đã đóng góp câu trả lời!");
      setAnswerInput("");
      setReplyQuestionId(null);
      await fetchQuestions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      showToast("error", msg);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-md animate-in slide-in-from-top duration-150 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#800028] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
              Hỏi Đáp Chuyên Gia Sữa & TPCN Úc
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Cách pha sữa, liều lượng uống, điều kiện bảo quản mát air-cargo sẽ được
            Dược sĩ THUYNGA Shop giải đáp tận tâm.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAskModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors shadow-sm shadow-[#800028]/20 self-start sm:self-auto shrink-0"
        >
          <MessageCircleQuestion className="w-3.5 h-3.5" />
          <span>Đặt câu hỏi cho Dược sĩ</span>
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="py-8 text-center text-xs text-neutral-400">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#800028]" />
          <span>Đang tải danh sách câu hỏi...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <MessageCircleQuestion className="w-8 h-8 text-neutral-300 mx-auto" />
          <p className="text-xs font-semibold text-neutral-700">
            Chưa có câu hỏi nào cho sản phẩm này.
          </p>
          <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
            Bạn có thắc mắc về cách sử dụng, độ tuổi hoặc hạn date? Hãy đặt câu
            hỏi đầu tiên ngay!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100 space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="pt-4 first:pt-0 space-y-3">
              {/* Câu hỏi */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  Q
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-neutral-900">
                      {q.user.name}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      • {new Date(q.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1 leading-relaxed">
                    {q.question}
                  </p>
                </div>
              </div>

              {/* Danh sách câu trả lời */}
              {q.answers.length > 0 && (
                <div className="pl-10 space-y-2">
                  {q.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                        ans.isOfficial
                          ? "bg-rose-50/70 border border-rose-200/80"
                          : "bg-neutral-50 border border-neutral-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {ans.isOfficial ? (
                            <span className="inline-flex items-center gap-1 font-bold text-[#800028]">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Dược sĩ THUYNGA Shop:
                            </span>
                          ) : (
                            <span className="font-bold text-neutral-800">
                              {ans.user.name}:
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(ans.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">
                        {ans.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Nút trả lời câu hỏi này */}
              <div className="pl-10">
                {replyQuestionId === q.id ? (
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <textarea
                      rows={2}
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      placeholder="Nhập câu trả lời của bạn..."
                      className="w-full p-2.5 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-[#800028] bg-white resize-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyQuestionId(null);
                          setAnswerInput("");
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-200 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        disabled={isSubmittingAnswer || !answerInput.trim()}
                        onClick={() => handleAnswerQuestion(q.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1 rounded-lg text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isSubmittingAnswer ? "Đang gửi..." : "Gửi"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReplyQuestionId(q.id)}
                    className="text-[11px] font-semibold text-[#800028] hover:underline"
                  >
                    + Trả lời câu hỏi này
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Đặt câu hỏi */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#800028]" />
                <h3 className="font-extrabold text-base text-neutral-900">
                  Đặt Câu Hỏi Cho Dược Sĩ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAskModal(false)}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Bạn đang hỏi về: <strong>{productName}</strong>. Hãy mô tả chi tiết độ
              tuổi của bé hoặc tình trạng sức khỏe để nhận tư vấn chính xác nhất.
            </p>

            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <textarea
                  rows={4}
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Ví dụ: Bé nhà mình 7 tháng tuổi đang dùng số 1 có chuyển sang số 2 được không shop?..."
                  className="w-full p-3 text-xs rounded-2xl border border-neutral-200 focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028] resize-none"
                />
                <div className="text-[11px] text-neutral-400 text-right mt-1">
                  {questionInput.length}/1000 ký tự
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuestion || questionInput.trim().length < 10}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#800028] text-white hover:bg-[#660020] transition-colors disabled:opacity-50 shadow-md shadow-[#800028]/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingQuestion ? "Đang gửi..." : "Gửi câu hỏi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
