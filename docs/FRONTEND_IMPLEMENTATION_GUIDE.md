# Eazy-Express Admin Dashboard: Frontend Implementation Guide

 
**Focus:** Frontend Structure & Implementation with demo data 

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Functional Requirements](#2-functional-requirements)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Component Structure](#5-component-structure)
6. [UI/UX Specifications](#6-uiux-specifications)
7. [Real-Time Features](#7-real-time-features)
8. [Implementation Roadmap](#8-implementation-roadmap)

---

## 1. Product Overview

### 1.1 Introduction

The **Eazy-Express Super Admin Dashboard** is a centralized web application providing comprehensive oversight, monitoring, and management capabilities for the entire multi-vendor e-commerce ecosystem (Customer App, Vendor App, and Rider App).

### 1.2 Core Goals

1. **Centralized Oversight:** Unified, real-time view of all marketplace operations
2. **Proactive Monitoring:** Display KPIs and system health metrics for early issue detection
3. **Operational Management:** Tools for managing users, products, orders, and financial transactions
4. **Data-Driven Decisions:** Transform transactional data into actionable insights

### 1.3 Core Principles

| Principle | Description | Rationale |
|:---|:---|:---|
| **Centralized Oversight** | Unified view of platform activities | Manage multi-vendor, multi-role complexity |
| **Real-Time Monitoring** | Critical operational data with minimal latency | Enable timely intervention |
| **Actionable Insights** | Tools driving administrative action | Maintain marketplace quality |
| **Scalability** | Support future role segregation | Long-term viability |

### 1.4 Non-Functional Requirements

| Requirement | Metric | Implementation Priority |
|:---|:---|:---|
| **Performance** | Page load < 3s | High |
| **Scalability** | Handle 10,000 orders, 500 vendors daily | Medium |
| **Availability** | 99.9% uptime | High |
| **Data Freshness** | Critical data updates < 5s | High |
| **Security** | RBAC, HTTPS, MFA | Critical |

---

## 2. Functional Requirements

### 2.1 Executive Summary Dashboard (Home)

**Purpose:** High-level platform health and performance overview

**Key Metrics Cards:**
- **Revenue Metrics:** GMV, Admin Commission, AOV, Revenue Growth
- **Order Metrics:** Total Orders (Pending, Processing, Delivered, Cancelled)
- **User Metrics:** Total users, Active Users (Customers, Vendors, Riders), New Registrations
- **Operational Metrics:** Average Delivery Time, On-Time Delivery Rate, Refund Rate

**Visualizations:**
- Time-series charts: GMV, Total Orders, New Registrations (selectable periods: Today, 7 Days, 30 Days, Year)
- Status distribution: Pie charts for order status, payment methods
- Geographic heatmap: Order distribution by location

**Quick Actions Panel:**
- Approve Pending Products
- Review Pending Returns
- View Support Tickets
- System Health Check

**Real-Time Activity Feed:**
- New orders
- New user registrations
- Vendor approvals/rejections
- Payment transactions
- System alerts

---

### 2.2 Vendor Management Module

**List View Features:**
- **Search & Filter:** Shop name, status (Active, Pending, Suspended), KYC status, category, location, rating
- **Sort Options:** Registration date, total sales, rating, commission earned
- **Bulk Actions:** Approve, reject, suspend, activate, export
- **Display Columns:** Shop name, status badge, KYC badge, rating, total sales, commission rate, actions

**Detail View Features:**
- **Business Information:** Shop name, description, contact details, operating hours, service areas
- **KYC Documents:** Verification status, document viewer/download, approval workflow
- **Financial Summary:** Total earnings, pending payouts, commission paid, payout schedule
- **Performance Metrics:** Rating (stars), reviews count, response time, order fulfillment rate
- **Product Catalog:** Total products, active/inactive counts, featured products
- **Sales Statistics:** Total sales, orders, AOV, sales trends chart
- **Order History:** Paginated order list with filters

**Product Approval Queue:**
- Filter: Pending review products only
- Display: Product image, name, vendor, category, price, submitted date
- Actions: Quick approve/reject with reason, view full details

**Administrative Actions:**
- Approve/Reject KYC (with reason modal)
- Update commission rate (inline edit or modal)
- Suspend/Activate account (with confirmation)
- Send notification to vendor

---


comments: modify and improve everything about the rider to be in form os delivery as there might be different rider/carrier to take befor reachin the destination.

### 2.3 Logistics & Rider Monitoring Module 

**Real-Time Rider Map:**
- Interactive map showing all rider locations
- Status indicators: Available (green), On-Delivery (blue), Offline (gray)
- Click rider marker for quick info and actions
- Filter by status, zone

**List View Features:**
- **Search & Filter:** Name, phone, status, vehicle type, location, zone
- **Performance Metrics Display:** Delivery count, rating, OTDR, average delivery time
- **Bulk Actions:** Activate, suspend, assign zone

**Detail View Features:**
- **Profile Information:** Name, phone, email, profile picture, vehicle details, license info
- **Current Location:** Real-time map view with last updated timestamp
- **Active Deliveries:** Current delivery details with estimated arrival
- **Performance Statistics:**
  - Total Deliveries
  - On-Time Delivery Rate (OTDR)
  - Average Delivery Time (ADT)
  - Customer Rating
  - Total Earnings
  - Rider Acceptance Time (time to accept new assignments)
- **Delivery History:** Filterable, paginated delivery list
- **Earnings & Payout History:** Transaction list, pending payouts

---

### 2.4 Order & Customer Management Module

**Order List View:**
- **Advanced Filters:** Status, date range, vendor, customer, rider, payment status, amount range
- **Sort Options:** Date, amount, status, delivery time
- **Status Badges:** Color-coded (Pending: yellow, Processing: blue, Delivered: green, Cancelled: red)
- **Quick Actions:** View details, update status, assign rider, process refund, print invoice
- **Export:** CSV/Excel with selected filters

**Order Detail View:**
- **Order Summary:** ID, date, status timeline, total amount breakdown
- **Customer Details:** Name, phone, address, order history link
- **Vendor Details:** Shop name, contact, location
- **Rider Assignment:** Current rider, tracking status, location map
- **Order Items:** Product list with images, quantities, prices, variants
- **Payment Information:** Method, status, transaction ID, payment gateway reference
- **Delivery Address:** Full address, delivery instructions, contact
- **Status Timeline:** Visual timeline with timestamps for each status change
- **Actions:** Update status dropdown, assign/reassign rider, process refund modal, cancel order

**Returns & Refunds Management:**
- **Return Requests List:** All return requests from `/orders/:id/returns`
- **Filter:** Status (Pending, Approved, Rejected), date range, reason
- **Display:** Order ID, customer, reason, photos, requested date, status
- **Actions:** View photos, approve/reject with reason, process refund

**Customer Management:**
- **List View:** Search (name, email, phone), filter (status, registration date, total spent)
- **Detail View:**
  - Profile information
  - Order history with statistics
  - Purchase analytics (total spent, AOV, favorite categories)
  - Wallet balance and transaction history
  - Saved addresses
  - Support tickets/chat history
  - Account activity log
- **Actions:** Edit profile, suspend/activate account, send notification, view orders

---

### 2.5 System Health & Monitoring Module

**API Health Monitoring:**
- **Endpoint Success/Error Rates:** Visual charts for key endpoints (`/orders`, `/payments/verify`)
- **Response Time Tracking:** Average, p95, p99 response times
- **Error Log Viewer:** Recent errors with filtering and search

**Webhook Monitoring:**
- **Webhook Status Dashboard:** Status of all outgoing webhooks
- **Event Types:** `order.status_changed`, `payment.completed`, etc.
- **Failure Tracking:** Failed webhooks highlighted with retry option
- **Manual Retry:** Requeue failed webhooks

**Chat Management & Oversight:**
- **Conversation List:** All active chats between customers, vendors, riders
- **Filters:** User type, date, vendor, status
- **Chat Viewer:** Read-only view of messages
- **Use Cases:** Dispute resolution, quality assurance

**System Status:**
- Server health (CPU, memory, disk usage)
- Database status and connection pool
- Cache (Redis) status
- Active WebSocket connections

---

## 3. Frontend Architecture

### 3.1 Architecture Pattern: CQRS-Inspired Frontend

```
┌─────────────────────────────────────────────────────┐
│         Admin Dashboard (Next.js Frontend)          │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Presentation Layer (React Components)       │  │
│  │  • Pages • Layouts • Components • UI Library│  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
│  ┌──────────────▼───────────────────────────────┐  │
│  │  State Management Layer                      │  │
│  │  • TanStack Query (Server State)             │  │
│  │  • Zustand (Client State)                    │  │
│  │  • React Context (Global App State)          │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                   │
│  ┌──────────────▼───────────────────────────────┐  │
│  │  Data Access Layer                           │  │
│  │  • API Client (Axios/Fetch)                  │  │
│  │  • WebSocket Client (Socket.io)              │  │
│  │  • Query/Mutation Hooks                      │  │
│  └──────────────┬───────────────────────────────┘  │
└─────────────────┼───────────────────────────────────┘
                  │
                  │ REST API + WebSocket
                  │
  ┌───────────────▼────────────────────┐
  │  Backend API (To be implemented)   │
  │  • Reporting Layer Endpoints       │
  │  • Real-time WebSocket Server      │
  └────────────────────────────────────┘
```

### 3.2 Design Patterns

#### Repository Pattern (Frontend)
```typescript
// Abstract data access for easy testing and switching
interface IOrderRepository {
  fetchOrders(filters: OrderFilters): Promise<PaginatedResponse<Order>>;
  fetchOrderById(id: string): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
  assignRider(orderId: string, riderId: string): Promise<Order>;
}

class ApiOrderRepository implements IOrderRepository {
  // Implementation using API client
}
```

#### Service Layer Pattern
```typescript
// Business logic separated from components
class OrderService {
  constructor(private orderRepo: IOrderRepository) {}
  
  async getOrdersWithMetrics(filters: OrderFilters) {
    const orders = await this.orderRepo.fetchOrders(filters);
    const metrics = this.calculateOrderMetrics(orders.data);
    return { orders, metrics };
  }
}
```

#### Observer Pattern (Real-time)
```typescript
// WebSocket event handling
class WebSocketService {
  private listeners: Map<string, Function[]> = new Map();
  
  subscribe(event: string, callback: Function) {
    // Add listener
  }
  
  emit(event: string, data: any) {
    // Trigger listeners
  }
}
```

---

## 4. Technology Stack

### 4.1 Core Framework

**Next.js 14+ with App Router**
- Server-side rendering for initial load performance
- API routes for backend integration layer
- Built-in optimization (image, font, code splitting)
- TypeScript support out of the box
- File-based routing

### 4.2 UI & Styling

**UI Component Library:**
- **Primary Choice:** Material-UI (MUI) v5+
  - Comprehensive admin components (DataGrid, Charts, Tables)
  - Theming system for branding
  - Built-in accessibility
  - Large community and documentation

**Alternative:** Chakra UI (lighter weight, modern)

**Styling:**
- MUI's `sx` prop and styled components
- Emotion (CSS-in-JS)
- Global theme configuration

**Icons:**
- Material Icons (from MUI)
- React Icons (supplementary)

### 4.3 State Management

**Server State: TanStack Query (React Query)**
```typescript
// Example: Fetching orders
const { data, isLoading, error } = useQuery({
  queryKey: ['orders', filters],
  queryFn: () => orderApi.fetchOrders(filters),
  staleTime: 30000, // 30 seconds
  refetchOnWindowFocus: true,
});
```

**Client State: Zustand**
```typescript
// Lightweight store for UI state
interface AppStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const useAppStore = create<AppStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

**Global State: React Context**
- Authentication context
- Permissions context

### 4.4 Data Visualization

**Charts: Recharts**
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<LineChart data={revenueData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="gmv" stroke="#8884d8" />
</LineChart>
```

**Tables: MUI DataGrid**
```typescript
import { DataGrid } from '@mui/x-data-grid';

<DataGrid
  rows={orders}
  columns={orderColumns}
  pageSize={20}
  checkboxSelection
  onRowClick={handleRowClick}
/>
```

**Maps: React Leaflet**
- Real-time rider location tracking
- Interactive maps with markers

### 4.5 Forms & Validation

**React Hook Form + Zod**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const vendorSchema = z.object({
  shopName: z.string().min(3, 'Shop name must be at least 3 characters'),
  commissionRate: z.number().min(0).max(100),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(vendorSchema),
});
```

### 4.6 Real-Time Communication

**Socket.io Client**
```typescript
import { io, Socket } from 'socket.io-client';

const socket = io('ws://api.example.com/admin', {
  auth: { token: adminToken },
});

socket.on('order:created', (order) => {
  // Update UI
  queryClient.invalidateQueries(['orders']);
});
```

### 4.7 Utilities

- **Date Handling:** date-fns
- **HTTP Client:** Axios with interceptors
- **Notifications:** react-hot-toast or MUI Snackbar
- **File Upload:** react-dropzone
- **Export:** xlsx library for Excel export

---

## 5. Component Structure

### 5.1 Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth route group
│   │   └── login/
│   ├── (dashboard)/         # Dashboard route group
│   │   ├── layout.tsx       # Dashboard layout
│   │   ├── page.tsx         # Dashboard home
│   │   ├── vendors/
│   │   │   ├── page.tsx     # Vendor list
│   │   │   └── [id]/
│   │   │       └── page.tsx # Vendor detail
│   │   ├── riders/
│   │   ├── orders/
│   │   ├── customers/
│   │   └── analytics/
│   └── api/                 # API routes (optional)
├── components/
│   ├── layouts/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── common/              # Reusable components
│   │   ├── DataTable/
│   │   ├── StatusBadge/
│   │   ├── MetricCard/
│   │   ├── Chart/
│   │   └── FilterPanel/
│   ├── vendors/             # Vendor-specific components
│   │   ├── VendorList.tsx
│   │   ├── VendorDetail.tsx
│   │   ├── VendorKYCViewer.tsx
│   │   └── ProductApprovalQueue.tsx
│   ├── orders/
│   │   ├── OrderList.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── OrderTimeline.tsx
│   │   └── ReturnRequestManager.tsx
│   ├── riders/
│   │   ├── RiderMap.tsx
│   │   ├── RiderList.tsx
│   │   └── RiderDetail.tsx
│   └── dashboard/
│       ├── MetricsOverview.tsx
│       ├── ActivityFeed.tsx
│       └── QuickActions.tsx
├── lib/
│   ├── api/                 # API client
│   │   ├── client.ts
│   │   ├── orders.ts
│   │   ├── vendors.ts
│   │   ├── riders.ts
│   │   └── customers.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useOrders.ts
│   │   ├── useVendors.ts
│   │   ├── useWebSocket.ts
│   │   └── useAuth.ts
│   ├── utils/
│   │   ├── formatters.ts    # Date, currency, number formatters
│   │   ├── validators.ts
│   │   └── exporters.ts     # CSV/Excel export
│   └── types/
│       ├── orders.ts
│       ├── vendors.ts
│       ├── riders.ts
│       └── users.ts
├── stores/
│   ├── appStore.ts          # Zustand store
│   └── authStore.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── PermissionsContext.tsx
└── styles/
    ├── theme.ts             # MUI theme configuration
    └── globals.css
```

### 5.2 Key Component Examples

#### MetricCard Component
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  loading,
}) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary">{title}</Typography>
            {loading ? (
              <Skeleton width={100} height={40} />
            ) : (
              <Typography variant="h4">{value}</Typography>
            )}
            {change !== undefined && (
              <Typography
                variant="body2"
                color={change >= 0 ? 'success.main' : 'error.main'}
              >
                {change >= 0 ? '+' : ''}{change}%
              </Typography>
            )}
          </Box>
          {icon && <Box>{icon}</Box>}
        </Box>
      </CardContent>
    </Card>
  );
};
```

#### StatusBadge Component
```typescript
type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  pending: { color: 'warning', label: 'Pending' },
  processing: { color: 'info', label: 'Processing' },
  delivered: { color: 'success', label: 'Delivered' },
  cancelled: { color: 'error', label: 'Cancelled' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size="small" />;
};
```

#### DataTable Component (Wrapper)
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: GridColDef[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  checkboxSelection?: boolean;
  onSelectionChange?: (ids: string[]) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  loading,
  onRowClick,
  checkboxSelection,
  onSelectionChange,
}: DataTableProps<T>) {
  return (
    <DataGrid
      rows={data}
      columns={columns}
      loading={loading}
      pageSize={20}
      rowsPerPageOptions={[10, 20, 50, 100]}
      checkboxSelection={checkboxSelection}
      onSelectionModelChange={(ids) => onSelectionChange?.(ids as string[])}
      onRowClick={(params) => onRowClick?.(params.row)}
      autoHeight
      disableSelectionOnClick
    />
  );
}
```

---

## 6. UI/UX Specifications

### 6.1 Layout Structure

```
┌────────────────────────────────────────────────────────┐
│ Header: Logo | Breadcrumb | Search | Notif | Profile   │
├────────────┬───────────────────────────────────────────┤
│            │                                           │
│  Sidebar   │         Main Content Area                │
│  (250px)   │                                           │
│            │  ┌─────────────────────────────────────┐ │
│ Dashboard  │  │  Page Title + Actions               │ │
│ Vendors    │  └─────────────────────────────────────┘ │
│ Riders     │  ┌─────────────────────────────────────┐ │
│ Orders     │  │  Filters / Search Bar               │ │
│ Customers  │  └─────────────────────────────────────┘ │
│ Products   │  ┌─────────────────────────────────────┐ │
│ Analytics  │  │  Content (Cards/Tables/Charts)      │ │
│ Settings   │  │                                     │ │
│            │  │                                     │ │
│            │  └─────────────────────────────────────┘ │
└────────────┴───────────────────────────────────────────┘
```

### 6.2 Color Scheme

**Primary Palette:**
- Primary: `#1976d2` (Blue)
- Secondary: `#dc004e` (Pink)
- Success: `#4caf50` (Green)
- Warning: `#ff9800` (Orange)
- Error: `#f44336` (Red)
- Info: `#2196f3` (Light Blue)

**Background:**
- Background: `#f5f5f5` (Light Gray)
- Paper: `#ffffff` (White)
- Sidebar: `#1a2035` (Dark Blue)

### 6.3 Typography

```typescript
const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
});
```

### 6.4 Responsive Breakpoints

- **xs:** 0px (mobile)
- **sm:** 600px (tablet)
- **md:** 900px (small laptop)
- **lg:** 1200px (desktop)
- **xl:** 1536px (large desktop)

### 6.5 Accessibility

- **WCAG 2.1 AA Compliance**
- Keyboard navigation support
- ARIA labels on all interactive elements
- Focus indicators
- Screen reader support
- Color contrast ratios > 4.5:1

---

## 7. Real-Time Features

### 7.1 WebSocket Integration

**Connection Setup:**
```typescript
// lib/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  private socket: Socket | null = null;
  
  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    
    this.setupListeners();
  }
  
  private setupListeners() {
    this.socket?.on('connect', () => {
      console.log('WebSocket connected');
    });
    
    this.socket?.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }
  
  subscribe(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }
  
  unsubscribe(event: string, callback?: (data: any) => void) {
    this.socket?.off(event, callback);
  }
  
  disconnect() {
    this.socket?.disconnect();
  }
}

export const wsService = new WebSocketService();
```

### 7.2 Real-Time Event Handling

**Events to Subscribe:**
```typescript
interface WebSocketEvents {
  'order:created': Order;
  'order:status_changed': { orderId: string; status: OrderStatus; timestamp: string };
  'payment:completed': { orderId: string; amount: number; paymentId: string };
  'vendor:registered': Vendor;
  'rider:location_update': { riderId: string; lat: number; lng: number; status: RiderStatus };
  'system:alert': { type: string; message: string; severity: 'info' | 'warning' | 'error' };
}
```

**React Hook for WebSocket:**
```typescript
// lib/hooks/useWebSocket.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { wsService } from '../websocket';

export function useWebSocket() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Order events
    wsService.subscribe('order:created', (order) => {
      queryClient.invalidateQueries(['orders']);
      // Show toast notification
      toast.success(`New order #${order.order_id} received`);
    });
    
    wsService.subscribe('order:status_changed', ({ orderId, status }) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', orderId]);
    });
    
    // Rider location updates
    wsService.subscribe('rider:location_update', (data) => {
      queryClient.setQueryData(['rider', data.riderId, 'location'], data);
    });
    
    // System alerts
    wsService.subscribe('system:alert', (alert) => {
      if (alert.severity === 'error') {
        toast.error(alert.message);
      } else if (alert.severity === 'warning') {
        toast.warning(alert.message);
      }
    });
    
    return () => {
      wsService.disconnect();
    };
  }, [queryClient]);
}
```

### 7.3 Real-Time Dashboard Components

**Activity Feed:**
```typescript
export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    wsService.subscribe('order:created', (order) => {
      setActivities((prev) => [
        { type: 'order_created', data: order, timestamp: new Date() },
        ...prev.slice(0, 49),
      ]);
    });
    
    wsService.subscribe('vendor:registered', (vendor) => {
      setActivities((prev) => [
        { type: 'vendor_registered', data: vendor, timestamp: new Date() },
        ...prev.slice(0, 49),
      ]);
    });
  }, []);
  
  return (
    <Card>
      <CardHeader title="Live Activity Feed" />
      <CardContent>
        <List>
          {activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
```

**Real-Time Metrics:**
```typescript
export const RealtimeMetrics: React.FC = () => {
  const { data: metrics } = useQuery(['dashboard-metrics']);
  const [liveMetrics, setLiveMetrics] = useState(metrics);
  
  useEffect(() => {
    wsService.subscribe('metrics:update', (updated) => {
      setLiveMetrics(updated);
    });
  }, []);
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard 
          title="Total Orders Today"
          value={liveMetrics?.todayOrders || 0}
          icon={<ShoppingCartIcon />}
        />
      </Grid>
      {/* More metric cards */}
    </Grid>
  );
};
```

---

## 8. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

**Week 1: Project Setup**
- [x] Initialize Next.js 14 project with TypeScript
- [x] Install and configure MUI
- [x] Set up project structure
- [x] Configure ESLint and Prettier
- [x] Set up Git repository

**Week 2: Core Infrastructure**
- [ ] Create theme configuration
- [ ] Build layout components (DashboardLayout, Sidebar, Header)
- [ ] Implement authentication UI (login page)
- [ ] Set up TanStack Query and Zustand
- [ ] Create API client with mock data

### Phase 2: Dashboard Home (Weeks 3-4)

**Week 3: Metrics & KPIs**
- [ ] Build MetricCard component
- [ ] Create dashboard overview page
- [ ] Implement time period selector (Today, 7D, 30D, Year)
- [ ] Add revenue and order metrics
- [ ] Create placeholder charts

**Week 4: Charts & Activity Feed**
- [ ] Implement Recharts integration
- [ ] Build GMV trend chart
- [ ] Build order volume chart
- [ ] Create real-time activity feed component
- [ ] Add quick actions panel

### Phase 3: Vendor Management (Weeks 5-6)

**Week 5: Vendor List**
- [ ] Build VendorList page with DataGrid
- [ ] Implement search and filters
- [ ] Add status badges and KYC badges
- [ ] Create bulk action toolbar
- [ ] Add export functionality

**Week 6: Vendor Detail**
- [ ] Build VendorDetail page
- [ ] Display business information section
- [ ] Create KYC document viewer
- [ ] Build financial summary section
- [ ] Implement admin actions (approve/suspend/etc.)
- [ ] Create Product Approval Queue component

### Phase 4: Order & Customer Management (Weeks 7-8)

**Week 7: Order Management**
- [ ] Build OrderList page with advanced filters
- [ ] Create OrderDetail page
- [ ] Implement order timeline component
- [ ] Add rider assignment UI
- [ ] Build refund processing modal

**Week 8: Customer & Returns**
- [ ] Build CustomerList page
- [ ] Create CustomerDetail page
- [ ] Implement returns and refunds management
- [ ] Add customer analytics view

### Phase 5: Rider & Logistics (Weeks 9-10)

**Week 9: Rider List & Detail**
- [ ] Build RiderList page
- [ ] Create RiderDetail page
- [ ] Display performance metrics
- [ ] Implement rider actions

**Week 10: Real-Time Tracking**
- [ ] Integrate React Leaflet
- [ ] Build real-time rider map component
- [ ] Implement rider location markers with status colors
- [ ] Add map filters and controls

### Phase 6: Real-Time Features (Weeks 11-12)

**Week 11: WebSocket Integration**
- [ ] Set up Socket.io client
- [ ] Create WebSocket service
- [ ] Build useWebSocket hook
- [ ] Implement real-time activity feed
- [ ] Add real-time metric updates

**Week 12: System Health**
- [ ] Build system health monitoring page
- [ ] Create API health dashboard
- [ ] Implement webhook monitoring
- [ ] Add chat management viewer
- [ ] Create system alerts

### Phase 7: Polish & Optimization (Weeks 13-14)

**Week 13: UI/UX Improvements**
- [ ] Implement loading states (skeleton loaders)
- [ ] Add error boundaries
- [ ] Optimize responsive design
- [ ] Improve accessibility (ARIA labels, keyboard nav)
- [ ] Add dark mode toggle

**Week 14: Performance & Testing**
- [ ] Implement lazy loading for routes
- [ ] Add virtual scrolling for data tables
- [ ] Optimize bundle size (code splitting)
- [ ] Write unit tests for key components
- [ ] Conduct performance testing

### Phase 8: Deployment Prep (Week 15)

- [ ] Production build optimization
- [ ] Environment configuration
- [ ] Documentation (component library, API integration guide)
- [ ] Create deployment guide
- [ ] Final testing and bug fixes

---

## Appendix A: API Integration Guide

### Expected Backend Endpoints

The frontend expects the following REST API endpoints (to be implemented by backend):

**Dashboard:**
- `GET /api/admin/dashboard/overview?period=day|week|month|year`
- `GET /api/admin/dashboard/activity-feed?limit=50`

**Vendors:**
- `GET /api/admin/vendors?page=1&limit=20&search=&status=&kyc_status=`
- `GET /api/admin/vendors/:id`
- `POST /api/admin/vendors/:id/approve-kyc`
- `POST /api/admin/vendors/:id/reject-kyc`
- `PUT /api/admin/vendors/:id/commission-rate`
- `POST /api/admin/vendors/:id/suspend`

**Orders:**
- `GET /api/admin/orders?page=1&limit=20&status=&date_from=&date_to=`
- `GET /api/admin/orders/:id`
- `PUT /api/admin/orders/:id/status`
- `POST /api/admin/orders/:id/assign-rider`
- `POST /api/admin/orders/:id/refund`
- `GET /api/admin/orders/:id/returns`

**Riders:**
- `GET /api/admin/riders?page=1&limit=20&status=`
- `GET /api/admin/riders/:id`
- `GET /api/admin/riders/locations` (all rider locations for map)

**Customers:**
- `GET /api/admin/customers?page=1&limit=20`
- `GET /api/admin/customers/:id`

**System:**
- `GET /api/admin/system/health`
- `GET /api/admin/system/webhooks`
- `GET /api/admin/chats/:id`

### WebSocket Events

**Server should emit:**
- `order:created`
- `order:status_changed`
- `payment:completed`
- `vendor:registered`
- `rider:location_update`
- `system:alert`

---

## Appendix B: Component Checklist

### Completed Components
- [ ] DashboardLayout
- [ ] Sidebar
- [ ] Header
- [ ] MetricCard
- [ ] StatusBadge
- [ ] DataTable
- [ ] FilterPanel
- [ ] Chart (Line, Bar, Pie)

### Vendor Components
- [ ] VendorList
- [ ] VendorDetail
- [ ] VendorKYCViewer
- [ ] ProductApprovalQueue

### Order Components
- [ ] OrderList
- [ ] OrderDetail
- [ ] OrderTimeline
- [ ] ReturnRequestManager

### Rider Components
- [ ] RiderList
- [ ] RiderDetail
- [ ] RiderMap

### Dashboard Components
- [ ] MetricsOverview
- [ ] ActivityFeed
- [ ] QuickActions

---

**END OF DOCUMENT**
