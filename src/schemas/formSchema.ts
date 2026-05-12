import { z } from "zod";
import { PRODUCT_CATEGORIES } from "@/constants";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(PRODUCT_CATEGORIES as [string, ...string[]]),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock must be a positive number"),
  status: z.enum(["active", "inactive", "discontinued"]),
  image: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["admin", "user", "moderator", "viewer"]),
  status: z.enum(["active", "inactive", "suspended"]),
  department: z.string().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;

export const orderSchema = z.object({
  customerId: z.string().or(z.number()),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled", "returned"]),
  paymentMethod: z.enum(["credit_card", "debit_card", "paypal", "bank_transfer"]),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]),
  shippingAddress: z.string().min(10, "Shipping address is required"),
  notes: z.string().optional(),
});

export type OrderFormData = z.infer<typeof orderSchema>;

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  company: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
