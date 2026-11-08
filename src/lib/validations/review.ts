import { z } from "zod";

export const reviewStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const reviewStatusUpdateSchema = z.object({
  status: reviewStatusEnum,
});

export type ReviewStatusUpdateValues = z.infer<typeof reviewStatusUpdateSchema>;
