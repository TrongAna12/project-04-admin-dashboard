export type OracleProductDateString = string | null;

export type ProductStatus = "active" | "inactive" | "discontinued";

export type Product = {
  productId: number;
  productCode: string | null;
  productName: string;
  categoryId: number | null;
  brandId: number | null;
  unit: string | null;
  price: number;
  costPrice: number | null;
  stockQuantity: number;
  weight: number | null;
  barcode: string | null;
  imageUrl: string | null;
  status: ProductStatus;
  description: string | null;
  createdAt: OracleProductDateString;
  updatedAt: OracleProductDateString;
  createdBy: string | null;
  updatedBy: string | null;
  id: number;
  name: string;
  category: string;
  stock: number;
  image?: string;
  rating: number;
  reviews: number;
};

export type ProductSortField =
  | "productId"
  | "productCode"
  | "productName"
  | "price"
  | "stockQuantity";

export type ProductSortDirection = "asc" | "desc";

export type ProductQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: ProductStatus;
  sortBy: ProductSortField;
  sortDirection: ProductSortDirection;
};

export type ProductListResponse = {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};
