import type { MenuItem } from "@/types";

export const SIDEBAR_MENUS: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    href: "/dashboard",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "BarChart3",
    href: "/analytics",
  },
  {
    id: "orders",
    label: "Orders",
    icon: "ShoppingCart",
    href: "/orders",
    badge: "12",
  },
  {
    id: "products",
    label: "Products",
    icon: "Package",
    href: "/products",
  },
  {
    id: "customers",
    label: "Customers",
    icon: "Users",
    href: "/customers",
  },
  {
    id: "employees",
    label: "Employees",
    icon: "UserCheck",
    href: "/employees",
  },
  {
    id: "reports",
    label: "Reports",
    icon: "FileText",
    href: "/reports",
  },
  {
    id: "finance",
    label: "Finance",
    icon: "DollarSign",
    href: "/finance",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "MessageSquare",
    href: "/messages",
    badge: "5",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "Bell",
    href: "/notifications",
    badge: "8",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "Settings",
    href: "/settings",
  },
];

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
];

export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export const USER_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "user", label: "User" },
  { value: "moderator", label: "Moderator" },
  { value: "viewer", label: "Viewer" },
];

export const USER_STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

export const PRODUCT_STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "discontinued", label: "Discontinued" },
];

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
  "Beauty",
  "Food & Beverage",
];

export const PAGINATION_SIZES = [10, 25, 50, 100];

export const COLORS = {
  primary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#0EA5E9",
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};
