import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { FolderTree } from "lucide-react";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Danh Mục Ngành Hàng"
        description="Thêm, sửa, xóa và sắp xếp thứ tự danh mục sản phẩm trên website."
        breadcrumbs={[{ label: "Danh mục" }]}
      />
      <AdminCard>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-4">
            <FolderTree className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Phân hệ Quản Lý Danh Mục (Module 6.4)
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Module 6.4 sẽ bao gồm: Quản lý cây danh mục sản phẩm, slug tự động chuẩn SEO, icon danh mục, ảnh banner ngành hàng và bật/tắt hiển thị trên Storefront.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
