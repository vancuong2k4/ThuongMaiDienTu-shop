import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Tag } from "lucide-react";

export default function AdminVouchersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Lý Mã Giảm Giá (Voucher)"
        description="Tạo và quản lý các chương trình khuyến mãi, voucher giảm giá cho khách hàng."
        breadcrumbs={[{ label: "Mã giảm giá" }]}
      />
      <AdminCard>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Phân hệ Quản Lý Khuyến Mãi & Voucher (Module 6.6)
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Module 6.6 sẽ bao gồm: Tạo mã coupon ngẫu nhiên hoặc tự chọn, giảm theo % hoặc số tiền cố định, giá trị đơn tối thiểu, số lượt sử dụng tối đa và thời hạn hiệu lực.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
