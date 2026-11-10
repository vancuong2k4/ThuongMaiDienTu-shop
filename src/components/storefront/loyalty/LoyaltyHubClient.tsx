"use client";

// ============================================================
// components/storefront/loyalty/LoyaltyHubClient.tsx
// Trình Điều Phối Trung Tâm Hội Viên THUYNGA Club (Module 10.4)
// ============================================================

import React, { useState } from "react";
import { VIPMembershipCard } from "./VIPMembershipCard";
import { TierPrivilegesTable } from "./TierPrivilegesTable";
import { LoyaltyRedemptionShop } from "./LoyaltyRedemptionShop";
import { MemberPointsHistory } from "./MemberPointsHistory";
import type { LoyaltyHubData } from "./types";

interface LoyaltyHubClientProps {
  initialData: LoyaltyHubData;
  userName: string;
}

export const LoyaltyHubClient: React.FC<LoyaltyHubClientProps> = ({
  initialData,
  userName,
}) => {
  const [data, setData] = useState<LoyaltyHubData>(initialData);

  const handlePointsUpdated = (newPoints: number) => {
    setData((prev) => ({
      ...prev,
      currentPoints: newPoints,
      monetaryEquivalent: newPoints * 100,
    }));
  };

  return (
    <div className="space-y-8">
      {/* 1. Thẻ VIP điện tử sang trọng & Tiến độ lên hạng */}
      <VIPMembershipCard data={data} userName={userName} />

      {/* 2. Gian hàng đổi voucher bằng điểm tích lũy */}
      <LoyaltyRedemptionShop
        rewards={data.rewardCatalog}
        currentPoints={data.currentPoints}
        onPointsUpdated={handlePointsUpdated}
      />

      {/* 3. Bảng quyền lợi 4 hạng hội viên */}
      <TierPrivilegesTable currentTier={data.membershipTier} />

      {/* 4. Lịch sử biến động điểm tích lũy */}
      <MemberPointsHistory transactions={data.transactions} />
    </div>
  );
};
