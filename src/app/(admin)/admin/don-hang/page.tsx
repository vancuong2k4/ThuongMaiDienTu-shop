import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { ShoppingBag } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Đơn Hàng"
        description="Xem danh sách, tìm kiếm, lọc theo trạng thái và cập nhật tiến trình đơn hàng."
        breadcrumbs={[{ label: "Đơn hàng" }]}
      />
      <AdminCard>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Phân hệ Quản Lý Đơn Hàng (Module 6.5)
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Module 6.5 sẽ bao gồm: Bảng dữ liệu đơn hàng phân trang, lọc trạng thái (Chờ xác nhận, Đang giao, Đã giao...), xem chi tiết đơn, in vận đơn, và cập nhật trạng thái đơn hàng.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
