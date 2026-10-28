import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Users } from "lucide-react";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Khách Hàng"
        description="Danh sách người dùng, thống kê đơn mua, kích hoạt hoặc khóa tài khoản."
        breadcrumbs={[{ label: "Khách hàng" }]}
      />
      <AdminCard>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Phân hệ Quản Lý Khách Hàng (Module 6.7)
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Module 6.7 sẽ bao gồm: Bảng danh sách thành viên khách hàng, xem tổng chi tiêu, tổng số đơn hàng đã đặt, thông tin liên hệ và tính năng khóa/mở khóa tài khoản an toàn.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
