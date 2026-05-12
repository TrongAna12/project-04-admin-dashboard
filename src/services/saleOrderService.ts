import {
  findSaleOrderById,
  findSaleOrders,
} from "@/repositories/saleOrderRepository";
import type { SaleOrderQueryParams } from "@/types/saleOrder";

export async function listSaleOrders(params: SaleOrderQueryParams) {
  const result = await findSaleOrders(params);

  return {
    data: result.data,
    total: result.total,
    page: params.page,
    pageSize: params.pageSize,
    pages: Math.max(1, Math.ceil(result.total / params.pageSize)),
  };
}

export async function getSaleOrderDetail(saleOrderId: number) {
  return findSaleOrderById(saleOrderId);
}
