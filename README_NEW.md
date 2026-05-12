# AdminLTE Dashboard - Modern Enterprise Admin Panel

A production-ready, modern Enterprise Admin Dashboard built with Next.js 15, TypeScript, TailwindCSS, and shadcn/ui components.

## ✨ Features

### Core Features
- ✅ **Modern UI Design** - Glassmorphism effects, smooth animations, professional styling
- ✅ **Responsive Layout** - Full mobile, tablet, and desktop support
- ✅ **Dark/Light Theme** - System-aware theme switching with persistence
- ✅ **Advanced Data Tables** - Sorting, filtering, pagination, search
- ✅ **Real-time Analytics** - Revenue charts, customer activity, top products
- ✅ **User Management** - CRUD operations with role-based access
- ✅ **Order Management** - Order tracking with status updates
- ✅ **Product Management** - Product catalog with stock management
- ✅ **Authentication** - Login system with mock data

### Tech Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 with CSS variables
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Tables**: TanStack React Table
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Code Quality**: ESLint with Next.js config

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (admin)/                  # Admin routes group
│   │   ├── dashboard/            # Dashboard overview
│   │   ├── orders/               # Order management
│   │   ├── products/             # Product management
│   │   ├── users/                # User management
│   │   ├── analytics/            # Analytics & reports
│   │   ├── settings/             # Settings page
│   │   └── layout.tsx            # Admin layout wrapper
│   ├── (auth)/                   # Auth routes group
│   │   └── login/                # Login page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (redirects to dashboard)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── layout/                   # Layout components
│   │   ├── AdminLayout.tsx       # Main admin layout
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── Header.tsx            # Top header bar
│   ├── ui/                       # shadcn/ui components
│   ├── widgets/                  # Dashboard widgets
│   │   ├── StatCard.tsx          # Statistics card
│   │   └── SkeletonLoaders.tsx   # Loading skeletons
│   ├── form/                     # Form components
│   ├── DataTable.tsx             # Reusable data table
│   └── ErrorBoundary.tsx         # Error handling
├── hooks/                        # Custom React hooks
│   ├── useTheme.ts               # Theme hook
│   ├── useNotification.ts        # Notification hook
│   ├── useSidebar.ts             # Sidebar state hook
│   └── index.ts                  # Exports
├── store/                        # Zustand stores
│   ├── themeStore.ts             # Theme state
│   ├── uiStore.ts                # UI state (sidebar, notifications)
│   └── authStore.ts              # Authentication state
├── services/                     # API services
│   └── api.ts                    # Mock API functions
├── lib/                          # Utility functions
│   └── utils.ts                  # Helper utilities
├── types/                        # TypeScript types
│   └── index.ts                  # Type definitions
├── schemas/                      # Zod validation schemas
│   ├── authSchema.ts             # Auth form schemas
│   └── formSchema.ts             # CRUD form schemas
├── constants/                    # App constants
│   └── index.ts                  # Constants & enums
├── providers/                    # Context providers
│   ├── ThemeProvider.tsx         # Theme provider
│   └── index.tsx                 # Provider wrapper
└── utils/                        # Additional utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>

# Navigate to project
cd project-04-admin-dashboard

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit `http://localhost:3000` in your browser.

## 📊 Pages Overview

### Dashboard (`/dashboard`)
- **Statistics Cards**: Revenue, Orders, Customers, Products with growth trends
- **Revenue Chart**: Line chart showing revenue and orders over time
- **Top Products**: Bar chart displaying best-performing products
- **Orders by Status**: Pie chart breaking down order statuses
- **Customer Activity**: Weekly customer and order activity chart

### Users (`/users`)
- **User Table**: Displays all system users with pagination
- **Columns**: ID, Name, Email, Role, Status, Department, Last Login
- **Actions**: Edit and delete operations
- **Filters**: Search by name or email
- **Add User**: Dialog modal for adding new users

### Orders (`/orders`)
- **Order Table**: Complete order listing with details
- **Columns**: Order #, Customer, Amount, Status, Payment, Date
- **Status Badges**: Visual indicators for order status
- **Payment Status**: Separate badge for payment state
- **Quick Actions**: View, Edit, Delete buttons
- **Search**: Filter orders by number or customer name

### Products (`/products`)
- **Product Table**: Product catalog with thumbnails
- **Columns**: Name, Category, Price, Stock, Rating, Status
- **Stock Indicators**: Color-coded stock levels
- **Ratings**: Star ratings with review counts
- **Inventory**: Real-time stock management
- **Search**: Find products by name or category

### Analytics (`/analytics`)
- **Overview Stats**: Total visits, conversion rate, average session
- **Site Visits**: Bar chart showing visits vs conversions
- **Revenue Trend**: Line chart tracking revenue changes
- **Top Pages**: Most visited pages with bounce rates

### Settings (`/settings`)
- **Account Settings**: Email, name, phone management
- **Appearance**: Theme selection (Light, Dark, System)
- **Notifications**: Email, push, and marketing preferences
- **Security**: Password change functionality

### Login (`/login`)
- **Authentication**: Email and password login
- **Demo Credentials**: Pre-filled for testing
- **Remember Me**: Session persistence
- **Forgot Password**: Link for password recovery

## 🎨 Theme System

The application includes a sophisticated theme system:

```typescript
// Use theme hook
const { theme, setTheme, isDark } = useTheme();

// Theme options
setTheme('light')    // Light mode
setTheme('dark')     // Dark mode
setTheme('system')   // Follow system preference
```

- **Persistent Storage**: Theme preference saved to localStorage
- **System Detection**: Automatically detects system theme preference
- **CSS Variables**: Dynamic theme colors using CSS custom properties
- **Dark Mode Support**: Full Tailwind dark mode implementation

## 🔔 Notifications System

Toast-style notifications with auto-dismiss:

```typescript
// Use notification hook
const { success, error, warning, info } = useNotification();

success('Operation completed!')
error('Something went wrong')
warning('Please be careful')
info('New update available')
```

## 🔐 State Management

### Authentication Store
```typescript
const { user, isAuthenticated, setUser, logout } = useAuthStore();
```

### Theme Store
```typescript
const { theme, setTheme, resolvedTheme } = useThemeStore();
```

### UI Store
```typescript
const { sidebarOpen, toggleSidebar, notifications } = useUIStore();
```

## 📋 Form Validation

All forms use Zod schemas for type-safe validation:

- **Login Form**: Email and password validation
- **User Form**: Name, email, role, department validation
- **Product Form**: Product details with category and inventory
- **Customer Form**: Full contact information validation

## 📊 Mock API

The application includes mock API services that simulate real API responses:

```typescript
// Get users with pagination
const response = await getUsers(page, limit);

// Get products
const products = await getProductData(page, limit);

// Get orders
const orders = await getOrders(page, limit);

// Get dashboard statistics
const stats = await getDashboardStats();

// Get analytics data
const revenueData = await getRevenueData();
const topProducts = await getTopProducts();
```

All API calls include 300-800ms delays to simulate real network latency.

## 🎯 Component Highlights

### StatCard
Displays key metrics with trends:
```tsx
<StatCard
  title="Total Revenue"
  value="$124,500"
  trend={12.5}
  variant="success"
  icon={<TrendingUp />}
/>
```

### DataTable
Powerful table with built-in features:
- Column sorting
- Global filtering/search
- Pagination
- Responsive scrolling
- Empty states

### Sidebar
Smart navigation with:
- Collapsible menu
- Active route highlighting
- Badge notifications
- Responsive drawer on mobile
- Icon support

### Header
Professional top bar with:
- Theme toggle
- Notification center
- User profile dropdown
- Logout functionality

## 🔧 Customization

### Colors & Branding
Edit `src/app/globals.css` for color scheme changes.

### Menu Items
Modify `src/constants/index.ts` SIDEBAR_MENUS for navigation items.

### API Endpoints
Update `src/services/api.ts` with real API calls.

### Form Schemas
Customize `src/schemas/` for form validation rules.

## 📱 Responsive Design

- **Mobile**: Single column layout with full-screen sidebar drawer
- **Tablet**: Adjusted spacing and two-column grids
- **Desktop**: Full sidebar with three-column grids

## 🚀 Performance Optimizations

- Code splitting with lazy loading
- Image optimization
- CSS-in-JS elimination
- Dynamic imports for heavy components
- Skeleton loaders for better perceived performance

## 🔐 Security Features

- Type-safe with TypeScript
- Input validation with Zod
- XSS protection with React
- CSRF protection ready
- Secure headers configured

## 📦 Dependencies

Key dependencies include:
- `next`: Framework
- `react`: UI library
- `tailwindcss`: Styling
- `zustand`: State management
- `react-hook-form`: Form handling
- `zod`: Validation
- `recharts`: Charts
- `lucide-react`: Icons
- `@tanstack/react-table`: Data tables

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this dashboard as a template for your projects.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [Next.js](https://nextjs.org/)

---

**Ready to deploy?** This dashboard is production-ready and can be deployed to Vercel, AWS, or any Node.js hosting platform.
