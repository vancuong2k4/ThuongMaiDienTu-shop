// ============================================================
// lib/comparison.ts
// Comparison Engine, Matrix Normalization & Nutrient Synergy Analyzer (Phase 19)
// ============================================================

import { prisma } from "@/lib/prisma";
import { Prisma, SynergyType } from "@prisma/client";

type ProductWithComparisonPayload = Prisma.ProductGetPayload<{
  include: {
    category: { select: { name: true; slug: true } };
    variants: true;
    images: true;
    comparisonFeature: true;
    nutrients: {
      include: {
        nutrientRef: true;
      };
    };
  };
}>;

export interface ComparisonMatrixProduct {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  origin: string | null;
  specification: string | null;
  categoryName: string;
  categorySlug: string;
  primaryImage: string | null;
  price: number;
  originalPrice: number | null;
  costPerDay: number | null;
  servingsPerPack: number | null;
  australianCertification: string | null;
  targetAgeGroup: string | null;
  textureOrFlavor: string | null;
  keyDifferentiators: string[];
  storageInstruction: string | null;
  nutrients: Record<
    string,
    {
      refId: string;
      code: string;
      nameVi: string;
      amountPerServing: number;
      amountPer100g: number | null;
      servingSizeText: string | null;
      unit: string;
      highlightClaim: string | null;
      percentDailyValue: number | null;
    }
  >;
}

export interface ComparisonMatrixRow {
  key: string;
  label: string;
  category: "GENERAL" | "CERTIFICATION" | "NUTRIENT" | "EXPERIENCE";
  unit?: string;
  values: Record<string, string | number | null | string[]>;
}

export interface SynergyAlert {
  id: string;
  type: SynergyType;
  title: string;
  description: string;
  pharmacistRecommendation: string | null;
  involvedNutrients: string[];
  involvedProducts: { id: string; name: string }[];
}

export interface ComparisonAnalysisResult {
  products: ComparisonMatrixProduct[];
  matrixRows: ComparisonMatrixRow[];
  synergyAlerts: SynergyAlert[];
  overallSafetyStatus: "SAFE" | "CAUTION" | "EXCELLENT_SYNERGY";
  pharmacistSummary: string;
}

/**
 * Lấy dữ liệu chi tiết và chuẩn hóa bảng ma trận so sánh cho tối đa 4 sản phẩm
 */
export async function getComparisonDataset(
  productIds: string[]
): Promise<{ products: ComparisonMatrixProduct[]; matrixRows: ComparisonMatrixRow[] }> {
  if (!productIds || productIds.length === 0) {
    return { products: [], matrixRows: [] };
  }

  const validIds = productIds.slice(0, 4);

  const rawProducts = (await prisma.product.findMany({
    where: {
      id: { in: validIds },
      isActive: true,
    },
    include: {
      category: { select: { name: true, slug: true } },
      variants: {
        where: { isActive: true },
        orderBy: [{ isDefault: "desc" }, { price: "asc" }],
      },
      images: {
        orderBy: [{ sortOrder: "asc" }],
        take: 1,
      },
      comparisonFeature: true,
      nutrients: {
        include: {
          nutrientRef: true,
        },
      },
    },
  })) as ProductWithComparisonPayload[];

  // Preserve order as requested in productIds
  const sortedProducts = validIds
    .map((id) => rawProducts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Collect all unique nutrients across all products
  const uniqueNutrientsMap = new Map<
    string,
    { code: string; nameVi: string; unit: string; sortOrder: number }
  >();

  const products: ComparisonMatrixProduct[] = sortedProducts.map((p) => {
    const defaultVariant = p.variants[0];
    const price = defaultVariant ? Number(defaultVariant.price) : 0;
    const originalPrice = defaultVariant?.originalPrice
      ? Number(defaultVariant.originalPrice)
      : null;
    const primaryImage =
      p.images[0]?.url || defaultVariant?.image || "/images/placeholder.svg";

    const nutrientsRecord: ComparisonMatrixProduct["nutrients"] = {};

    p.nutrients.forEach((pn) => {
      const ref = pn.nutrientRef;
      if (!uniqueNutrientsMap.has(ref.code)) {
        uniqueNutrientsMap.set(ref.code, {
          code: ref.code,
          nameVi: ref.nameVi,
          unit: ref.unit,
          sortOrder: ref.sortOrder,
        });
      }

      nutrientsRecord[ref.code] = {
        refId: ref.id,
        code: ref.code,
        nameVi: ref.nameVi,
        amountPerServing: Number(pn.amountPerServing),
        amountPer100g: pn.amountPer100g ? Number(pn.amountPer100g) : null,
        servingSizeText: pn.servingSizeText,
        unit: ref.unit,
        highlightClaim: pn.highlightClaim,
        percentDailyValue: pn.percentDailyValue ? Number(pn.percentDailyValue) : null,
      };
    });

    const diffs: string[] = Array.isArray(p.comparisonFeature?.keyDifferentiators)
      ? (p.comparisonFeature?.keyDifferentiators as string[])
      : [];

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      origin: p.origin,
      specification: p.specification,
      categoryName: p.category.name,
      categorySlug: p.category.slug,
      primaryImage,
      price,
      originalPrice,
      costPerDay: p.comparisonFeature?.costPerDay
        ? Number(p.comparisonFeature.costPerDay)
        : null,
      servingsPerPack: p.comparisonFeature?.servingsPerPack || null,
      australianCertification:
        p.comparisonFeature?.australianCertification || null,
      targetAgeGroup: p.comparisonFeature?.targetAgeGroup || null,
      textureOrFlavor: p.comparisonFeature?.textureOrFlavor || null,
      keyDifferentiators: diffs,
      storageInstruction: p.comparisonFeature?.storageInstruction || null,
      nutrients: nutrientsRecord,
    };
  });

  // Build Normalized Matrix Rows
  const matrixRows: ComparisonMatrixRow[] = [];

  // Row: Giá & Chi phí
  const priceRow: ComparisonMatrixRow = {
    key: "price",
    label: "Giá niêm yết",
    category: "GENERAL",
    unit: "₫",
    values: {},
  };
  const costPerDayRow: ComparisonMatrixRow = {
    key: "costPerDay",
    label: "Chi phí trung bình / ngày dùng",
    category: "GENERAL",
    unit: "₫/ngày",
    values: {},
  };
  const servingsRow: ComparisonMatrixRow = {
    key: "servingsPerPack",
    label: "Số ngày / liều dùng / hộp",
    category: "GENERAL",
    unit: "ngày",
    values: {},
  };
  const specRow: ComparisonMatrixRow = {
    key: "specification",
    label: "Quy cách đóng gói",
    category: "GENERAL",
    values: {},
  };
  const originRow: ComparisonMatrixRow = {
    key: "origin",
    label: "Xuất xứ & Đường vận chuyển",
    category: "GENERAL",
    values: {},
  };
  const certRow: ComparisonMatrixRow = {
    key: "certification",
    label: "Chứng nhận tiêu chuẩn Úc (TGA / FSANZ)",
    category: "CERTIFICATION",
    values: {},
  };
  const targetAgeRow: ComparisonMatrixRow = {
    key: "targetAgeGroup",
    label: "Đối tượng khuyến nghị phù hợp",
    category: "EXPERIENCE",
    values: {},
  };
  const textureRow: ComparisonMatrixRow = {
    key: "textureOrFlavor",
    label: "Hương vị & Cảm quan",
    category: "EXPERIENCE",
    values: {},
  };
  const diffRow: ComparisonMatrixRow = {
    key: "keyDifferentiators",
    label: "Ưu điểm đột phá độc quyền",
    category: "EXPERIENCE",
    values: {},
  };
  const storageRow: ComparisonMatrixRow = {
    key: "storageInstruction",
    label: "Hướng dẫn bảo quản chuẩn",
    category: "EXPERIENCE",
    values: {},
  };

  products.forEach((p) => {
    priceRow.values[p.id] = p.price;
    costPerDayRow.values[p.id] = p.costPerDay;
    servingsRow.values[p.id] = p.servingsPerPack;
    specRow.values[p.id] = p.specification;
    originRow.values[p.id] = p.origin ? `${p.origin} (Hàng bay Air Cargo)` : "Úc";
    certRow.values[p.id] = p.australianCertification || "Đạt chuẩn Bộ Y Tế & Chemist Warehouse";
    targetAgeRow.values[p.id] = p.targetAgeGroup || "Mọi lứa tuổi";
    textureRow.values[p.id] = p.textureOrFlavor || "Dễ uống, hương tự nhiên";
    diffRow.values[p.id] = p.keyDifferentiators;
    storageRow.values[p.id] = p.storageInstruction || "Bảo quản nơi khô ráo thoáng mát";
  });

  matrixRows.push(
    priceRow,
    costPerDayRow,
    servingsRow,
    specRow,
    originRow,
    certRow,
    targetAgeRow,
    textureRow,
    diffRow,
    storageRow
  );

  // Rows: Unique Nutrients aligned across columns
  const sortedNutrients = Array.from(uniqueNutrientsMap.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  sortedNutrients.forEach((n) => {
    const nutRow: ComparisonMatrixRow = {
      key: `nutrient_${n.code}`,
      label: n.nameVi,
      category: "NUTRIENT",
      unit: n.unit,
      values: {},
    };

    products.forEach((p) => {
      const pNut = p.nutrients[n.code];
      if (pNut) {
        nutRow.values[p.id] = pNut.amountPerServing
          ? `${pNut.amountPerServing} ${pNut.unit}${
              pNut.highlightClaim ? ` (${pNut.highlightClaim})` : ""
            }`
          : "Có chứa";
      } else {
        nutRow.values[p.id] = "-";
      }
    });

    matrixRows.push(nutRow);
  });

  return { products, matrixRows };
}

/**
 * Phân tích tác dụng hiệp đồng (Synergy) và cảnh báo quá liều (Overdose/Conflict) giữa các sản phẩm
 */
export async function analyzeNutrientSynergies(
  productIds: string[]
): Promise<ComparisonAnalysisResult> {
  const { products, matrixRows } = await getComparisonDataset(productIds);

  if (products.length < 2) {
    return {
      products,
      matrixRows,
      synergyAlerts: [],
      overallSafetyStatus: "SAFE",
      pharmacistSummary: "Vui lòng chọn từ 2 sản phẩm trở lên để phân tích tương tác và hiệp đồng vi chất.",
    };
  }

  // Collect all nutrients present per product
  const productNutrientMap = new Map<
    string,
    { productId: string; productName: string; code: string; refId: string; amount: number; unit: string }[]
  >();

  const allActiveNutrientRefs = new Map<string, { id: string; code: string; nameVi: string; upperLimit: number | null }>();

  products.forEach((p) => {
    const list: { productId: string; productName: string; code: string; refId: string; amount: number; unit: string }[] = [];
    Object.values(p.nutrients).forEach((n) => {
      list.push({
        productId: p.id,
        productName: p.name,
        code: n.code,
        refId: n.refId,
        amount: n.amountPerServing,
        unit: n.unit,
      });
      if (!allActiveNutrientRefs.has(n.code)) {
        allActiveNutrientRefs.set(n.code, {
          id: n.refId,
          code: n.code,
          nameVi: n.nameVi,
          upperLimit: null, // Will fetch
        });
      }
    });
    productNutrientMap.set(p.id, list);
  });

  // Fetch nutrient references with upper limits
  const refIds = Array.from(allActiveNutrientRefs.values()).map((r) => r.id);
  const dbRefs = await prisma.nutrientReference.findMany({
    where: { id: { in: refIds } },
  });

  const refDetailsMap = new Map<string, typeof dbRefs[0]>();
  dbRefs.forEach((r) => refDetailsMap.set(r.id, r));

  const synergyAlerts: SynergyAlert[] = [];

  // 1. Check for Duplicate/Overdose Risk across products (e.g. Zinc in both products exceeding Upper Limit)
  const nutrientTotalsMap = new Map<
    string,
    {
      code: string;
      ref: typeof dbRefs[0];
      totalAmount: number;
      productsInvolved: { id: string; name: string; amount: number }[];
    }
  >();

  products.forEach((p) => {
    Object.values(p.nutrients).forEach((n) => {
      const ref = refDetailsMap.get(n.refId);
      if (!ref) return;

      const existing = nutrientTotalsMap.get(ref.code);
      if (existing) {
        existing.totalAmount += n.amountPerServing;
        existing.productsInvolved.push({
          id: p.id,
          name: p.name,
          amount: n.amountPerServing,
        });
      } else {
        nutrientTotalsMap.set(ref.code, {
          code: ref.code,
          ref,
          totalAmount: n.amountPerServing,
          productsInvolved: [{ id: p.id, name: p.name, amount: n.amountPerServing }],
        });
      }
    });
  });

  // Evaluate overdose warnings
  nutrientTotalsMap.forEach((entry) => {
    if (entry.productsInvolved.length > 1 && entry.ref.upperLimit) {
      const upper = Number(entry.ref.upperLimit);
      if (entry.totalAmount > upper) {
        synergyAlerts.push({
          id: `overdose_${entry.code}`,
          type: SynergyType.CAUTION_OVERDOSE,
          title: `Cảnh báo trùng lặp ${entry.ref.nameVi} vượt ngưỡng an toàn!`,
          description: `Cả ${entry.productsInvolved.length} sản phẩm đều chứa ${entry.ref.nameVi}. Tổng hàm lượng kết hợp (${entry.totalAmount} ${entry.ref.unit}) vượt ngưỡng tối đa khuyến nghị (${upper} ${entry.ref.unit}/ngày).`,
          pharmacistRecommendation: `Dược sĩ chỉ định: Không nên uống đồng thời cả hai sản phẩm cùng ngày với liều tiêu chuẩn. Hãy tham vấn Dược sĩ THUYNGA để giảm nửa liều hoặc dùng xen kẽ ngày.`,
          involvedNutrients: [entry.ref.nameVi],
          involvedProducts: entry.productsInvolved.map((p) => ({ id: p.id, name: p.name })),
        });
      }
    }
  });

  // 2. Pairwise Synergy Rules from DB
  const presentRefIds = dbRefs.map((r) => r.id);
  const synergyRules = await prisma.nutrientSynergyRule.findMany({
    where: {
      primaryNutrientId: { in: presentRefIds },
      secondaryNutrientId: { in: presentRefIds },
    },
    include: {
      primaryNutrient: true,
      secondaryNutrient: true,
    },
  });

  synergyRules.forEach((rule) => {
    const primaryCode = rule.primaryNutrient.code;
    const secondaryCode = rule.secondaryNutrient.code;

    // Check which products provide primary and which provide secondary
    const primaryProducts = products.filter((p) => p.nutrients[primaryCode]);
    const secondaryProducts = products.filter((p) => p.nutrients[secondaryCode]);

    if (primaryProducts.length > 0 && secondaryProducts.length > 0) {
      // Find all unique involved products
      const involvedProductIds = new Set<string>();
      const involvedProductsList: { id: string; name: string }[] = [];

      [...primaryProducts, ...secondaryProducts].forEach((p) => {
        if (!involvedProductIds.has(p.id)) {
          involvedProductIds.add(p.id);
          involvedProductsList.push({ id: p.id, name: p.name });
        }
      });

      synergyAlerts.push({
        id: rule.id,
        type: rule.synergyType,
        title: rule.title,
        description: rule.description,
        pharmacistRecommendation: rule.pharmacistRecommendation,
        involvedNutrients: [rule.primaryNutrient.nameVi, rule.secondaryNutrient.nameVi],
        involvedProducts: involvedProductsList,
      });
    }
  });

  // Determine overall status
  const hasOverdose = synergyAlerts.some((a) => a.type === SynergyType.CAUTION_OVERDOSE);
  const hasBeneficial = synergyAlerts.some((a) => a.type === SynergyType.SYNERGY_BENEFICIAL);

  let overallSafetyStatus: ComparisonAnalysisResult["overallSafetyStatus"] = "SAFE";
  let pharmacistSummary =
    "Bộ sản phẩm kết hợp an toàn, cung cấp dưỡng chất đa dạng cho cơ thể mà không gặp tương tác bất lợi.";

  if (hasOverdose) {
    overallSafetyStatus = "CAUTION";
    pharmacistSummary =
      "⚠️ Lưu ý: Phát hiện thành phần vi chất trùng lặp có nguy cơ vượt ngưỡng khuyến nghị tối đa (UL). Vui lòng đọc kỹ khuyến nghị của Dược sĩ để điều chỉnh liều uống.";
  } else if (hasBeneficial) {
    overallSafetyStatus = "EXCELLENT_SYNERGY";
    pharmacistSummary =
      "🌟 Tuyệt vời! Các sản phẩm có tác dụng hiệp đồng sinh học cao (như D3+K2 hoặc DHA+EPA), hỗ trợ tối đa hóa hấp thu dưỡng chất vào cơ thể.";
  }

  return {
    products,
    matrixRows,
    synergyAlerts,
    overallSafetyStatus,
    pharmacistSummary,
  };
}
