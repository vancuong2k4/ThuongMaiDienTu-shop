"use client";

// ============================================================
// components/admin/blogs/BlogForm.tsx
// Biểu mẫu Tạo mới / Chỉnh sửa Bài Viết Cẩm Nang Chuẩn SEO & E-E-A-T
// ============================================================

import React, { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Eye,
  Edit3,
  Globe,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Lock,
  Unlock,
  Image as ImageIcon,
  BookOpen,
  FileText,
  AlertCircle,
  HelpCircle,
  Check,
  Tag,
  User,
  Calendar,
  Layers,
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  Quote,
  Table as TableIcon,
  Link2,
} from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/validations/blog";
import type { BlogItem } from "./types";

interface BlogFormProps {
  initialData?: BlogItem | null;
  mode: "create" | "edit";
}

// Hàm sinh slug từ tiếng Việt chuẩn SEO
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const BlogForm: React.FC<BlogFormProps> = ({ initialData, mode }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugLocked, setIsSlugLocked] = useState(mode === "edit");
  const [category, setCategory] = useState(
    initialData?.category || BLOG_CATEGORIES[0]
  );
  const [authorName, setAuthorName] = useState(
    initialData?.authorName || "Dược sĩ Thu Nga"
  );
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished ?? true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured ?? false
  );
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc || "");
  const [seoKeywords, setSeoKeywords] = useState(
    initialData?.seoKeywords || ""
  );

  // Content Editor Active Tab (Write or Preview)
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [serpDevice, setSerpDevice] = useState<"desktop" | "mobile">("desktop");

  // Error & Status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-generate slug when title changes (if unlocked)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugLocked) {
      setSlug(generateSlug(val));
    }
  };

  // Estimate reading time (approx 200 words / min)
  const estimatedReadingTime = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  // Insert markdown tag into content textarea
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("blog-content-area") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || "Nội dung";
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 0);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic frontend validation
    if (!title.trim() || title.length < 5) {
      setErrorMessage("Tiêu đề bài viết phải có ít nhất 5 ký tự.");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("Đường dẫn thân thiện (slug) không được để trống.");
      return;
    }
    if (!content.trim() || content.length < 50) {
      setErrorMessage("Nội dung bài viết phải có ít nhất 50 ký tự.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      authorName: authorName.trim(),
      coverImage: coverImage.trim() || null,
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      isPublished,
      isFeatured,
      seoTitle: seoTitle.trim() || null,
      seoDesc: seoDesc.trim() || null,
      seoKeywords: seoKeywords.trim() || null,
    };

    try {
      const url =
        mode === "create"
          ? "/api/admin/blogs"
          : `/api/admin/blogs/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể lưu bài viết");
      }

      setSuccessMessage(
        mode === "create"
          ? "Đã tạo bài viết cẩm nang thành công! Đang chuyển hướng..."
          : "Đã cập nhật bài viết thành công!"
      );

      startTransition(() => {
        router.refresh();
        setTimeout(() => {
          router.push("/admin/bai-viet");
        }, 800);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra";
      setErrorMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Bar Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs sticky top-4 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/bai-viet"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#800028]" />
              <span>
                {mode === "create"
                  ? "Viết Bài Cẩm Nang Sức Khỏe Mới"
                  : `Chỉnh Sửa: ${initialData?.title || ""}`}
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              {mode === "create"
                ? "Soạn thảo bài viết cẩm nang y khoa & sản phẩm chuẩn SEO E-E-A-T"
                : `Cập nhật lần cuối: ${
                    initialData?.updatedAt
                      ? new Date(initialData.updatedAt).toLocaleDateString("vi-VN")
                      : "Gần đây"
                  }`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/bai-viet"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#800028] hover:bg-[#60001e] transition-all shadow-md shadow-[#800028]/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isPending ? "Đang lưu..." : "Lưu Bài Viết"}</span>
          </button>
        </div>
      </div>

      {/* Alert Error / Success */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editor & SEO (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Thông tin cơ bản */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4 h-4 text-[#800028]" />
              <span>Tiêu Đề & Đường Dẫn</span>
            </h2>

            {/* Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="blog-title"
                className="block text-xs font-bold text-slate-700"
              >
                Tiêu đề bài viết <span className="text-rose-500">*</span>
              </label>
              <input
                id="blog-title"
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ví dụ: Top 5 Loại Vitamin Hỗ Trợ Tăng Sức Đề Kháng Mùa Đông Cho Trẻ"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Khuyến nghị từ 40 - 70 ký tự để tối ưu trên Google SERP</span>
                <span
                  className={
                    title.length > 70 ? "text-amber-600 font-semibold" : ""
                  }
                >
                  {title.length} ký tự
                </span>
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="blog-slug"
                  className="block text-xs font-bold text-slate-700"
                >
                  Đường dẫn thân thiện (Slug URL){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugLocked(!isSlugLocked)}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700"
                >
                  {isSlugLocked ? (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Đang khóa (Bấm để mở)</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-[#800028]" />
                      <span className="text-[#800028]">Tự do chỉnh sửa</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50 focus-within:ring-2 focus-within:ring-[#800028]/20 focus-within:border-[#800028]">
                <span className="px-3 py-2 text-xs text-slate-400 select-none bg-slate-100 border-r border-slate-200 font-mono">
                  /tin-tuc/
                </span>
                <input
                  id="blog-slug"
                  type="text"
                  required
                  disabled={isSlugLocked}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono text-slate-800 bg-transparent focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
                  placeholder="top-5-loai-vitamin-ho-tro-tang-suc-de-khang"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label
                htmlFor="blog-excerpt"
                className="block text-xs font-bold text-slate-700"
              >
                Đoạn tóm tắt (Excerpt)
              </label>
              <textarea
                id="blog-excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tóm tắt ngắn gọn 2 - 3 câu về giá trị bài viết đem lại cho bạn đọc..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Hiển thị trên thẻ bài viết và meta description nếu chưa điền SEO</span>
                <span>{excerpt.length} ký tự</span>
              </div>
            </div>
          </div>

          {/* Card 2: Trình Soạn Thảo Nội Dung & Live Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-3 bg-slate-50/70">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    editorTab === "write"
                      ? "bg-white text-[#800028] shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Soạn Thảo (Markdown)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    editorTab === "preview"
                      ? "bg-white text-[#800028] shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trước (Live Preview)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Khoảng {estimatedReadingTime} phút đọc</span>
              </div>
            </div>

            {/* Quick Toolbar (only in write tab) */}
            {editorTab === "write" && (
              <div className="flex items-center gap-1 px-4 py-2 bg-slate-100/70 border-b border-slate-200/80 flex-wrap text-slate-600">
                <button
                  type="button"
                  onClick={() => insertFormatting("## ", "\n")}
                  className="px-2 py-1 rounded hover:bg-white text-xs font-bold"
                  title="Tiêu đề H2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("### ", "\n")}
                  className="px-2 py-1 rounded hover:bg-white text-xs font-bold"
                  title="Tiêu đề H3"
                >
                  H3
                </button>
                <span className="w-px h-4 bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting("**", "**")}
                  className="p-1 rounded hover:bg-white"
                  title="In đậm (Bold)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("*", "*")}
                  className="p-1 rounded hover:bg-white"
                  title="In nghiêng (Italic)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <span className="w-px h-4 bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting("- ", "\n")}
                  className="p-1 rounded hover:bg-white"
                  title="Danh sách gạch đầu dòng"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("> ", "\n")}
                  className="p-1 rounded hover:bg-white"
                  title="Trích dẫn / Lời khuyên chuyên gia"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    insertFormatting(
                      "\n| Tiêu chí | Thông tin |\n|---|---|\n| Nguồn gốc | Úc / New Zealand |\n",
                      ""
                    )
                  }
                  className="p-1 rounded hover:bg-white"
                  title="Bảng dữ liệu"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("[Tiêu đề liên kết](", ")")}
                  className="p-1 rounded hover:bg-white"
                  title="Chèn link"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Content Body */}
            <div className="p-6">
              {editorTab === "write" ? (
                <div className="space-y-2">
                  <textarea
                    id="blog-content-area"
                    rows={18}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung bài viết định dạng Markdown hoặc HTML...&#10;&#10;## 1. Tầm quan trọng của dinh dưỡng...&#10;&#10;Các nghiên cứu lâm sàng chỉ ra rằng..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028] leading-relaxed resize-y"
                  />
                  <p className="text-[11px] text-slate-400">
                    Hỗ trợ định dạng Markdown đầy đủ: H2, H3, bảng, danh sách, trích dẫn chuyên gia, link sản phẩm.
                  </p>
                </div>
              ) : (
                <div className="min-h-[420px] p-6 rounded-xl bg-slate-50/50 border border-slate-200/60 prose prose-slate max-w-none">
                  {content.trim() ? (
                    <div className="space-y-4">
                      <div className="text-xs uppercase font-bold text-[#800028] tracking-wider">
                        {category}
                      </div>
                      <h1 className="text-2xl font-black text-slate-900 leading-tight">
                        {title || "Tiêu đề bài viết hiển thị tại đây"}
                      </h1>
                      <div className="flex items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-200">
                        <span>Bởi {authorName}</span>
                        <span>•</span>
                        <span>{estimatedReadingTime} phút đọc</span>
                      </div>
                      <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {content}
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
                      <BookOpen className="w-10 h-10 mb-2 opacity-40" />
                      <p className="text-sm font-medium">Chưa có nội dung để xem trước</p>
                      <p className="text-xs mt-1">Chuyển sang tab &quot;Soạn thảo&quot; để viết bài</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Cấu Hình SEO & Google SERP Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#800028]" />
                <span>Tối Ưu SEO & Mô Phỏng Google SERP</span>
              </h2>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSerpDevice("desktop")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    serpDevice === "desktop"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Máy tính
                </button>
                <button
                  type="button"
                  onClick={() => setSerpDevice("mobile")}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    serpDevice === "mobile"
                      ? "bg-white text-slate-800 shadow-xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Điện thoại
                </button>
              </div>
            </div>

            {/* Google SERP Card Preview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-sans">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                <span className="w-4 h-4 rounded-full bg-[#800028] text-white text-[9px] font-black flex items-center justify-center">
                  TN
                </span>
                <span className="text-slate-700 font-medium">thuynhangashop.vn</span>
                <span>›</span>
                <span className="text-slate-500">tin-tuc</span>
                <span>›</span>
                <span className="text-slate-500 truncate">{slug || "duong-dan-bai-viet"}</span>
              </div>
              <div className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                {seoTitle || title || "Tiêu đề bài viết hiển thị trên kết quả tìm kiếm"}
              </div>
              <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {seoDesc || excerpt || content.substring(0, 160) || "Đoạn mô tả ngắn gọn giúp người dùng Google hiểu lý do nên bấm vào đọc bài viết của Thúy Nga Shop..."}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="blog-seo-title"
                    className="block text-xs font-bold text-slate-700"
                  >
                    SEO Meta Title
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {(seoTitle || title).length}/60 ký tự
                  </span>
                </div>
                <input
                  id="blog-seo-title"
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Để trống sẽ tự động lấy Tiêu đề bài viết"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="blog-seo-desc"
                    className="block text-xs font-bold text-slate-700"
                  >
                    SEO Meta Description
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {(seoDesc || excerpt).length}/160 ký tự
                  </span>
                </div>
                <textarea
                  id="blog-seo-desc"
                  rows={2}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Để trống sẽ tự động lấy Đoạn tóm tắt (Excerpt)"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="blog-seo-keywords"
                  className="block text-xs font-bold text-slate-700"
                >
                  Từ khóa SEO (Keywords, phân cách bằng dấu phẩy)
                </label>
                <input
                  id="blog-seo-keywords"
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="vitamin tăng đề kháng, thực phẩm bổ sung úc, cẩm nang sức khỏe"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Meta, Image & Publishing (1 col) */}
        <div className="space-y-6">
          {/* Card: Xuất Bản & Trạng Thái */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Trạng Thái Xuất Bản</span>
            </h2>

            {/* Toggle isPublished */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800">
                  Công khai bài viết
                </span>
                <p className="text-[11px] text-slate-500">
                  {isPublished
                    ? "Hiển thị công khai trên website"
                    : "Lưu ở trạng thái Bản nháp"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isPublished}
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isPublished ? "bg-emerald-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle isFeatured */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Ghim bài nổi bật</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  {isFeatured
                    ? "Ghim lên Banner đầu trang cẩm nang"
                    : "Xếp theo thứ tự ngày đăng thông thường"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isFeatured}
                onClick={() => setIsFeatured(!isFeatured)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFeatured ? "bg-amber-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isFeatured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Card: Phân Loại & Tác Giả */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#800028]" />
              <span>Phân Loại & Tác Giả E-E-A-T</span>
            </h2>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label
                htmlFor="blog-category"
                className="block text-xs font-bold text-slate-700"
              >
                Chuyên mục <span className="text-rose-500">*</span>
              </label>
              <select
                id="blog-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <label
                htmlFor="blog-author"
                className="block text-xs font-bold text-slate-700"
              >
                Tác giả bài viết (E-E-A-T)
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="blog-author"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Dược sĩ Thu Nga"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Hiển thị cùng huy hiệu chuyên môn xác thực
              </p>
            </div>
          </div>

          {/* Card: Ảnh Bìa (Cover Image) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#800028]" />
              <span>Ảnh Bìa Bài Viết</span>
            </h2>

            <div className="space-y-1.5">
              <label
                htmlFor="blog-cover"
                className="block text-xs font-bold text-slate-700"
              >
                URL Hình ảnh (hoặc Unsplash/Cloudinary)
              </label>
              <input
                id="blog-cover"
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800028]/20 focus:border-[#800028]"
              />
            </div>

            {/* Preview container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt="Ảnh bìa bài viết"
                  fill
                  sizes="400px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <p className="text-xs font-medium">Chưa có ảnh bìa</p>
                  <p className="text-[10px] mt-0.5">Tỷ lệ khuyến nghị 16:9 (1200x675px)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
