// ============================================================
// app/(storefront)/tai-khoan/don-dat-truoc/page.tsx
// Danh Sách Đơn Đặt Hàng Trước Mùa Vụ Úc Của Khách Hàng (Phase 21)
// ============================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Plane,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Package,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Đơn Đặt Trước Mùa Vụ Úc Của Tôi | THUYNGA Shop",
  description:
    "Theo dõi tiến độ đơn đặt cọc Cherry Tasmania, Mật ong Manuka và slot khoang lạnh máy bay của bạn.",
};

export const revalidate = 0;

export default async function UserPreOrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/dang-nhap?callbackUrl=/tai-khoan/don-dat-truoc");
  }

  const userEmail = session.user.email || "";
  const userId = session.user.id;

  const reservations = await prisma.preOrderReservation.findMany({
    where: {
      OR: [
        { userId },
        ...(userEmail ? [{ customerEmail: userEmail }] : []),
      ],
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      campaign: {
        select: {
          title: true,
          slug: true,
          farmName: true,
          farmRegion: true,
          flightDepartureWeek: true,
          bannerImage: true,
        },
      },
      tier: {
        select: {
          name: true,
          specification: true,
          price: true,
        },
      },
    },
  });

  const formatVND = (n: number | any) => {
    return new Intl.NumberFormat("vi-VN").format(Number(n)) + "₫";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED_DEPOSIT":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          label: "Đã cọc thành công",
        };
      case "ALLOCATED_FLIGHT":
        return {
          bg: "bg-sky-50 text-sky-800 border-sky-200",
          label: "Đã xếp chuyến bay Air",
        };
      case "SHIPPED":
        return {
          bg: "bg-indigo-50 text-indigo-800 border-indigo-200",
          label: "Đang giao tận nhà",
        };
      case "COMPLETED":
        return {
          bg: "bg-purple-50 text-purple-800 border-purple-200",
          label: "Đã hoàn thành",
        };
      case "CANCELLED":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-200",
          label: "Đã hủy & hoàn tiền",
        };
      default:
        return {
          bg: "bg-slate-50 text-slate-700 border-slate-200",
          label: "Đang xử lý",
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-6">
      {/* Title */}
      <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Đơn Đặt Trước Mùa Vụ Úc
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi tình trạng đặt cọc, đợt thu hoạch tại nông trường và chuyến bay Air Cargo
          </p>
        </div>

        <Link
          href="/dat-truoc-mua-vu"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#800028] text-white font-bold text-xs transition-colors flex items-center gap-1.5"
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Khám phá vụ mùa mới</span>
        </Link>
      </div>

      {/* List */}
      {reservations.length === 0 ? (
        <div className="p-10 text-center space-y-3 bg-neutral-50 rounded-2xl border border-neutral-200/60">
          <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 flex items-center justify-center mx-auto shadow-xs">
            <Plane className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            Bạn chưa có đơn đặt trước mùa vụ nào
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Đặt cọc trước các đợt Cherry Tasmania tuyển chọn đón Tết Nguyên Đán hoặc Mật ong Manuka Hoàng gia để giữ slot bay Air 24h.
          </p>
          <Link
            href="/dat-truoc-mua-vu"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800028] text-white font-bold text-xs hover:bg-[#660020] transition-colors mt-2"
          >
            <span>Xem chiến dịch mùa vụ</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => {
            const badge = getStatusBadge(res.status);

            return (
              <div
                key={res.id}
                className="bg-neutral-50/70 hover:bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 transition-colors space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200/70">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#800028]">
                      {res.reservationCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Ngày đặt: {new Date(res.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Campaign & Farm */}
                  <div className="md:col-span-2 space-y-1">
                    <Link
                      href={`/dat-truoc-mua-vu/${res.campaign.slug}`}
                      className="font-bold text-sm text-slate-900 hover:text-[#800028] transition-colors block"
                    >
                      {res.campaign.title}
                    </Link>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{res.campaign.farmName}</span>
                    </p>
                    <div className="pt-1 text-slate-700">
                      Quy cách:{" "}
                      <strong className="text-slate-900 font-bold">
                        {res.tier.name} (x{res.quantity})
                      </strong>
                    </div>
                    <div className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
                      <Plane className="w-3 h-3 text-sky-600" />
                      <span>Dự kiến bay: {res.campaign.flightDepartureWeek}</span>
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1.5">
                    <div className="flex justify-between text-slate-500">
                      <span>Đã cọc:</span>
                      <strong className="font-mono font-black text-emerald-700">
                        {formatVND(res.depositPaid)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tổng tiền:</span>
                      <strong className="font-mono text-slate-800">
                        {formatVND(res.totalPrice)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-500 pt-1 border-t border-neutral-100">
                      <span>Còn lại:</span>
                      <strong className="font-mono font-bold text-[#800028]">
                        {formatVND(res.remainingAmount)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Flight tracking integration */}
                {res.flightNumber && (
                  <div className="pt-2 border-t border-neutral-200/70 flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Đã xếp chỗ khoang lạnh chuyến bay{" "}
                        <strong className="font-mono text-[#800028]">
                          {res.flightNumber}
                        </strong>
                      </span>
                    </span>

                    <Link
                      href={`/tra-cuu-air-cargo/${res.flightNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 hover:underline"
                    >
                      <span>Xem Radar Chuyến Bay</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
