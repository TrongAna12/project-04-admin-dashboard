// Common Types
export type BaseEntity = {
  id: string | number;
  createdAt: string;
  updatedAt: string;
};

// User Types
export type UserRole = "admin" | "user" | "moderator" | "viewer";
export interface Message {
  id: number;

  subject: string;
  preview: string;
  sender: string;
  status: "Unread" | "Read" | "Archived";
  receivedAt: string;
}
export type User = BaseEntity & {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  department?: string;
  lastLogin?: string;
};

// Order Types
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";

export type OrderItem = {
  id: string | number;
  productId: string | number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type Order = BaseEntity & {
  orderNumber: string;
  customerId: string | number;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: "credit_card" | "debit_card" | "paypal" | "bank_transfer";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
};

// Customer Types
export type Customer = BaseEntity & {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  lastOrderDate?: string;
};

// Analytics Types
export type DashboardStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
};

export type ChartData = {
  name: string;
  value: number;
  [key: string]: any;
};

export type RevenueData = {
  date: string;
  revenue: number;
  orders: number;
};

export type TopProduct = {
  id: string | number;
  name: string;
  sales: number;
  revenue: number;
  trend: number;
};

// Notification Types
export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
};

// Table Types
export type TablePaginationState = {
  pageIndex: number;
  pageSize: number;
};

export type TableFilterState = {
  [key: string]: string | string[] | null;
};

export type SortingState = {
  field: string;
  order: "asc" | "desc";
};

// API Response Types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

// Auth Types
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: string[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
  confirmPassword: string;
};

// Menu Types
export type MenuItem = {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
  submenu?: MenuItem[];
};
// employer types
export type Employee = BaseEntity & {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;  
  status: "active" | "inactive";
  lastLogin?: string;
};

export type {
  Product,
  ProductListResponse,
  ProductQueryParams,
  ProductSortDirection,
  ProductSortField,
  ProductStatus,
} from "./product";

export type {
  SaleOrder,
  SaleOrderApproved,
  SaleOrderListResponse,
  SaleOrderQueryParams,
  SaleOrderSortField,
  SortDirection,
} from "./saleOrder";
