"use client";

// ============================================================
// components/admin/settings/SettingsManager.tsx
// Trình Quản Lý & Điều Phối Cài Đặt Hệ Thống
// ============================================================

import React, { useState } from "react";
import { Store, CreditCard, Truck, Search } from "lucide-react";
import { BrandSettingsForm } from "./BrandSettingsForm";
import { VietQRSettingsForm } from "./VietQRSettingsForm";
import { ShippingSettingsForm } from "./ShippingSettingsForm";
import { SeoSettingsForm } from "./SeoSettingsForm";
import type {
  SettingsTabType,
  AllSettingsValues,
  SiteConfigValues,
  VietQRConfigValues,
  ShippingConfigValues,
  SeoConfigValues,
} from "./types";

interface SettingsManagerProps {
  initialSettings: AllSettingsValues;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  initialSettings,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>("brand");
  const [settings, setSettings] = useState<AllSettingsValues>(initialSettings);

  const handleSaveSection = async (key: string, data: any) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data }),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Không thể lưu cài đặt");
    }
  };

  const tabs = [
    { id: "brand" as SettingsTabType, label: "Thông Tin Cửa Hàng", icon: Store },
    { id: "vietqr" as SettingsTabType, label: "VietQR Napas 24/7", icon: CreditCard },
    { id: "shipping" as SettingsTabType, label: "Vận Chuyển & Freeship", icon: Truck },
    { id: "seo" as SettingsTabType, label: "SEO & Thẻ Meta", icon: Search },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-[#800028] text-white shadow-xs"
                    : "bg-transparent text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "brand" && (
          <BrandSettingsForm
            initialData={settings.siteConfig}
            onSave={async (data: SiteConfigValues) => {
              await handleSaveSection("site_config", data);
              setSettings((prev) => ({ ...prev, siteConfig: data }));
            }}
          />
        )}

        {activeTab === "vietqr" && (
          <VietQRSettingsForm
            initialData={settings.vietqrConfig}
            onSave={async (data: VietQRConfigValues) => {
              await handleSaveSection("vietqr_config", data);
              setSettings((prev) => ({ ...prev, vietqrConfig: data }));
            }}
          />
        )}

        {activeTab === "shipping" && (
          <ShippingSettingsForm
            initialData={settings.shippingConfig}
            onSave={async (data: ShippingConfigValues) => {
              await handleSaveSection("shipping_config", data);
              setSettings((prev) => ({ ...prev, shippingConfig: data }));
            }}
          />
        )}

        {activeTab === "seo" && (
          <SeoSettingsForm
            initialData={settings.seoConfig}
            onSave={async (data: SeoConfigValues) => {
              await handleSaveSection("seo_config", data);
              setSettings((prev) => ({ ...prev, seoConfig: data }));
            }}
          />
        )}
      </div>
    </div>
  );
};
