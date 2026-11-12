"use client";

// ============================================================
// components/admin/protocols/CreateProtocolModal.tsx
// Modal Tạo Mới Phác Đồ Dinh Dưỡng Chuẩn Dược Sĩ (Phase 16)
// ============================================================

import React, { useState, useEffect } from "react";
import { X, Stethoscope, Plus, Trash2, AlertCircle, Package } from "lucide-react";
import { HealthTargetGroup } from "@prisma/client";
import { HEALTH_TARGET_GROUPS_CONFIG } from "@/lib/validations/protocol";

interface CreateProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
  }>;
}

interface ProtocolItemRow {
  productId: string;
  variantId: string;
  usageInstructions: string;
  timing: string;
  quantity: number;
  isEssential: boolean;
}

export const CreateProtocolModal: React.FC<CreateProtocolModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [targetGroup, setTargetGroup] = useState<HealthTargetGroup>(
    HealthTargetGroup.BABY_KIDS
  );
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyNutrientsInput, setKeyNutrientsInput] = useState(
    "Men vi sinh sống, Kẽm sinh học Bio Island, Đạm Whey"
  );
  const [pharmacistAdvice, setPharmacistAdvice] = useState(
    "Dược sĩ THUYNGA khuyên: Duy trì liệu trình 4 tuần liên tục, uống men vi sinh cách cữ sữa 1 tiếng."
  );
  const [morningSchedule, setMorningSchedule] = useState("07:30 - Uống sau ăn sáng 30 phút");
  const [afternoonSchedule, setAfternoonSchedule] = useState("14:00 - Uống men vi sinh cùng nước ấm");
  const [eveningSchedule, setEveningSchedule] = useState("20:00 - Cữ sữa ấm trước khi ngủ");
  const [comboDiscountPercent, setComboDiscountPercent] = useState(10);
  const [isActive, setIsActive] = useState(true);

  const [items, setItems] = useState<ProtocolItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load product list
  useEffect(() => {
    if (!isOpen) return;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/admin/products?limit=100");
        const data = await res.json();
        if (data.success && data.data) {
          setProducts(data.data);
          if (data.data.length > 0 && items.length === 0) {
            setItems([
              {
                productId: data.data[0].id,
                variantId: data.data[0].variants?.[0]?.id || "",
                usageInstructions: "Uống 1-2 lần/ngày sau bữa ăn",
                timing: "Sáng",
                quantity: 1,
                isEssential: true,
              },
            ]);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddItemRow = () => {
    if (products.length === 0) return;
    setItems([
      ...items,
      {
        productId: products[0].id,
        variantId: products[0].variants?.[0]?.id || "",
        usageInstructions: "Uống theo chỉ định của Dược sĩ",
        timing: "Trưa",
        quantity: 1,
        isEssential: true,
      },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ProtocolItemRow, val: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    if (field === "productId") {
      const prod = products.find((p) => p.id === val);
      updated[index].variantId = prod?.variants?.[0]?.id || "";
    }
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!slug.trim() || !title.trim()) {
      setError("Vui lòng điền đầy đủ slug và tiêu đề phác đồ");
      return;
    }

    if (items.length === 0) {
      setError("Phác đồ phải có ít nhất 1 sản phẩm chỉ định");
      return;
    }

    setLoading(true);

    try {
      const keyNutrients = keyNutrientsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/protocols", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          targetGroup,
          subtitle: subtitle.trim() || null,
          description: description.trim(),
          keyNutrients: keyNutrients.length > 0 ? keyNutrients : ["Vi chất thiết yếu"],
          pharmacistAdvice: pharmacistAdvice.trim(),
          dosageSchedule: {
            morning: morningSchedule,
            afternoon: afternoonSchedule,
            evening: eveningSchedule,
          },
          comboDiscountPercent: Number(comboDiscountPercent),
          isActive,
          items: items.map((it, idx) => ({
            productId: it.productId,
            variantId: it.variantId || null,
            usageInstructions: it.usageInstructions,
            timing: it.timing,
            quantity: Number(it.quantity) || 1,
            isEssential: it.isEssential,
            sortOrder: idx + 1,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo phác đồ");
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo phác đồ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-[#800028] rounded-2xl border border-rose-100">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tạo Phác Đồ Dinh Dưỡng Chuẩn Y Khoa Mới
              </h3>
              <p className="text-xs text-slate-500">
                Xây dựng lộ trình bổ sung vi chất và combo sản phẩm tương thích
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Tiêu Đề */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiêu Đề Phác Đồ *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Phác Đồ Phục Hồi Hệ Tiêu Hóa, Chống Táo Bón Cho Bé"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slug Định Danh URL *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="VD: phac-do-be-tieu-hoa-kem"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Nhóm Đối Tượng */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nhóm Đối Tượng Mục Tiêu *
              </label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value as HealthTargetGroup)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              >
                {Object.entries(HEALTH_TARGET_GROUPS_CONFIG).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label} ({item.ageRange})
                  </option>
                ))}
              </select>
            </div>

            {/* Subtitle */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phụ Đề / Giới Thiệu Ngắn
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="VD: Phối hợp Men vi sinh 15 chủng Úc và Kẽm sinh học Bio Island"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Dưỡng Chất Cốt Lõi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dưỡng Chất Cốt Lõi (Phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={keyNutrientsInput}
                onChange={(e) => setKeyNutrientsInput(e.target.value)}
                placeholder="Men vi sinh 15 chủng, Kẽm Zinc, Đạm Whey..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Mô Tả Chuyên Môn */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mô Tả Lâm Sàng & Cơ Chế Hoạt Động *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Giải thích cơ chế khoa học vì sao các vi chất này khi dùng cùng nhau đem lại hiệu quả vượt trội..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Lời Khuyên Của Dược Sĩ */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lời Khuyên & Chỉ Dẫn Từ Dược Sĩ THUYNGA Shop *
              </label>
              <textarea
                rows={2}
                required
                value={pharmacistAdvice}
                onChange={(e) => setPharmacistAdvice(e.target.value)}
                placeholder="Chỉ dẫn nhiệt độ nước pha sữa, thời điểm uống cách xa nhau..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Biểu Đồ Liều Dùng (Sáng, Trưa, Tối) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Liều Dùng Buổi Sáng
              </label>
              <input
                type="text"
                value={morningSchedule}
                onChange={(e) => setMorningSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Liều Dùng Buổi Chiều/Tối
              </label>
              <input
                type="text"
                value={afternoonSchedule}
                onChange={(e) => setAfternoonSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Giảm Giá Combo % */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chiết Khấu Combo Phác Đồ (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={comboDiscountPercent}
                onChange={(e) => setComboDiscountPercent(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Kích Hoạt Lưu Hành */}
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="activeProtocolToggle"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#800028] rounded border-slate-300 focus:ring-[#800028]"
              />
              <label
                htmlFor="activeProtocolToggle"
                className="text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Đang lưu hành công khai cho khách hàng làm bài test
              </label>
            </div>
          </div>

          {/* Danh Sách Sản Phẩm Trong Phác Đồ */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#800028]" />
                Sản Phẩm Thành Phần Phác Đồ
              </h4>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs font-semibold text-[#800028] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm sản phẩm
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((row, idx) => {
                const prod = products.find((p) => p.id === row.productId);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs"
                  >
                    {/* Chọn Sản Phẩm */}
                    <div className="sm:col-span-5">
                      <select
                        value={row.productId}
                        onChange={(e) =>
                          handleItemChange(idx, "productId", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Hướng Dẫn Dùng */}
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={row.usageInstructions}
                        onChange={(e) =>
                          handleItemChange(idx, "usageInstructions", e.target.value)
                        }
                        placeholder="Cách dùng: 1 viên sau ăn sáng..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      />
                    </div>

                    {/* Thời Điểm (Sáng/Trưa/Tối) */}
                    <div className="sm:col-span-2">
                      <select
                        value={row.timing}
                        onChange={(e) =>
                          handleItemChange(idx, "timing", e.target.value)
                        }
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                      >
                        <option value="Sáng">Sáng</option>
                        <option value="Trưa">Trưa</option>
                        <option value="Chiều">Chiều</option>
                        <option value="Tối">Tối</option>
                      </select>
                    </div>

                    {/* Xóa dòng */}
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#800028] hover:bg-[#660020] rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? "Đang tạo..." : "Lưu Phác Đồ Dược Sĩ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
