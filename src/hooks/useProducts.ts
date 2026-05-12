"use client";

import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/services/api";
import type { ProductQueryParams } from "@/types/product";

export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
    retry: 1,
  });
}

export function useProductDetail(productId: number | null) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId as number),
    enabled: productId !== null,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
