import { executeOracle } from "@/services/oracle/client";
import type {
  SaleOrder,
  SaleOrderQueryParams,
  SaleOrderSortField,
} from "@/types/saleOrder";

const SORT_COLUMNS: Record<SaleOrderSortField, string> = {
  saleOrderId: "SALE_ORDER_ID",
  orderNumber: "ORDER_NUMBER",
  orderDate: "ORDER_DATE",
  shopCode: "SHOP_CODE",
  customerId: "CUSTOMER_ID",
  amount: "AMOUNT",
  discount: "DISCOUNT",
  total: "TOTAL",
  approved: "APPROVED",
  priority: "PRIORITY",
};

const SALE_ORDER_COLUMNS = `
  SALE_ORDER_ID "saleOrderId",
  SHOP_ID "shopId",
  SHOP_CODE "shopCode",
  STAFF_ID "staffId",
  ROUTING_ID "routingId",
  CUSTOMER_ID "customerId",
  ORDER_NUMBER "orderNumber",
  ORDER_DATE "orderDate",
  ORDER_TYPE "orderType",
  ORDER_SOURCE "orderSource",
  APPROVED "approved",
  TYPE "type",
  FROM_SALE_ORDER_ID "fromSaleOrderId",
  REF_ORDER_NUMBER "refOrderNumber",
  REF_PO_CUSTOMER_ID "refPoCustomerId",
  DELIVERY_ID "deliveryId",
  DELIVERY_DATE "deliveryDate",
  CASHIER_ID "cashierId",
  CAR_ID "carId",
  AMOUNT "amount",
  DISCOUNT "discount",
  TOTAL "total",
  DESCRIPTION "description",
  TOTAL_WEIGHT "totalWeight",
  PRIORITY "priority",
  IS_VISIT_PLAN "isVisitPlan",
  DESTROY_CODE "destroyCode"
`;

type OracleSaleOrderRow = Omit<SaleOrder, "orderDate" | "deliveryDate"> & {
  orderDate: Date | string | null;
  deliveryDate: Date | string | null;
};

type CountRow = {
  total: number;
};

function toIsoDate(value: Date | string | null) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function mapSaleOrder(row: OracleSaleOrderRow): SaleOrder {
  return {
    ...row,
    orderDate: toIsoDate(row.orderDate),
    deliveryDate: toIsoDate(row.deliveryDate),
  };
}

function buildWhereClause(params: SaleOrderQueryParams) {
  const where: string[] = [];
  const binds: Record<string, string | number> = {};

  if (params.search) {
    where.push(`(
      LOWER(ORDER_NUMBER) LIKE :search OR
      LOWER(REF_ORDER_NUMBER) LIKE :search OR
      LOWER(SHOP_CODE) LIKE :search OR
      LOWER(DESCRIPTION) LIKE :search
    )`);
    binds.search = `%${params.search.toLowerCase()}%`;
  }

  if (params.approved) {
    where.push("APPROVED = :approved");
    binds.approved = params.approved;
  }

  if (params.orderType) {
    where.push("ORDER_TYPE = :orderType");
    binds.orderType = params.orderType;
  }

  if (params.orderSource) {
    where.push("ORDER_SOURCE = :orderSource");
    binds.orderSource = params.orderSource;
  }

  return {
    clause: where.length ? `WHERE ${where.join(" AND ")}` : "",
    binds,
  };
}

export async function findSaleOrders(params: SaleOrderQueryParams) {
  const offset = (params.page - 1) * params.pageSize;
  const sortColumn = SORT_COLUMNS[params.sortBy];
  const sortDirection = params.sortDirection.toUpperCase();
  const { clause, binds } = buildWhereClause(params);

  const dataSql = `
    SELECT ${SALE_ORDER_COLUMNS}
    FROM SALE_ORDER
    ${clause}
    ORDER BY ${sortColumn} ${sortDirection}, SALE_ORDER_ID DESC
    OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
  `;

  const countSql = `
    SELECT COUNT(1) "total"
    FROM SALE_ORDER
    ${clause}
  `;

  const [dataResult, countResult] = await Promise.all([
    executeOracle<OracleSaleOrderRow>(dataSql, {
      ...binds,
      offset,
      pageSize: params.pageSize,
    }),
    executeOracle<CountRow>(countSql, binds),
  ]);

  const rows = dataResult.rows ?? [];
  const total = countResult.rows?.[0]?.total ?? 0;

  return {
    data: rows.map(mapSaleOrder),
    total,
  };
}

export async function findSaleOrderById(saleOrderId: number) {
  const result = await executeOracle<OracleSaleOrderRow>(
    `
      SELECT ${SALE_ORDER_COLUMNS}
      FROM SALE_ORDER
      WHERE SALE_ORDER_ID = :saleOrderId
      FETCH NEXT 1 ROWS ONLY
    `,
    { saleOrderId }
  );

  const row = result.rows?.[0];

  return row ? mapSaleOrder(row) : null;
}
