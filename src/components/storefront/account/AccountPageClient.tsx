// ============================================================
// components/storefront/account/AccountPageClient.tsx
// Giao diện chính Quản lý Hồ sơ, Sổ địa chỉ & Đổi mật khẩu
// ============================================================

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AddAddressModal } from "./AddAddressModal";
import {
  User,
  MapPin,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Check,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

interface AddressItem {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

interface AccountPageClientProps {
  initialUser: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
  };
  initialAddresses: AddressItem[];
}

export const AccountPageClient: React.FC<AccountPageClientProps> = ({
  initialUser,
  initialAddresses,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "password">("profile");

  // Profile Form State
  const [name, setName] = useState(initialUser.name || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Address State
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addressActionId, setAddressActionId] = useState<string | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 1. Cập nhật hồ sơ
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setIsUpdatingProfile(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể cập nhật hồ sơ");

      setProfileMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      router.refresh();
    } catch (err: unknown) {
      setProfileMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Đã có lỗi xảy ra",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // 2. Tải lại danh sách địa chỉ sau khi thêm/sửa
  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      const data = await res.json();
      if (data.addresses) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Đặt địa chỉ làm mặc định
  const handleSetDefaultAddress = async (id: string) => {
    setAddressActionId(id);
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddressActionId(null);
    }
  };

  // Xóa địa chỉ
  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ nhận hàng này?")) return;
    setAddressActionId(id);
    try {
      const res = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Không thể xóa địa chỉ");
        return;
      }
      await fetchAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      setAddressActionId(null);
    }
  };

  // 3. Đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới phải có tối thiểu 8 ký tự." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Mật khẩu xác nhận không trùng khớp." });
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể đổi mật khẩu");

      setPasswordMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Đã có lỗi xảy ra",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-100 bg-neutral-50/50 p-2 gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "profile"
              ? "bg-white text-[#800028] shadow-xs border border-neutral-200/80"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Hồ sơ cá nhân</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "addresses"
              ? "bg-white text-[#800028] shadow-xs border border-neutral-200/80"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Sổ địa chỉ ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "password"
              ? "bg-white text-[#800028] shadow-xs border border-neutral-200/80"
              : "text-neutral-600 hover:text-neutral-900 hover:bg-white/50"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Đổi mật khẩu</span>
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* TAB 1: HỒ SƠ CÁ NHÂN */}
        {activeTab === "profile" && (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Thông tin tài khoản
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Quản lý tên hiển thị và thông tin liên hệ của bạn tại THUYNGA Shop.
              </p>
            </div>

            {profileMessage && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                  profileMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {profileMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Họ và tên hiển thị
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isUpdatingProfile}
                    className="w-full h-11 pl-10 pr-3.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028]"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Địa chỉ Email (Định danh tài khoản)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={initialUser.email}
                    disabled
                    className="w-full h-11 pl-10 pr-3.5 text-xs bg-neutral-100/80 border border-neutral-200 text-neutral-500 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Số điện thoại nhận hàng
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Chưa cập nhật số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isUpdatingProfile}
                    className="w-full h-11 pl-10 pr-3.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#800028] hover:bg-[#60001e] text-white font-bold text-xs shadow-md shadow-[#800028]/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu thay đổi...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SỔ ĐỊA CHỈ NHẬN HÀNG */}
        {activeTab === "addresses" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-neutral-100 gap-3">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Địa chỉ nhận hàng của bạn
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Lưu nhiều địa chỉ để đặt hàng nhanh chóng mà không cần nhập lại.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800028] hover:bg-[#60001e] text-white font-bold text-xs transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm địa chỉ mới</span>
              </button>
            </div>

            {/* Danh sách địa chỉ */}
            {addresses.length === 0 ? (
              <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                <MapPin className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-700">
                  Bạn chưa có địa chỉ nhận hàng nào
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Hãy thêm địa chỉ để thanh toán đơn hàng thuận tiện nhất.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      addr.isDefault
                        ? "border-[#800028] bg-rose-50/20 shadow-xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900">
                          {addr.fullName}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#800028] text-white">
                            Mặc định
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-neutral-400">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          disabled={addressActionId === addr.id}
                          className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                          title="Xóa địa chỉ này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 mb-1">
                      <span className="text-neutral-400">Điện thoại:</span> {addr.phone}
                    </p>

                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.province}
                    </p>

                    {!addr.isDefault && (
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          disabled={addressActionId === addr.id}
                          className="text-xs font-semibold text-[#800028] hover:underline cursor-pointer"
                        >
                          {addressActionId === addr.id
                            ? "Đang cập nhật..."
                            : "Thiết lập làm mặc định"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Modal thêm địa chỉ */}
            <AddAddressModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSuccess={fetchAddresses}
            />
          </div>
        )}

        {/* TAB 3: ĐỔI MẬT KHẨU */}
        {activeTab === "password" && (
          <div className="max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Bảo mật & Đổi mật khẩu
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
              </p>
            </div>

            {passwordMessage && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
                  passwordMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Mật khẩu hiện tại */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu đang dùng"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                    className="w-full h-11 pl-10 pr-10 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mật khẩu mới (Tối thiểu 8 ký tự) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                    className="w-full h-11 pl-10 pr-10 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028]"
                  />
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Xác nhận lại mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isChangingPassword}
                    className="w-full h-11 pl-10 pr-10 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#800028] focus:ring-1 focus:ring-[#800028]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-6 py-2.5 rounded-xl bg-[#800028] hover:bg-[#60001e] text-white font-bold text-xs shadow-md shadow-[#800028]/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Cập nhật mật khẩu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
