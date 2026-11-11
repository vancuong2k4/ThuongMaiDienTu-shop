// ============================================================
// app/(admin)/admin/kho-hang/lo-hang-air/page.tsx
// Trang Quản Trị Lô Hàng Bay Air & Minh Bạch Hạn Sử Dụng (Phase 15)
// ============================================================

import React from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { AirCargoManager } from "@/components/admin/aircargo/AirCargoManager";
import { prisma } from "@/lib/prisma";
import { calculateAirCargoKPIs } from "@/lib/aircargo";
import { AirCargoShipmentItem, ProductBatchItem } from "@/components/admin/aircargo/types";

export const metadata = {
  title: "Quản Trị Lô Hàng Bay Air & Vận Đơn AWB | THUYNGA Shop Admin",
  description:
    "Quản lý số vận đơn AWB, hành trình chuyến bay air-cargo Úc, nhiệt độ khoang mát và mã lô sản phẩm khóa hạn sử dụng.",
};

export const revalidate = 0;

export default async function AdminAirCargoPage() {
  const [kpis, rawShipments, rawBatches] = await Promise.all([
    calculateAirCargoKPIs(),
    prisma.airCargoShipment.findMany({
      take: 20,
      orderBy: { departureDate: "desc" },
      include: {
        batches: {
          select: {
            id: true,
            batchCode: true,
            product: { select: { name: true, slug: true } },
          },
        },
        _count: {
          select: { batches: true },
        },
      },
    }),
    prisma.productBatch.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: {
              take: 1,
              orderBy: { sortOrder: "asc" },
              select: { url: true },
            },
          },
        },
        variant: {
          select: { id: true, name: true, sku: true },
        },
        shipment: {
          select: {
            id: true,
            shipmentNumber: true,
            airWaybillNumber: true,
            carrier: true,
            flightNumber: true,
            departureDate: true,
            arrivalDate: true,
            status: true,
          },
        },
        _count: {
          select: { verificationLogs: true },
        },
      },
    }),
  ]);

  // Chuẩn hóa dữ liệu sang string JSON-safe cho Client Component
  const initialShipments: AirCargoShipmentItem[] = rawShipments.map((s) => ({
    id: s.id,
    shipmentNumber: s.shipmentNumber,
    airWaybillNumber: s.airWaybillNumber,
    carrier: s.carrier,
    flightNumber: s.flightNumber,
    originAirport: s.originAirport,
    destinationAirport: s.destinationAirport,
    departureDate: s.departureDate.toISOString(),
    arrivalDate: s.arrivalDate.toISOString(),
    status: s.status,
    storageTempMin: s.storageTempMin,
    storageTempMax: s.storageTempMax,
    temperatureLog: s.temperatureLog as any,
    receiptImages: s.receiptImages,
    customsDocImages: s.customsDocImages,
    notes: s.notes,
    batches: s.batches,
    _count: s._count,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  const initialBatches: ProductBatchItem[] = rawBatches.map((b) => ({
    id: b.id,
    batchCode: b.batchCode,
    productId: b.productId,
    variantId: b.variantId,
    shipmentId: b.shipmentId,
    manufactureDate: b.manufactureDate.toISOString(),
    expiryDate: b.expiryDate.toISOString(),
    importedQuantity: b.importedQuantity,
    remainingStock: b.remainingStock,
    australianBarcode: b.australianBarcode,
    chemistSource: b.chemistSource,
    certificateUrl: b.certificateUrl,
    isActive: b.isActive,
    product: b.product,
    variant: b.variant,
    shipment: {
      id: b.shipment.id,
      shipmentNumber: b.shipment.shipmentNumber,
      airWaybillNumber: b.shipment.airWaybillNumber,
      carrier: b.shipment.carrier,
      flightNumber: b.shipment.flightNumber,
      departureDate: b.shipment.departureDate.toISOString(),
      arrivalDate: b.shipment.arrivalDate.toISOString(),
      status: b.shipment.status,
    },
    _count: b._count,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quản Trị Lô Hàng Bay Air & Minh Bạch HSD"
        description="Theo dõi toàn bộ vận đơn hàng không (AWB), lộ trình chuyến bay, nhiệt độ khoang mát 18-24°C và hóa đơn mua hàng Chemist Warehouse Úc."
        breadcrumbs={[
          { label: "Kho hàng", href: "/admin/kho-hang" },
          { label: "Lô hàng bay Air" },
        ]}
      />
      <AirCargoManager
        initialKpis={kpis}
        initialShipments={initialShipments}
        initialBatches={initialBatches}
      />
    </div>
  );
}
