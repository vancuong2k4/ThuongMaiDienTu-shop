"use client";

// ============================================================
// components/admin/products/ProductForm.tsx
// Form Tạo Mới & Chỉnh Sửa Sản Phẩm Chuẩn Admin CMS
// ============================================================

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { slugify, formatCurrency, getCountryFlag } from "@/lib/utils";
import {
  Package,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  ArrowLeft,
  Loader2,
  Sparkles,
  AlertCircle,
  Eye,
  Code,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { ProductFormInput, ProductVariantInput, ProductImageInput } from "@/lib/validations/product";

interface CategoryOption {
  id: string;
  name: string;
  parentId: string | null;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialData?: any;
  isEdit?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ── Form State ───────────────────────────────────────────────
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isAutoSlug, setIsAutoSlug] = useState(!isEdit);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || "");
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [origin, setOrigin] = useState(initialData?.origin || "Hàn Quốc");
  const [specification, setSpecification] = useState(initialData?.specification || "");
  const [expiryInfo, setExpiryInfo] = useState(initialData?.expiryInfo || "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [descTab, setDescTab] = useState<"edit" | "preview">("edit");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc || "");
  const [seoKeywords, setSeoKeywords] = useState(initialData?.seoKeywords || "");

  // ── Variants State ───────────────────────────────────────────
  const [variants, setVariants] = useState<ProductVariantInput[]>(() => {
    if (initialData?.variants && initialData.variants.length > 0) {
      return initialData.variants.map((v: any) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
        originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
        stock: v.stock,
        weight: v.weight || null,
        image: v.image || null,
        isDefault: v.isDefault,
        isActive: v.isActive,
        sortOrder: v.sortOrder || 0,
      }));
    }
    return [
      {
        name: "Quy cách tiêu chuẩn",
        sku: "",
        price: 0,
        originalPrice: null,
        stock: 50,
        weight: 300,
        isDefault: true,
        isActive: true,
        sortOrder: 0,
      },
    ];
  });

  // ── Images State ─────────────────────────────────────────────
  const [images, setImages] = useState<ProductImageInput[]>(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || "",
        sortOrder: img.sortOrder || 0,
      }));
    }
    return [];
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Tự động cập nhật Slug khi thay đổi Tên sản phẩm nếu đang bật AutoSlug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (isAutoSlug) {
      const generatedSlug = slugify(val);
      setSlug(generatedSlug);

      // Cập nhật SKU mặc định nếu variant đầu tiên chưa có SKU
      if (variants.length === 1 && (!variants[0].sku || !isEdit)) {
        const skuPrefix = brand ? slugify(brand).toUpperCase() : "TN";
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        setVariants((prev) => [
          {
            ...prev[0],
            sku: `${skuPrefix}-${randomPart}`,
          },
        ]);
      }
    }
  };

  // ── Xử lý thêm / sửa / xóa Biến thể ──────────────────────────
  const handleAddVariant = () => {
    const nextIdx = variants.length + 1;
    const baseSku = variants[0]?.sku ? `${variants[0].sku}-V${nextIdx}` : `SKU-${Date.now().toString().slice(-4)}`;

    setVariants((prev) => [
      ...prev,
      {
        name: `Phân loại ${nextIdx}`,
        sku: baseSku,
        price: prev[0]?.price || 0,
        originalPrice: prev[0]?.originalPrice || null,
        stock: 20,
        weight: 300,
        isDefault: false,
        isActive: true,
        sortOrder: nextIdx - 1,
      },
    ]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariantInput, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      if (field === "isDefault" && value === true) {
        // Chỉ cho phép 1 variant là default
        return updated.map((v, i) => ({
          ...v,
          isDefault: i === index,
        }));
      }
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      alert("Sản phẩm phải có ít nhất 1 biến thể.");
      return;
    }
    setVariants((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Nếu xóa biến thể mặc định thì chỉ định biến thể đầu tiên làm mặc định
      if (!filtered.some((v) => v.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  // ── Xử lý hình ảnh ───────────────────────────────────────────
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [
      ...prev,
      {
        url: imageUrlInput.trim(),
        alt: name,
        sortOrder: prev.length,
      },
    ]);
    setImageUrlInput("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Không thể tải ảnh lên");
        }

        setImages((prev) => [
          ...prev,
          {
            url: data.url,
            alt: name || file.name,
            sortOrder: prev.length,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage((err as Error).message);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) => {
      const item = prev[index];
      const others = prev.filter((_, i) => i !== index);
      return [item, ...others].map((img, idx) => ({ ...img, sortOrder: idx }));
    });
  };

  // ── Submit Form ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate nhanh trên client
    if (!name.trim()) {
      setErrorMessage("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("Vui lòng nhập đường dẫn tĩnh (slug).");
      return;
    }
    if (!categoryId) {
      setErrorMessage("Vui lòng chọn danh mục cho sản phẩm.");
      return;
    }
    if (variants.length === 0) {
      setErrorMessage("Sản phẩm phải có ít nhất 1 biến thể.");
      return;
    }

    // Kiểm tra SKU biến thể
    for (const v of variants) {
      if (!v.sku.trim()) {
        setErrorMessage("Tất cả các biến thể phải có mã SKU.");
        return;
      }
      if (v.price < 0) {
        setErrorMessage("Giá bán không được nhỏ hơn 0.");
        return;
      }
      if (v.stock < 0) {
        setErrorMessage("Số lượng tồn kho không được âm.");
        return;
      }
    }

    const payload: ProductFormInput = {
      name: name.trim(),
      slug: slug.trim(),
      categoryId,
      brand: brand.trim() || null,
      origin: origin.trim() || null,
      specification: specification.trim() || null,
      expiryInfo: expiryInfo.trim() || null,
      shortDesc: shortDesc.trim() || null,
      description: description.trim() || null,
      isActive,
      isFeatured,
      seoTitle: seoTitle.trim() || null,
      seoDesc: seoDesc.trim() || null,
      seoKeywords: seoKeywords.trim() || null,
      variants,
      images,
    };

    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Không thể lưu sản phẩm");
      }

      setSuccessMessage(resData.message || "Lưu sản phẩm thành công!");

      setTimeout(() => {
        router.push("/admin/san-pham");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMessage((err as Error).message);
      setIsSubmitting(false);
    }
  };

  const originPresets = [
    "Hàn Quốc",
    "Nhật Bản",
    "Mỹ",
    "Úc",
    "Đan Mạch",
    "Đức",
    "Pháp",
    "Nga",
    "New Zealand",
    "Thái Lan",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* ── Thông báo lỗi / thành công ───────────────────────────── */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage} Đang chuyển hướng...</span>
        </div>
      )}

      {/* ── Khối 1: Thông Tin Cơ Bản ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            1. Thông Tin Cơ Bản
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tên sản phẩm, đường dẫn tĩnh, danh mục và nguồn gốc xuất xứ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tên sản phẩm */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Ví dụ: Nước Hồng Sâm Linh Chi KGC Cheong Kwan Jang Hộp 30 Gói"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            />
          </div>

          {/* Đường dẫn Slug */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Đường dẫn tĩnh (Slug) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsAutoSlug(!isAutoSlug);
                  if (!isAutoSlug) setSlug(slugify(name));
                }}
                className="text-[11px] font-semibold text-wine-800 hover:underline"
              >
                {isAutoSlug ? "Tự động theo tên (Bật)" : "Tùy chỉnh thủ công (Tắt)"}
              </button>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-2.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-400 text-xs font-mono">
                /san-pham/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsAutoSlug(false);
                }}
                placeholder="nuoc-hong-sam-linh-chi-kgc"
                required
                className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
              />
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ngành hàng / Danh mục <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            >
              <option value="">-- Chọn ngành hàng --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.parentId ? `↳ ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thương hiệu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Thương hiệu (Brand)
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="KGC, DHC, Kirkland, Danisa..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            />
          </div>

          {/* Xuất xứ */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Xuất xứ (Quốc gia)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Hàn Quốc, Nhật Bản, Mỹ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
              />
              <div className="flex flex-wrap gap-1">
                {originPresets.map((org) => (
                  <button
                    key={org}
                    type="button"
                    onClick={() => setOrigin(org)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                      origin === org
                        ? "bg-wine-800 text-white border-wine-800"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {getCountryFlag(org)} {org}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quy cách & HSD */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quy cách đóng gói
              </label>
              <input
                type="text"
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                placeholder="Hộp 30 gói x 10ml, Chai 500ml, Hộp 60 viên..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hạn sử dụng (HSD)
              </label>
              <input
                type="text"
                value={expiryInfo}
                onChange={(e) => setExpiryInfo(e.target.value)}
                placeholder="HSD: 24 tháng từ ngày sản xuất, Date mới nhất..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
              />
            </div>
          </div>

          {/* Mô tả ngắn */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô tả ngắn (Hiển thị ở card sản phẩm)
            </label>
            <input
              type="text"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Tóm tắt ngắn gọn 1-2 câu về công dụng hoặc đặc điểm nổi bật..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            />
          </div>
        </div>
      </div>

      {/* ── Khối 2: Quản Lý Biến Thể & Bảng Giá & Kho ─────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Biến Thể, Bảng Giá & Tồn Kho
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thiết lập các phân loại (kích cỡ, trọng lượng, số lượng viên) với mã SKU, giá bán và tồn kho riêng
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddVariant}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-wine-50 text-wine-800 hover:bg-wine-100 border border-wine-200 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm biến thể</span>
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-2.5 px-3">Tên biến thể / Phân loại</th>
                <th className="py-2.5 px-3">Mã SKU</th>
                <th className="py-2.5 px-3">Giá bán (VNĐ)</th>
                <th className="py-2.5 px-3">Giá gốc (VNĐ)</th>
                <th className="py-2.5 px-3">Tồn kho</th>
                <th className="py-2.5 px-3">Trọng lượng (g)</th>
                <th className="py-2.5 px-3 text-center">Mặc định</th>
                <th className="py-2.5 px-3 text-right">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {variants.map((variant, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  {/* Tên biến thể */}
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) =>
                        handleUpdateVariant(idx, "name", e.target.value)
                      }
                      placeholder="Hộp 30 viên..."
                      required
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-wine-800"
                    />
                  </td>

                  {/* SKU */}
                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "sku",
                          e.target.value.toUpperCase().trim()
                        )
                      }
                      placeholder="SKU-001"
                      required
                      className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-wine-800 uppercase"
                    />
                  </td>

                  {/* Giá bán */}
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "price",
                          Math.max(0, Number(e.target.value))
                        )
                      }
                      min="0"
                      step="1000"
                      required
                      className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-wine-800"
                    />
                  </td>

                  {/* Giá gốc */}
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      value={variant.originalPrice || ""}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "originalPrice",
                          e.target.value ? Math.max(0, Number(e.target.value)) : null
                        )
                      }
                      placeholder="Không có"
                      min="0"
                      step="1000"
                      className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-wine-800"
                    />
                  </td>

                  {/* Tồn kho */}
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "stock",
                          Math.max(0, parseInt(e.target.value) || 0)
                        )
                      }
                      min="0"
                      required
                      className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-wine-800"
                    />
                  </td>

                  {/* Trọng lượng */}
                  <td className="py-2.5 px-3">
                    <input
                      type="number"
                      value={variant.weight || ""}
                      onChange={(e) =>
                        handleUpdateVariant(
                          idx,
                          "weight",
                          e.target.value ? Math.max(0, parseInt(e.target.value)) : null
                        )
                      }
                      placeholder="300"
                      min="0"
                      className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
                    />
                  </td>

                  {/* Mặc định */}
                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={variant.isDefault}
                      onChange={() => handleUpdateVariant(idx, "isDefault", true)}
                      title="Chọn làm biến thể mặc định"
                      className="w-4 h-4 text-wine-800 focus:ring-wine-800"
                    />
                  </td>

                  {/* Xóa */}
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      disabled={variants.length <= 1}
                      title="Xóa biến thể này"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Khối 3: Thư Viện Hình Ảnh ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            3. Thư Viện Hình Ảnh Sản Phẩm
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ảnh đầu tiên trong danh sách sẽ được dùng làm ảnh đại diện chính (Thumbnail)
          </p>
        </div>

        {/* Công cụ thêm ảnh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tải ảnh từ máy */}
          <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-wine-700 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer relative bg-slate-50/50">
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-wine-800" />
                <span className="text-xs font-semibold text-slate-600">
                  Đang tải ảnh lên...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-white text-wine-800 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Chọn ảnh từ máy tính
                </span>
                <span className="text-[10px] text-slate-400">
                  Hỗ trợ PNG, JPG, WEBP tối đa 5MB
                </span>
              </div>
            )}
          </div>

          {/* Nhập URL ảnh ngoài */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-center gap-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Hoặc dán link ảnh trực tiếp (URL):</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800 bg-white"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
              >
                Thêm ảnh
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách ảnh đã chọn */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group aspect-square shadow-xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt || `Ảnh ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Badge Ảnh đại diện */}
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-wine-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    Đại diện
                  </span>
                )}

                {/* Nút hành động */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      title="Đặt làm ảnh đại diện"
                      className="p-1.5 bg-white text-slate-800 hover:text-wine-800 rounded-lg text-xs font-bold shadow-sm"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Xóa ảnh này"
                    className="p-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg text-xs font-bold shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400 italic">
            Chưa có hình ảnh nào được thêm vào sản phẩm.
          </div>
        )}
      </div>

      {/* ── Khối 4: Mô Tả Chi Tiết ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              4. Mô Tả Chi Tiết Sản Phẩm
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ định dạng HTML / văn bản đầy đủ để hiển thị trên trang chi tiết sản phẩm
            </p>
          </div>

          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setDescTab("edit")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                descTab === "edit"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Code className="w-3 h-3" />
              <span>Soạn thảo</span>
            </button>
            <button
              type="button"
              onClick={() => setDescTab("preview")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                descTab === "preview"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Xem trước</span>
            </button>
          </div>
        </div>

        {descTab === "edit" ? (
          <div>
            <textarea
              rows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập nội dung mô tả chi tiết: công dụng, thành phần, hướng dẫn sử dụng, đối tượng khuyên dùng... (Hỗ trợ thẻ <p>, <h3>, <ul>, <li>, <strong>)"
              className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Mẹo: Bạn có thể nhập văn bản thường hoặc chèn thẻ HTML để tạo tiêu đề và danh sách gạch đầu dòng chuyên nghiệp.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 min-h-[250px] prose prose-sm max-w-none">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-slate-400 italic text-xs">Chưa có nội dung mô tả để xem trước.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Khối 5: Trạng Thái Kinh Doanh & Cấu Hình SEO ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cấu hình hiển thị */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            5.1 Trạng Thái Hiển Thị
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-wine-800 rounded focus:ring-wine-800"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Đang kinh doanh (Hiển thị bán trên website)
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Bỏ chọn nếu muốn tạm ẩn sản phẩm khỏi gian hàng khách hàng
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-amber-500 rounded focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>Sản phẩm nổi bật</span>
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Ưu tiên hiển thị tại khu vực &ldquo;Sản phẩm nổi bật&rdquo; trên trang chủ
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Tối ưu hóa SEO */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            5.2 Tối Ưu Hóa Tìm Kiếm (SEO)
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Tiêu đề SEO (Meta Title)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={name ? `${name} | THUYNGA Shop` : "Tiêu đề chuẩn SEO..."}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Mô tả SEO (Meta Description)
            </label>
            <textarea
              rows={2}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm Google..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Từ khóa SEO (Keywords)
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="hồng sâm hàn quốc, sâm kgc, thực phẩm chức năng..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-wine-800"
            />
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Actions Bar ─────────────────────────────── */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
        <Link
          href="/admin/san-pham"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại danh sách</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-wine-800 hover:bg-wine-900 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isEdit ? "Lưu Cập Nhật Sản Phẩm" : "Tạo Mới Sản Phẩm"}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
