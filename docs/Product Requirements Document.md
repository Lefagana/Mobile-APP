# Product Requirements Document (PRD): Eazy-Express Super Admin Dashboard

**Author:** Manus AI
**Date:** November 27, 2025
**Version:** 1.0

## 1. Introduction and Goals

### 1.1. Overview

This document outlines the product requirements for the **Eazy-Express Super Admin Dashboard**, a centralized web application designed to provide comprehensive oversight, monitoring, and management capabilities for the entire multi-vendor e-commerce ecosystem. The ecosystem includes the Customer App, Vendor App, and Rider App, as defined by the existing codebase (Eazy-Express/Mobile-APP) API contracts. The dashboard's primary function is to serve as the single source of truth for operational and financial health, enabling proactive administrative intervention.

### 1.2. Product Goals

The primary goals of the Super Admin Dashboard are to:
1.  **Enable Centralized Oversight:** Provide a unified, real-time view of all critical operations across the marketplace (sales, logistics, vendor performance).
2.  **Facilitate Proactive Monitoring:** Display Key Performance Indicators (KPIs) and system health metrics to allow administrators to identify and address issues (e.g., payment failures, delivery delays, vendor non-compliance) before they escalate.
3.  **Support Operational Management:** Offer administrative tools for managing users (Customers, Vendors, Riders), products, orders, and financial transactions (commissions, payouts, refunds).
4.  **Ensure Data-Driven Decisions:** Transform raw transactional data into actionable insights and reports for strategic business planning.

### 1.3. Core Principles

The design and implementation of the dashboard will adhere to the following core principles:

| Principle | Description | Rationale |
| :--- | :--- | :--- |
| **Centralized Oversight** | Provide a unified view of all platform activities, including customer orders, vendor performance, and logistics operations. | Necessary for managing the complexity of a multi-vendor, multi-role system. |
| **Real-Time Monitoring** | Display critical operational data (e.g., active riders, pending orders, server health) with minimal latency. | Essential for timely intervention in logistics and payment issues. |
| **Actionable Insights** | Offer tools and data that drive administrative action (e.g., vendor suspension, product approval, dispute resolution). | Allows the admin to maintain marketplace quality and efficiency. |
| **Scalability and Security** | The architecture must be scalable and support future segregation of data for different administrative roles (e.g., Vendor or Rider management sub-dashboards). | Ensures long-term viability and data protection. |

## 2. Functional Requirements (FR)

The functional requirements are organized by the primary modules of the dashboard. All data points are derived from the existing API contracts, specifically the models for Users, Products, Orders, Vendors, and Wallet.

### 2.1. Executive Summary Dashboard (Home)

This module provides a high-level, immediate view of the platform's overall health and performance.

| Requirement ID | Description | Data Source (API Contract) |
| :--- | :--- | :--- |
| **FR 2.1.1** | The dashboard shall display Key Performance Indicators (KPIs) for the selected time period (e.g., Today, Last 7 Days, Last 30 Days). Metrics include **Gross Merchandise Value (GMV)**, Total Admin Commission Earned, Average Order Value (AOV), Total Orders, and New User Registrations (Customers, Vendors, Riders). | `/orders`, `/wallet`, `/auth` (user counts) |
| **FR 2.1.2** | The system shall include time-series charts for GMV, Total Orders, and New Registrations to visualize trends and identify anomalies over the selected period. | Aggregated historical data |
| **FR 2.1.3** | A "Quick Actions" panel shall be present, providing direct links to high-priority administrative tasks such as "Approve Pending Products" and "Review Pending Returns." | Implied Admin-only endpoints |

### 2.2. Vendor Management Module

This module focuses on the administration and performance monitoring of the marketplace's sellers.

| Requirement ID | Description | Data Source (API Contract) |
| :--- | :--- | :--- |
| **FR 2.2.1** | The system shall provide a searchable and filterable list of all registered vendors (`/vendors` endpoint). Filters must include Status (Active, Pending, Suspended) and Vendor Rating. | `/vendors` |
| **FR 2.2.2** | A detailed Vendor Profile view shall display Vendor Information, Performance Metrics (Average Rating, Total Sales, Order Fulfillment Rate), a list of associated products, and a transaction history (Commissions, Payouts). | `/vendors/:id`, `/products?vendor_id=...`, `/wallet` |
| **FR 2.2.3** | The Super Admin shall be able to perform administrative actions on vendor accounts, including approving new registrations, suspending/activating accounts, and editing core profile information. | Implied Admin-only endpoints |
| **FR 2.2.4** | A dedicated **Product Approval Queue** shall display products submitted by vendors that require admin review. The admin must be able to view product details and approve or reject the listing before it goes live. | Implied Admin-only endpoints |

### 2.3. Logistics and Rider Monitoring Module

This module is crucial for monitoring the efficiency and performance of the delivery network.

| Requirement ID | Description | Data Source (API Contract) |
| :--- | :--- | :--- |
| **FR 2.3.1** | The system shall display a **Real-Time Rider Map** showing the current location and status (Available, On-Delivery, Offline) of all active riders. | Implied `/riders/location` endpoint |
| **FR 2.3.2** | Key rider performance metrics shall be tracked and displayed, including **On-Time Delivery Rate (OTDR)**, Average Delivery Time (ADT), Total Deliveries Completed, and Rider Ratings. | `/orders` (delivery details), Implied Rider-specific reviews |
| **FR 2.3.3** | The system shall monitor and display the average time taken for a rider to accept a new order assignment, highlighting potential bottlenecks in the dispatch process. | `/orders` (rider_id, status timestamps) |
| **FR 2.3.4** | The Super Admin shall have a management view for all riders, including their vehicle details (`"vehicle": "Motorcycle"` from `/orders/:id`) and account status management. | Implied Admin-only endpoints |

### 2.4. Order and Customer Management Module

This module handles the lifecycle of orders and the management of customer accounts.

| Requirement ID | Description | Data Source (API Contract) |
| :--- | :--- | :--- |
| **FR 2.4.1** | The system shall provide a searchable and filterable list of all orders (`/orders` endpoint). Filters must include Order Status, Vendor, and Date Range. | `/orders` |
| **FR 2.4.2** | A comprehensive Order Detail View shall display the Order Status History, Customer and Vendor details, Rider assignment details, and Payment Information (Method, Status, Reference). | `/orders/:id` |
| **FR 2.4.3** | A dedicated view for **Returns and Refunds** shall allow the admin to track all return requests (`/orders/:id/returns`), review the reason and photos, and approve or reject the refund. | `/orders/:id/returns` |
| **FR 2.4.4** | The Super Admin shall be able to search for customers, view their profile details, and review their complete order history. | `/auth` (user details), `/orders` |

### 2.5. System Health and Monitoring Module

This module focuses on the technical stability and communication oversight of the platform.

| Requirement ID | Description | Data Source (API Contract) |
| :--- | :--- | :--- |
| **FR 2.5.1** | The system shall track and visualize the success and error rates for key API endpoints (e.g., `/orders`, `/payments/verify`) to monitor API health. | Implied Admin-only endpoint (e.g., `/admin/logs`) |
| **FR 2.5.2** | The system shall log and display the status of all outgoing webhooks (`order.status_changed`, `payment.completed`), highlighting any failures for manual retry or investigation. | Implied Admin-only endpoint (e.g., `/admin/webhooks`) |
| **FR 2.5.3** | The system shall provide a read-only view of active conversations (`/chats`, `/chats/:id/messages`) between customers, vendors, and riders for dispute resolution and quality assurance. | `/chats`, `/chats/:id/messages` |

## 3. Non-Functional Requirements (NFR)

The following non-functional requirements define the quality attributes of the dashboard.

| Requirement | Description | Metric |
| :--- | :--- | :--- |
| **Performance** | Dashboard pages must load and display data within 3 seconds, even with complex data visualizations. | Load Time < 3s |
| **Scalability** | The system must handle up to 10,000 orders and 500 active vendors daily without performance degradation. | Stress Test Results |
| **Security** | All access must be authenticated and authorized using Role-Based Access Control (RBAC). Data transmission must use HTTPS. | Penetration Test Results |
| **Availability** | The dashboard must maintain 99.9% uptime to ensure continuous monitoring capabilities. | Uptime Monitoring |
| **Data Freshness** | Critical operational data (e.g., Rider Status, Order Status) must be updated in near real-time (sub-5 seconds). | Data Latency < 5s |

## 4. High-Level Design Pattern: CQRS and Technical Architecture

The architecture for the Super Admin Dashboard must be decoupled from the core transactional e-commerce API to ensure that heavy reporting and data aggregation tasks do not impact the performance of the mobile applications.

### 4.1. Design Pattern: Command Query Responsibility Segregation (CQRS)

The recommended design pattern is a variation of **CQRS** (Command Query Responsibility Segregation). In this model, the core e-commerce API handles all transactional **Commands** (writes), while a separate **Reporting/Query Layer** handles the complex data retrieval and aggregation required by the dashboard (reads). This separation ensures that the dashboard's complex queries do not contend with the high-volume transactional traffic of the mobile apps.

### 4.2. Technical Architecture Overview

The architecture is composed of three main layers:

#### 4.2.1. Transactional Layer (Core E-commerce API)
*   **Purpose:** Handles all real-time operations and data persistence for the Customer, Vendor, and Rider Apps.
*   **Components:** The existing API endpoints (e.g., `/orders`, `/products`).
*   **Data Source:** Primary Transactional Database (e.g., PostgreSQL, MySQL).

#### 4.2.2. Data Aggregation and Reporting Layer (Dashboard Backend)
*   **Purpose:** Ingests data from the Transactional Layer, transforms it, and stores it in an optimized format for fast querying by the dashboard. This layer is the key to achieving the **Performance** and **Data Freshness** NFRs.
*   **Data Ingestion Mechanism:**
    *   **Webhooks:** The Transactional Layer should send webhooks (`order.status_changed`, `payment.completed`) to the Reporting Layer for near real-time updates on critical events.
    *   **Batch Processing:** Scheduled jobs (e.g., nightly ETL) to synchronize large datasets (e.g., user profiles, product catalogs) and calculate complex, historical KPIs (e.g., monthly GMV).
*   **Data Source:** Dedicated Reporting Database (e.g., a NoSQL store like MongoDB for flexible reporting, or a dedicated Data Warehouse for analytics).

#### 4.2.3. Presentation Layer (Super Admin Dashboard Frontend)
*   **Purpose:** The user interface that consumes data from the Reporting Layer API and visualizes it.
*   **Technology Stack Recommendation:**
    *   **Frontend:** **React** or **Next.js** for a modern, component-based UI, leveraging the existing team's potential familiarity with the React ecosystem.
    *   **UI Framework:** **MUI** or **Ant Design** for rich administrative components and data tables.
    *   **Visualization:** **Chart.js** or **Recharts** for rendering dynamic charts and graphs.

## 5. Next Steps

The following steps are recommended to move from requirements to implementation:

1.  **Detailed API Specification:** Define the specific REST or GraphQL endpoints for the Dashboard Backend API (Reporting Layer) to serve the KPIs and detailed data required by the frontend.
2.  **UI/UX Wireframing:** Create mockups and wireframes based on the functional requirements to visualize the dashboard layout and user experience.
3.  **Technology Finalization:** Select the specific database and backend framework for the Data Aggregation and Reporting Layers.
4.  **Development Initiation:** Begin implementation, prioritizing the data ingestion pipeline and the Executive Summary module.
