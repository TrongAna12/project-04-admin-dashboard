import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  User,
  Product,
  Order,
  Customer,
  DashboardStats,
  Employee,
  RevenueData,
  TopProduct,
  PaginatedResponse,
  Message,
  SaleOrder,
  SaleOrderListResponse,
  SaleOrderQueryParams,
} from "@/types";
import axios from "axios";
import { delay } from "@/lib/utils";

const mockAuthUsers: AuthUser[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    role: "admin",
    permissions: ["read", "write", "delete"],
  },
];

const mockOtpCode = "123456";

// Mock Data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Nguyen Van A",
    email: "a@gmail.com",
    phone: "+84901234567",
    role: "admin",
    status: "active",
    department: "IT",
    createdAt: "2024-01-15",
    updatedAt: "2024-05-01",
    lastLogin: "2024-05-10",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenA",
  },
  {
    id: 2,
    name: "Tran Van B",
    email: "b@gmail.com",
    phone: "+84901234568",
    role: "user",
    status: "active",
    department: "Sales",
    createdAt: "2024-02-20",
    updatedAt: "2024-05-01",
    lastLogin: "2024-05-11",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TranB",
  },
  {
    id: 3,
    name: "Pham Thi C",
    email: "c@gmail.com",
    phone: "+84901234569",
    role: "user",
    status: "inactive",
    department: "Marketing",
    createdAt: "2024-03-10",
    updatedAt: "2024-05-01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamC",
  },
  {
    id: 4,
    name: "Le Van D",
    email: "d@gmail.com",
    phone: "+84901234570",
    role: "moderator",
    status: "active",
    department: "Support",
    createdAt: "2024-01-25",
    updatedAt: "2024-05-01",
    lastLogin: "2024-05-09",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=LeD",
  },
  {
    id: 5,
    name: "Hoang Thi E",
    email: "e@gmail.com",
    phone: "+84901234571",
    role: "user",
    status: "active",
    department: "HR",
    createdAt: "2024-04-05",
    updatedAt: "2024-05-01",
    lastLogin: "2024-05-08",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HoangE",
  },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "High-quality noise-cancelling wireless headphones",
    category: "Electronics",
    price: 199.99,
    stock: 45,
    status: "active",
    rating: 4.5,
    reviews: 328,
    createdAt: "2024-01-01",
    updatedAt: "2024-05-01",
    image: "https://myhypergear.com/cdn/shop/products/15613_HYG_Vibe_Wireless_Headphones_White_001.jpg?v=1644943914",
  },
  {
    id: 2,
    name: "USB-C Laptop Charger",
    description: "Fast charging USB-C laptop charger 65W",
    category: "Electronics",
    price: 49.99,
    stock: 120,
    status: "active",
    rating: 4.2,
    reviews: 245,
    createdAt: "2024-01-05",
    updatedAt: "2024-05-01",
    image: "https://myhypergear.com/cdn/shop/products/15613_HYG_Vibe_Wireless_Headphones_White_001.jpg?v=1644943914",
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    description: "100% organic cotton comfortable t-shirt",
    category: "Clothing",
    price: 29.99,
    stock: 200,
    status: "active",
    rating: 4.3,
    reviews: 156,
    createdAt: "2024-02-01",
    updatedAt: "2024-05-01",
    image: "https://myhypergear.com/cdn/shop/products/15613_HYG_Vibe_Wireless_Headphones_White_001.jpg?v=1644943914",
  },
  {
    id: 4,
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with brown switches",
    category: "Electronics",
    price: 129.99,
    stock: 78,
    status: "active",
    rating: 4.7,
    reviews: 412,
    createdAt: "2024-01-15",
    updatedAt: "2024-05-01",
    image: "https://myhypergear.com/cdn/shop/products/15613_HYG_Vibe_Wireless_Headphones_White_001.jpg?v=1644943914",
  },
  {
    id: 5,
    name: "4K Webcam",
    description: "Ultra HD 4K webcam with auto-focus",
    category: "Electronics",
    price: 179.99,
    stock: 34,
    status: "active",
    rating: 4.4,
    reviews: 198,
    createdAt: "2024-02-10",
    updatedAt: "2024-05-01",
    image: "https://myhypergear.com/cdn/shop/products/15613_HYG_Vibe_Wireless_Headphones_White_001.jpg?v=1644943914",
  },
];

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customerId: 1,
    customerName: "John Doe",
    items: [
      { id: 1, productId: 1, productName: "Wireless Headphones", quantity: 1, price: 199.99, subtotal: 199.99 },
    ],
    totalAmount: 199.99,
    status: "delivered",
    shippingAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    createdAt: "2024-05-01",
    updatedAt: "2024-05-05",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customerId: 2,
    customerName: "Jane Smith",
    items: [
      { id: 2, productId: 2, productName: "USB-C Laptop Charger", quantity: 2, price: 49.99, subtotal: 99.98 },
    ],
    totalAmount: 99.98,
    status: "shipped",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90001",
    paymentMethod: "paypal",
    paymentStatus: "paid",
    createdAt: "2024-05-08",
    updatedAt: "2024-05-10",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customerId: 3,
    customerName: "Bob Johnson",
    items: [
      { id: 3, productId: 4, productName: "Mechanical Keyboard", quantity: 1, price: 129.99, subtotal: 129.99 },
      { id: 4, productId: 3, productName: "Cotton T-Shirt", quantity: 3, price: 29.99, subtotal: 89.97 },
    ],
    totalAmount: 219.96,
    status: "processing",
    shippingAddress: "789 Pine Rd, Chicago, IL 60601",
    paymentMethod: "debit_card",
    paymentStatus: "paid",
    createdAt: "2024-05-10",
    updatedAt: "2024-05-11",
  },
  {
    id: 4,
    orderNumber: "ORD-004",
    customerId: 4,
    customerName: "Alice Brown",
    items: [
      { id: 5, productId: 5, productName: "4K Webcam", quantity: 1, price: 179.99, subtotal: 179.99 },
    ],
    totalAmount: 179.99,
    status: "pending",
    shippingAddress: "321 Elm St, Houston, TX 77001",
    paymentMethod: "credit_card",
    paymentStatus: "pending",
    createdAt: "2024-05-11",
    updatedAt: "2024-05-11",
  },
];

// API Functions
export async function getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
  await delay(500);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: mockUsers.slice(start, end),
    total: mockUsers.length,
    page,
    pageSize: limit,
    pages: Math.ceil(mockUsers.length / limit),
  };
}

export async function getProductData(page = 1, limit = 10): Promise<PaginatedResponse<Product>> {
  await delay(500);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: mockProducts.slice(start, end),
    total: mockProducts.length,
    page,
    pageSize: limit,
    pages: Math.ceil(mockProducts.length / limit),
  };
}

export async function getOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
  await delay(500);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: mockOrders.slice(start, end),
    total: mockOrders.length,
    page,
    pageSize: limit,
    pages: Math.ceil(mockOrders.length / limit),
  };
}

export async function authLogin(credentials: LoginCredentials): Promise<AuthUser> {
  await delay(500);
  const user = mockAuthUsers.find((item) => item.email === credentials.email && credentials.password === "password123");

  if (!user) {
    throw new Error("Invalid login credentials");
  }

  return user;
}

export async function authRegister(credentials: RegisterCredentials): Promise<AuthUser> {
  await delay(600);

  const existing = mockAuthUsers.find((item) => item.email === credentials.email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const newUser: AuthUser = {
    id: `${mockAuthUsers.length + 1}`,
    email: credentials.email,
    name: credentials.name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(credentials.name)}`,
    role: "admin",
    permissions: ["read", "write"],
  };

  mockAuthUsers.push(newUser);
  return newUser;
}

export async function authForgotPassword(email: string): Promise<string> {
  await delay(500);
  const user = mockAuthUsers.find((item) => item.email === email);
  if (!user) {
    throw new Error("User not found");
  }
  return "email_sent";
}

export async function authResetPassword(password: string, confirmPassword: string): Promise<string> {
  await delay(500);
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  return "password_reset";
}

export async function authVerifyOtp(code: string): Promise<string> {
  await delay(400);
  if (code !== mockOtpCode) {
    throw new Error("Invalid verification code");
  }
  return "otp_verified";
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(400);
  return {
    totalRevenue: 1248200,
    totalOrders: 1384,
    totalCustomers: 874,
    totalProducts: mockProducts.length,
    revenueGrowth: 12.4,
    ordersGrowth: 8.1,
    customersGrowth: 6.2,
    productsGrowth: 4.8,
  };
}

export async function getRevenueData(): Promise<RevenueData[]> {
  await delay(400);
  return [
    { date: "01 May", revenue: 32000, orders: 48 },
    { date: "05 May", revenue: 42000, orders: 72 },
    { date: "10 May", revenue: 38000, orders: 64 },
    { date: "15 May", revenue: 47000, orders: 86 },
    { date: "20 May", revenue: 51000, orders: 98 },
    { date: "25 May", revenue: 46000, orders: 77 },
    { date: "30 May", revenue: 53000, orders: 102 },
  ];
}

export async function getTopProducts(): Promise<TopProduct[]> {
  await delay(400);
  return [
    { id: 1, name: "Wireless Headphones", sales: 732, revenue: 146598, trend: 18 },
    { id: 2, name: "Mechanical Keyboard", sales: 582, revenue: 75534, trend: 12 },
    { id: 3, name: "USB-C Charger", sales: 624, revenue: 31194, trend: 9 },
    { id: 4, name: "4K Webcam", sales: 415, revenue: 74697, trend: -3 },
  ];
}

export async function searchUsers(query: string): Promise<User[]> {
  await delay(300);
  return mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );
}

//getMesseges
export async function getMessages(
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Message>> {
  await delay(500);

  const mockMessages: Message[] = [];

  for (let i = 1; i <= 50; i++) {
    mockMessages.push({
      id: i,
      sender: `User ${i}`,
      subject: `New message from User ${i}`,
      preview: `This is a preview message from User ${i}.`,
      status: i % 3 === 0 ? "Unread" : "Read",
      receivedAt: new Date(
        Date.now() - i * 60000
      ).toLocaleTimeString(),
    });
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: mockMessages.slice(start, end),
    total: mockMessages.length,
    page,
    pageSize: limit,
    pages: Math.ceil(mockMessages.length / limit),
  };
}
// getEmployer
export async function getEmployees(page = 1, limit = 10): Promise<PaginatedResponse<Employee>> {
  await delay(500);
  const start = (page - 1) * limit;
  const end = start + limit;
  const employees: Employee[] = mockUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department ?? "Unassigned",
    phone: user.phone ?? "",
    status: user.status === "suspended" ? "inactive" : user.status,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return {
    data: employees.slice(start, end),
    total: employees.length,
    page,
    pageSize: limit,
    pages: Math.ceil(employees.length / limit),
  };
}
// getCustomer
export async function getCustomers(page = 1, limit = 10): Promise<PaginatedResponse<Customer>> {
  await delay(500);
  const start = (page - 1) * limit;
  const end = start + limit;
  const customers: Customer[] = mockUsers.map((user) => ({
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    company: "Company " + user.id,
    address: "123 Business Street",
    city: "Ho Chi Minh City",
    state: "Ho Chi Minh",
    zipCode: "700000",
    country: "Vietnam",
    totalOrders: Math.floor(Math.random() * 20),
    totalSpent: parseFloat((Math.random() * 5000).toFixed(2)),
    lastOrderDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    status: user.status === "active" ? "active" : "inactive",
  }));
  return {
    data: customers.slice(start, end),
    total: customers.length,
    page,
    pageSize: limit,
    pages: Math.ceil(customers.length / limit),
  };
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(300);
  return mockProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getSaleOrders(
  params: SaleOrderQueryParams
): Promise<SaleOrderListResponse> {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
  });

  if (params.search) searchParams.set("search", params.search);
  if (params.approved) searchParams.set("approved", params.approved);
  if (params.orderType) searchParams.set("orderType", params.orderType);
  if (params.orderSource) searchParams.set("orderSource", params.orderSource);

  const response = await axios.get<SaleOrderListResponse>(
    `/api/orders?${searchParams.toString()}`
  );

  return response.data;
}

export async function getSaleOrder(saleOrderId: number): Promise<SaleOrder> {
  const response = await axios.get<SaleOrder>(`/api/orders/${saleOrderId}`);

  return response.data;
}
