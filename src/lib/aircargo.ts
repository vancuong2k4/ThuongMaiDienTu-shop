// ============================================================
// lib/aircargo.ts
// Nghiệp vụ Tra Cứu Vận Đơn Air-Cargo & Quản Lý Mã Lô (Phase 15)
// ============================================================

import { prisma } from "@/lib/prisma";
import { ShipmentStatus, AirlineCarrier } from "@prisma/client";
import {
  AIRLINE_CARRIERS_CONFIG,
  SHIPMENT_STATUS_CONFIG,
} from "@/lib/validations/batch";

export interface BatchVerificationResult {
  found: boolean;
  batch?: {
    id: string;
    batchCode: string;
    manufactureDate: string;
    expiryDate: string;
    monthsRemaining: number;
    freshnessBadge: string;
    australianBarcode: string | null;
    chemistSource: string | null;
    certificateUrl: string | null;
    importedQuantity: number;
    remainingStock: number;
    isActive: boolean;
    product: {
      id: string;
      name: string;
      slug: string;
      image: string | null;
    };
    variant: {
      id: string;
      name: string;
      sku: string;
    } | null;
    shipment: {
      id: string;
      shipmentNumber: string;
      airWaybillNumber: string;
      carrier: AirlineCarrier;
      carrierInfo: (typeof AIRLINE_CARRIERS_CONFIG)[keyof typeof AIRLINE_CARRIERS_CONFIG];
      flightNumber: string;
      originAirport: string;
      destinationAirport: string;
      departureDate: string;
      arrivalDate: string;
      status: ShipmentStatus;
      statusInfo: (typeof SHIPMENT_STATUS_CONFIG)[keyof typeof SHIPMENT_STATUS_CONFIG];
      storageTempMin: number;
      storageTempMax: number;
      temperatureLog: any;
      receiptImages: string[];
      customsDocImages: string[];
      notes: string | null;
    };
  };
}

/**
 * Tra cứu mã lô hàng hóa (Batch Code) & Ghi nhật ký xác thực
 */
export async function verifyBatchByCode(
  batchCode: string,
  clientInfo?: { ip?: string; userAgent?: string }
): Promise<BatchVerificationResult> {
  const cleanCode = batchCode.trim();

  const batch = await prisma.productBatch.findFirst({
    where: {
      batchCode: {
        equals: cleanCode,
        mode: "insensitive",
      },
    },
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
        select: {
          id: true,
          name: true,
          sku: true,
        },
      },
      shipment: true,
    },
  });

  if (!batch) {
    return { found: false };
  }

  // Ghi nhật ký tra cứu bất đồng bộ
  try {
    await prisma.batchVerificationLog.create({
      data: {
        batchId: batch.id,
        batchCode: batch.batchCode,
        ipAddress: clientInfo?.ip || null,
        userAgent: clientInfo?.userAgent || null,
      },
    });
  } catch (err) {
    console.error("Lỗi ghi nhận BatchVerificationLog:", err);
  }

  // Tính số tháng còn lại đến khi hết hạn
  const today = new Date();
  const exp = new Date(batch.expiryDate);
  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthsRemaining = Math.max(0, Math.floor(diffDays / 30));

  let freshnessBadge = "Còn hạn sử dụng";
  if (monthsRemaining >= 20) {
    freshnessBadge = `Date mới tinh (Còn ${monthsRemaining} tháng HSD)`;
  } else if (monthsRemaining >= 12) {
    freshnessBadge = `Date rất xa (Còn ${monthsRemaining} tháng HSD)`;
  } else if (monthsRemaining > 0) {
    freshnessBadge = `Còn ${monthsRemaining} tháng HSD`;
  } else {
    freshnessBadge = "Đã hết hạn sử dụng";
  }

  const carrierInfo =
    AIRLINE_CARRIERS_CONFIG[batch.shipment.carrier] ||
    AIRLINE_CARRIERS_CONFIG.VIETNAM_AIRLINES_CARGO;

  const statusInfo =
    SHIPMENT_STATUS_CONFIG[batch.shipment.status] ||
    SHIPMENT_STATUS_CONFIG.IN_WAREHOUSE;

  return {
    found: true,
    batch: {
      id: batch.id,
      batchCode: batch.batchCode,
      manufactureDate: batch.manufactureDate.toISOString(),
      expiryDate: batch.expiryDate.toISOString(),
      monthsRemaining,
      freshnessBadge,
      australianBarcode: batch.australianBarcode,
      chemistSource: batch.chemistSource,
      certificateUrl: batch.certificateUrl,
      importedQuantity: batch.importedQuantity,
      remainingStock: batch.remainingStock,
      isActive: batch.isActive,
      product: {
        id: batch.product.id,
        name: batch.product.name,
        slug: batch.product.slug,
        image: batch.product.images[0]?.url || null,
      },
      variant: batch.variant,
      shipment: {
        id: batch.shipment.id,
        shipmentNumber: batch.shipment.shipmentNumber,
        airWaybillNumber: batch.shipment.airWaybillNumber,
        carrier: batch.shipment.carrier,
        carrierInfo,
        flightNumber: batch.shipment.flightNumber,
        originAirport: batch.shipment.originAirport,
        destinationAirport: batch.shipment.destinationAirport,
        departureDate: batch.shipment.departureDate.toISOString(),
        arrivalDate: batch.shipment.arrivalDate.toISOString(),
        status: batch.shipment.status,
        statusInfo,
        storageTempMin: batch.shipment.storageTempMin,
        storageTempMax: batch.shipment.storageTempMax,
        temperatureLog: batch.shipment.temperatureLog,
        receiptImages: batch.shipment.receiptImages,
        customsDocImages: batch.shipment.customsDocImages,
        notes: batch.shipment.notes,
      },
    },
  };
}

/**
 * Lấy lô hàng bay Air mới nhất của một sản phẩm để hiển thị huy hiệu trên Product Page
 */
export async function getLatestBatchForProduct(productId: string) {
  const batch = await prisma.productBatch.findFirst({
    where: {
      productId,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
    include: {
      shipment: {
        select: {
          airWaybillNumber: true,
          carrier: true,
          flightNumber: true,
          arrivalDate: true,
          storageTempMin: true,
          storageTempMax: true,
        },
      },
    },
  });

  if (!batch) return null;

  const today = new Date();
  const exp = new Date(batch.expiryDate);
  const monthsRemaining = Math.max(
    0,
    Math.floor((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
  );

  return {
    batchCode: batch.batchCode,
    expiryDate: batch.expiryDate.toISOString(),
    monthsRemaining,
    chemistSource: batch.chemistSource,
    australianBarcode: batch.australianBarcode,
    airWaybillNumber: batch.shipment.airWaybillNumber,
    flightNumber: batch.shipment.flightNumber,
    carrier: batch.shipment.carrier,
    arrivalDate: batch.shipment.arrivalDate.toISOString(),
    storageTemp: `${batch.shipment.storageTempMin}°C - ${batch.shipment.storageTempMax}°C`,
  };
}

/**
 * Thống kê KPI tổng quan vận hành lô hàng bay air cho Admin CMS
 */
export async function calculateAirCargoKPIs() {
  const [
    totalShipments,
    totalBatches,
    activeBatches,
    inTransitShipments,
    totalVerifications,
  ] = await Promise.all([
    prisma.airCargoShipment.count(),
    prisma.productBatch.count(),
    prisma.productBatch.count({ where: { isActive: true } }),
    prisma.airCargoShipment.count({
      where: {
        status: { in: [ShipmentStatus.DEPARTED, ShipmentStatus.IN_TRANSIT] },
      },
    }),
    prisma.batchVerificationLog.count(),
  ]);

  return {
    totalShipments,
    totalBatches,
    activeBatches,
    inTransitShipments,
    totalVerifications,
  };
}
