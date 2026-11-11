// ============================================================
// components/admin/aircargo/types.ts
// Định nghĩa kiểu dữ liệu Quản trị Lô hàng & Vận đơn Air-Cargo (Phase 15)
// ============================================================

import { AirlineCarrier, ShipmentStatus } from "@prisma/client";

export interface AirCargoShipmentItem {
  id: string;
  shipmentNumber: string;
  airWaybillNumber: string;
  carrier: AirlineCarrier;
  flightNumber: string;
  originAirport: string;
  destinationAirport: string;
  departureDate: string;
  arrivalDate: string;
  status: ShipmentStatus;
  storageTempMin: number;
  storageTempMax: number;
  temperatureLog: Array<{
    timestamp: string;
    temperature: number;
    note?: string;
  }> | null;
  receiptImages: string[];
  customsDocImages: string[];
  notes: string | null;
  batches?: Array<{
    id: string;
    batchCode: string;
    product: {
      name: string;
      slug: string;
    };
  }>;
  _count?: {
    batches: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductBatchItem {
  id: string;
  batchCode: string;
  productId: string;
  variantId: string | null;
  shipmentId: string;
  manufactureDate: string;
  expiryDate: string;
  importedQuantity: number;
  remainingStock: number;
  australianBarcode: string | null;
  chemistSource: string | null;
  certificateUrl: string | null;
  isActive: boolean;
  product: {
    id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string }>;
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
    flightNumber: string;
    departureDate: string;
    arrivalDate: string;
    status: ShipmentStatus;
  };
  _count?: {
    verificationLogs: number;
  };
  createdAt: string;
}

export interface AirCargoKPIs {
  totalShipments: number;
  totalBatches: number;
  activeBatches: number;
  inTransitShipments: number;
  totalVerifications: number;
}
