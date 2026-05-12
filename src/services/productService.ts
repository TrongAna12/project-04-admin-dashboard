import {
  findProductById,
  findProducts,
} from "@/repositories/productRepository";
import type { ProductQueryParams } from "@/types/product";

export async function listProducts(params: ProductQueryParams) {
  const result = await findProducts(params);

  return {
    data: result.data,
    total: result.total,
    page: params.page,
    pageSize: params.pageSize,
    pages: Math.max(1, Math.ceil(result.total / params.pageSize)),
  };
}

export async function getProductDetail(productId: number) {
  return findProductById(productId);
}
