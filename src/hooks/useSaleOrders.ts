"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaleOrder, getSaleOrders } from "@/services/api";
import type { SaleOrderQueryParams } from "@/types/saleOrder";

export function useSaleOrders(params: SaleOrderQueryParams) {
  return useQuery({
    queryKey: ["sale-orders", params],
    queryFn: () => getSaleOrders(params),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}

export function useSaleOrderDetail(saleOrderId: number | null) {
  return useQuery({
    queryKey: ["sale-order", saleOrderId],
    queryFn: () => getSaleOrder(saleOrderId as number),
    enabled: saleOrderId !== null,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
