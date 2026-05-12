import { z } from "zod";

export const SALE_ORDER_SORT_FIELDS = [
  "saleOrderId",
  "orderNumber",
  "orderDate",
  "shopCode",
  "customerId",
  "amount",
  "discount",
  "total",
  "approved",
  "priority",
] as const;

export const saleOrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
  search: z.string().trim().max(100).optional().catch(undefined),
  sortBy: z.enum(SALE_ORDER_SORT_FIELDS).default("orderDate"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
  approved: z.enum(["Y", "N"]).optional().catch(undefined),
  orderType: z.string().trim().max(30).optional().catch(undefined),
  orderSource: z.string().trim().max(30).optional().catch(undefined),
});

export const saleOrderIdSchema = z.coerce.number().int().positive();
