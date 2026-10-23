import Link from "next/link";
import {
  ShieldCheck,
  Plane,
  HeartHandshake,
  CheckCircle,
  PhoneCall,
  AlertTriangle,
} from "lucide-react";

export function BrandCommitmentSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-[#fff0f3]/50">
      <div className="shop-container">
        <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Cột trái: Giới thiệu & Triết lý */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff0f3] text-[#800028] text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cam kết chất lượng từ tâm</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                THUYNGA Shop – Địa Chỉ Mua Sắm Hàng Nhập Khẩu Đáng Tin Cậy
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Với hơn 5 năm phục vụ khách hàng trên toàn quốc, THUYNGA Shop tự hào mang đến các sản phẩm Thực phẩm chức năng, Trái cây tươi bay hàng không, Thực phẩm dinh dưỡng và Mỹ phẩm nhập khẩu trực tiếp từ Hàn Quốc, Nhật Bản, Mỹ, Úc với quy trình kiểm định chất lượng khắt khe nhất.
              </p>

              {/* Cam kết quan trọng */}
              <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>100% Nguồn gốc rõ ràng:</strong> Đầy đủ hóa đơn, tem phụ và chứng nhận an toàn thực phẩm.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Plane className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Hàng bay Air Cargo 48h:</strong> Giữ trọn độ tươi giòn và dinh dưỡng cho trái cây tươi nhập khẩu.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-[#800028] shrink-0 mt-0.5" />
                  <span><strong>Nguyên tắc vàng:</strong> Tuyệt đối KHÔNG kinh doanh thuốc kê đơn. Đặt sức khỏe và sự an tâm của khách hàng lên hàng đầu.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href="tel:0987654321"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#800028] hover:bg-[#5c001e] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Tư vấn trực tiếp: 0987.654.321</span>
                </a>
                <Link
                  href="/chinh-sach/chinh-sach-doi-tra"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm transition-colors"
                >
                  <span>Chính sách bảo hành & Đổi trả</span>
                </Link>
              </div>
            </div>

            {/* Cột phải: 4 Trụ cột giá trị */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
                <span className="text-3xl font-black text-[#800028]">200%</span>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 mt-2">Bồi thường hàng giả</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Cam kết tuyệt đối về chất lượng và độ chuẩn xác của xuất xứ hàng hóa.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
                <span className="text-3xl font-black text-amber-600">48h</span>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 mt-2">Air Cargo trái cây</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Vận chuyển hàng không tươi mới, cuống xanh, giòn ngọt trọn vẹn.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
                <span className="text-3xl font-black text-blue-600">7 Ngày</span>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 mt-2">Đổi trả linh hoạt</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Hỗ trợ đổi trả nhanh chóng nếu phát sinh lỗi từ nhà sản xuất.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
                <span className="text-3xl font-black text-emerald-600">24/7</span>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 mt-2">Tư vấn tận tâm</h4>
                <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                  Hỗ trợ tư vấn cách dùng, liều lượng và bảo quản đúng chuẩn y khoa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
