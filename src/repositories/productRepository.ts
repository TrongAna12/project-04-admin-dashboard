import { executeOracle } from "@/services/oracle/client";
import type {
  Product,
  ProductQueryParams,
  ProductSortField,
  ProductStatus,
} from "@/types/product";

const SORT_COLUMNS: Record<ProductSortField, string> = {
  productId: "PRODUCT_ID",
  productCode: "PRODUCT_CODE",
  productName: "PRODUCT_NAME",
  price: "PRICE",
  stockQuantity: "STOCK_QUANTITY",
};

const PRODUCT_COLUMNS = `
  PRODUCT_ID "productId",
  PRODUCT_CODE "productCode",
  PRODUCT_NAME "productName",
  CATEGORY_ID "categoryId",
  BRAND_ID "brandId",
  UNIT "unit",
  PRICE "price",
  COST_PRICE "costPrice",
  STOCK_QUANTITY "stockQuantity",
  WEIGHT "weight",
  BARCODE "barcode",
  IMAGE_URL "imageUrl",
  STATUS "rawStatus",
  DESCRIPTION "description",
  CREATED_AT "createdAt",
  UPDATED_AT "updatedAt",
  CREATED_BY "createdBy",
  UPDATED_BY "updatedBy"
`;

type OracleProductRow = Omit<
  Product,
  | "status"
  | "createdAt"
  | "updatedAt"
  | "id"
  | "name"
  | "category"
  | "stock"
  | "image"
  | "rating"
  | "reviews"
> & {
  rawStatus: string | null;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
};

type CountRow = {
  total: number;
};

const STATUS_TO_DB: Record<ProductStatus, string> = {
  active: "ACTIVE",
  inactive: "INACTIVE",
  discontinued: "DISCONTINUED",
};

function toIsoDate(value: Date | string | null) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function normalizeStatus(value: string | null): ProductStatus {
  const status = value?.toLowerCase();

  if (status === "inactive") return "inactive";
  if (status === "discontinued") return "discontinued";

  return "active";
}

function mapProduct(row: OracleProductRow): Product {
  const status = normalizeStatus(row.rawStatus);
  const category =
    row.categoryId === null ? "Uncategorized" : `Category ${row.categoryId}`;

  return {
    ...row,
    status,
    createdAt: toIsoDate(row.createdAt),
    updatedAt: toIsoDate(row.updatedAt),
    id: row.productId,
    name: row.productName,
    category,
    stock: row.stockQuantity,
    image: row.imageUrl ?? undefined,
    rating: 0,
    reviews: 0,
  };
}

function buildWhereClause(params: ProductQueryParams) {
  const where: string[] = [];
  const binds: Record<string, string | number> = {};

  if (params.search) {
    where.push(`(
      LOWER(PRODUCT_CODE) LIKE :search OR
      LOWER(PRODUCT_NAME) LIKE :search OR
      LOWER(BARCODE) LIKE :search
    )`);
    binds.search = `%${params.search.toLowerCase()}%`;
  }

  if (params.status) {
    where.push("UPPER(STATUS) = :status");
    binds.status = STATUS_TO_DB[params.status];
  }

  return {
    clause: where.length ? `WHERE ${where.join(" AND ")}` : "",
    binds,
  };
}

export async function findProducts(params: ProductQueryParams) {
  const offset = (params.page - 1) * params.pageSize;
  const sortColumn = SORT_COLUMNS[params.sortBy];
  const sortDirection = params.sortDirection.toUpperCase();
  const { clause, binds } = buildWhereClause(params);

  const dataSql = `
    SELECT ${PRODUCT_COLUMNS}
    FROM PRODUCT
    ${clause}
    ORDER BY ${sortColumn} ${sortDirection}, PRODUCT_ID DESC
    OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
  `;

  const countSql = `
    SELECT COUNT(1) "total"
    FROM PRODUCT
    ${clause}
  `;

  const [dataResult, countResult] = await Promise.all([
    executeOracle<OracleProductRow>(dataSql, {
      ...binds,
      offset,
      pageSize: params.pageSize,
    }),
    executeOracle<CountRow>(countSql, binds),
  ]);

  const rows = dataResult.rows ?? [];
  const total = countResult.rows?.[0]?.total ?? 0;

  return {
    data: rows.map(mapProduct),
    total,
  };
}

export async function findProductById(productId: number) {
  const result = await executeOracle<OracleProductRow>(
    `
      SELECT ${PRODUCT_COLUMNS}
      FROM PRODUCT
      WHERE PRODUCT_ID = :productId
      FETCH NEXT 1 ROWS ONLY
    `,
    { productId }
  );

  const row = result.rows?.[0];

  return row ? mapProduct(row) : null;
}
