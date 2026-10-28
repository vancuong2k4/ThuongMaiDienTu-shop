import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cài Đặt Hệ Thống & Cửa Hàng"
        description="Cấu hình thông tin cửa hàng, tài khoản ngân hàng nhận tiền VietQR và phí vận chuyển."
        breadcrumbs={[{ label: "Cài đặt" }]}
      />
      <AdminCard>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Phân hệ Cài Đặt Hệ Thống (Module 6.9)
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Module 6.9 sẽ bao gồm: Cấu hình thông tin thương hiệu THUYNGA Shop, Hotline, Địa chỉ kho hàng, Số tài khoản ngân hàng thụ hưởng VietQR Napas 24/7 và Mức phí vận chuyển mặc định / freeship.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
