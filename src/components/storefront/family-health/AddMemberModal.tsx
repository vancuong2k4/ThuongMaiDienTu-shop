"use client";

// ============================================================
// components/storefront/family-health/AddMemberModal.tsx
// Modal Thêm Thành Viên Mới Vào Tủ Thuốc Gia Đình (Phase 22)
// ============================================================

import React, { useState } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";
import type { FamilyRelation } from "@prisma/client";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newMember: any) => void;
}

const EMOJI_OPTIONS = ["👶", "👧", "👦", "👩", "👨", "👵", "👴", "❤️"];

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [relation, setRelation] = useState<FamilyRelation>("CHILD");
  const [avatarEmoji, setAvatarEmoji] = useState("👶");
  const [healthGoalsText, setHealthGoalsText] = useState("Tăng đề kháng, Bổ sung vi chất");
  const [allergiesText, setAllergiesText] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const healthGoals = healthGoalsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const allergies = allergiesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        fullName: fullName.trim(),
        relation,
        avatarEmoji,
        healthGoals,
        allergies,
        notes: notes.trim() || undefined,
      };

      const res = await fetch("/api/family-health/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || "Không thể tạo hồ sơ thành viên.");
        return;
      }

      onSuccess(json.member);
      onClose();
    } catch {
      setError("Lỗi kết nối máy chủ khi thêm thành viên.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-[#800028] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-sm tracking-wide uppercase">
                Thêm Thành Viên Gia Đình
              </h3>
              <p className="text-[11px] text-slate-300">
                Tạo hồ sơ riêng để theo dõi cữ uống và bổ sung dinh dưỡng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Emoji Avatar Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Chọn biểu tượng đại diện:
            </label>
            <div className="flex items-center gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-all cursor-pointer ${
                    avatarEmoji === emoji
                      ? "border-[#800028] bg-rose-50 ring-2 ring-rose-200"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Relation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Tên thành viên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Bé Bon, Mẹ Thảo, Ông Nội"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold focus:border-[#800028] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Mối quan hệ
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value as FamilyRelation)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-[#800028] outline-hidden cursor-pointer"
              >
                <option value="CHILD">Bé con / Con cái</option>
                <option value="SELF">Bản thân</option>
                <option value="SPOUSE">Vợ / Chồng</option>
                <option value="PARENT">Bố / Mẹ</option>
                <option value="GRANDPARENT">Ông / Bà</option>
              </select>
            </div>
          </div>

          {/* Health Goals */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Mục tiêu sức khỏe (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              placeholder="Tăng chiều cao, Đề kháng hô hấp, Xương khớp..."
              value={healthGoalsText}
              onChange={(e) => setHealthGoalsText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Dị ứng thức ăn / vi chất (nếu có)
            </label>
            <input
              type="text"
              placeholder="VD: Dị ứng đạm sữa bò, dị ứng hải sản..."
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Ghi chú thêm
            </label>
            <textarea
              rows={2}
              placeholder="Thói quen ăn uống, lưu ý của bác sĩ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-[#800028] outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#800028] hover:bg-[#660020] text-white font-black shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Đang lưu..." : "Lưu Thành Viên"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
