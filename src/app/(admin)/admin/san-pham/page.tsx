import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Package } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Sản Phẩm & Tồn Kho"
        description="Thêm mới sản phẩm, sửa giá bán, tải ảnh sản phẩm, quản lý số lượng tồn kho."
        breadcrumbs={[{ label: "Sản phẩm" }]}
      />
      <AdminCard>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Phân hệ Quản Lý Sản Phẩm & Kho Hàng (Module 6.3)
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Module 6.3 sẽ bao gồm: Bảng danh sách sản phẩm, bộ lọc ngành hàng, tìm kiếm tên/SKU, Form tạo mới/chỉnh sửa sản phẩm, upload ảnh, cài đặt thuộc tính và cảnh báo hết hàng tồn kho.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
