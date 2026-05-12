export type OracleNumber = number;
export type OracleDateString = string;

export type SaleOrderApproved = "Y" | "N" | null;

export type SaleOrder = {
  saleOrderId: OracleNumber;
  shopId: OracleNumber | null;
  shopCode: string | null;
  staffId: OracleNumber | null;
  routingId: OracleNumber | null;
  customerId: OracleNumber | null;
  orderNumber: string;
  orderDate: OracleDateString | null;
  orderType: string | null;
  orderSource: string | null;
  approved: SaleOrderApproved;
  type: string | null;
  fromSaleOrderId: OracleNumber | null;
  refOrderNumber: string | null;
  refPoCustomerId?: number | null;
  deliveryId: OracleNumber | null;
  deliveryDate: OracleDateString | null;
  cashierId: OracleNumber | null;
  carId: OracleNumber | null;
  amount: OracleNumber | null;
  discount: OracleNumber | null;
  total: OracleNumber | null;
  description: string | null;
  totalWeight: OracleNumber | null;
  priority: OracleNumber | null;
  isVisitPlan: OracleNumber | null;
  destroyCode: string | null;
};

export type SaleOrderSortField =
  | "saleOrderId"
  | "orderNumber"
  | "orderDate"
  | "shopCode"
  | "customerId"
  | "amount"
  | "discount"
  | "total"
  | "approved"
  | "priority";

export type SortDirection = "asc" | "desc";

export type SaleOrderQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  sortBy: SaleOrderSortField;
  sortDirection: SortDirection;
  approved?: "Y" | "N";
  orderType?: string;
  orderSource?: string;
};

export type SaleOrderListResponse = {
  data: SaleOrder[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};
