"use client";

import { useState } from "react";
import { FileText, Table, Truck, ShieldCheck, CheckCircle } from "lucide-react";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface ProductTabsProps {
  product: {
    name: string;
    description: string | null;
    brand: string | null;
    origin: string | null;
    specification: string | null;
    expiryInfo: string | null;
    category: {
      name: string;
    };
  };
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping">(
    "desc"
  );

  const tabs = [
    { id: "desc", label: "Mô tả chi tiết & Công dụng", icon: FileText },
    { id: "specs", label: "Thông số & Hạn sử dụng", icon: Table },
    { id: "shipping", label: "Vận chuyển & Đổi trả", icon: Truck },
  ] as const;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── 1. Tab Headers ─────────────────────────────────────────── */}
      <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide bg-gray-50/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
                isActive
                  ? "border-[#800028] text-[#800028] bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 2. Tab Contents ────────────────────────────────────────── */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: Mô tả chi tiết */}
        {activeTab === "desc" && (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
            {product.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="space-y-3"
              />
            ) : (
              <p>Thông tin chi tiết về sản phẩm đang được cập nhật.</p>
            )}

            <div className="p-4 rounded-2xl bg-[#fff0f3] border border-rose-100 space-y-2 mt-6">
              <h4 className="font-bold text-[#800028] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#800028]" />
                <span>Cam kết chất lượng tại THUYNGA Shop</span>
              </h4>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                <li>100% Sản phẩm nhập khẩu chính ngạch, có giấy tờ hải quan và hóa đơn đầy đủ.</li>
                <li>Hạn sử dụng (Date) luôn là lô sản xuất mới nhất từ hãng, không bán hàng cận date.</li>
                <li>Đổi trả miễn phí trong 7 ngày nếu bao bì bị rách, móp méo hoặc có lỗi từ nhà sản xuất.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Thông số kỹ thuật & Hạn sử dụng */}
        {activeTab === "specs" && (
          <div className="max-w-2xl">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-gray-50/50">
                  <td className="py-3 px-4 font-bold text-gray-500 w-1/3">
                    Tên sản phẩm
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {product.name}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-500">
                    Ngành hàng
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {product.category.name}
                  </td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="py-3 px-4 font-bold text-gray-500">
                    Thương hiệu
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {product.brand || "Chính hãng"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-500">
                    Xuất xứ
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    <span className="inline-flex items-center gap-2">
                      <CountryFlag country={product.origin} className="w-5 h-3.5 rounded-2xs" />
                      <span>{product.origin || "Nhập khẩu chính hãng"}</span>
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="py-3 px-4 font-bold text-gray-500">
                    Quy cách đóng gói
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {product.specification || "Đóng gói tiêu chuẩn xuất khẩu"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-500">
                    Hạn sử dụng (Date)
                  </td>
                  <td className="py-3 px-4 font-bold text-[#800028]">
                    {product.expiryInfo || "Date xa mới nhất từ hãng"}
                  </td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="py-3 px-4 font-bold text-gray-500">
                    Điều kiện bảo quản
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp (Đối với trái cây: bảo quản ngăn mát tủ lạnh 2-6°C).
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-gray-500">
                    Lưu ý pháp lý
                  </td>
                  <td className="py-3 px-4 text-amber-800 font-medium">
                    Tuyệt đối không kinh doanh thuốc kê đơn. Thực phẩm chức năng không phải là thuốc.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Vận chuyển & Đổi trả */}
        {activeTab === "shipping" && (
          <div className="space-y-4 text-xs text-gray-700 leading-relaxed max-w-2xl">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-gray-900">
                1. Quy trình giao nhận hàng hóa
              </h4>
              <p>
                - <strong>Nội thành Hà Nội:</strong> Giao hàng hỏa tốc trong 2-4 giờ đối với trái cây tươi và thực phẩm nhập khẩu.
              </p>
              <p>
                - <strong>Các tỉnh thành toàn quốc:</strong> Giao hàng từ 1-3 ngày làm việc thông qua đối tác vận chuyển chuyên nghiệp (Viettel Post, GHTK, EMS).
              </p>
              <p>
                - <strong>Đóng gói chuyên dụng:</strong> Trái cây tươi được đóng trong hộp xốp cách nhiệt kèm túi đá gel bảo quản. Thực phẩm chức năng & mỹ phẩm được bọc màng xốp chống sốc 3 lớp.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="font-bold text-sm text-gray-900">
                2. Chính sách đồng kiểm & Đổi trả trong 7 ngày
              </h4>
              <p>
                - Khách hàng có quyền <strong>kiểm tra hàng trước khi thanh toán</strong> (đối với đơn COD) hoặc trước khi ký nhận bưu tá.
              </p>
              <p>
                - Hỗ trợ đổi mới hoặc hoàn tiền 100% trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng nếu sản phẩm bị hư hỏng, dập nát, giao sai phân loại hoặc có lỗi phát sinh từ nhà cung cấp.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
