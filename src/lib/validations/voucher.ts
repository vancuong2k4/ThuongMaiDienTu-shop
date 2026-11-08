import { z } from "zod";

export const voucherTypeEnum = z.enum(["PERCENTAGE", "FIXED", "FREE_SHIP"]);

export const voucherFormSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Mã voucher tối thiểu 3 ký tự")
      .max(30, "Mã voucher tối đa 30 ký tự")
      .regex(/^[A-Za-z0-9_-]+$/, "Mã chỉ chứa chữ cái, số, gạch ngang hoặc gạch dưới")
      .transform((val) => val.toUpperCase()),
    type: voucherTypeEnum,
    value: z
      .coerce
      .number()
      .positive("Giá trị giảm phải lớn hơn 0"),
    minOrderAmount: z
      .coerce
      .number()
      .min(0, "Giá trị đơn tối thiểu không được âm")
      .nullable()
      .optional(),
    maxDiscount: z
      .coerce
      .number()
      .min(0, "Mức giảm tối đa không được âm")
      .nullable()
      .optional(),
    usageLimit: z
      .coerce
      .number()
      .int("Lượt dùng phải là số nguyên")
      .positive("Lượt dùng phải lớn hơn 0")
      .nullable()
      .optional(),
    userLimit: z
      .coerce
      .number()
      .int("Lượt dùng/user phải là số nguyên")
      .min(1, "Mỗi khách hàng phải được dùng tối thiểu 1 lần")
      .default(1),
    startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.type === "PERCENTAGE" && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Giảm theo phần trăm không được vượt quá 100%",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      return end >= start;
    },
    {
      message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
      path: ["endDate"],
    }
  );

export type VoucherFormValues = z.infer<typeof voucherFormSchema>;

export const voucherToggleSchema = z.object({
  isActive: z.boolean(),
});
