import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Star } from "lucide-react";

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kiểm Duyệt Đánh Giá Khách Hàng"
        description="Kiểm duyệt bình luận, số sao và hình ảnh đánh giá từ khách hàng."
        breadcrumbs={[{ label: "Đánh giá" }]}
      />
      <AdminCard>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Phân hệ Kiểm Duyệt Đánh Giá (Module 6.8)
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            Module 6.8 sẽ bao gồm: Bảng danh sách đánh giá chờ duyệt (PENDING), phê duyệt công khai (APPROVED) hoặc từ chối (REJECTED), và phản hồi đánh giá của khách hàng.
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
