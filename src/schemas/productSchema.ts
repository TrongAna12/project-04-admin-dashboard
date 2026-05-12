import { z } from "zod";

export const PRODUCT_SORT_FIELDS = [
  "productId",
  "productCode",
  "productName",
  "price",
  "stockQuantity",
] as const;

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
  search: z.string().trim().max(100).optional().catch(undefined),
  status: z
    .enum(["active", "inactive", "discontinued"])
    .optional()
    .catch(undefined),
  sortBy: z.enum(PRODUCT_SORT_FIELDS).default("productId"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export const productIdSchema = z.coerce.number().int().positive();
