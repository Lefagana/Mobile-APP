# Backend Handoff Documentation

This document provides the backend team with all necessary information to implement the API endpoints that the Wakanda-X frontend expects.

## Overview

The Wakanda-X frontend is a React Native (Expo) mobile application that currently runs in **mock mode** without a backend. All API calls are routed through `src/services/api.ts`, which switches between mock and real implementations based on the `MOCK_MODE` environment variable.

## Priority API Endpoints

The following endpoints are required for the initial backend implementation, in priority order:

### 1. Authentication (HIGH PRIORITY)

#### Request OTP
- **Endpoint**: `POST /auth/request-otp`
- **Request Body**:
  ```json
  {
    "phone": "+2348012345678"
  }
  ```
- **Response** (200):
  ```json
  {
    "otp_session_id": "session_1234567890",
    "ttl_seconds": 300
  }
  ```
- **Error Responses**:
  - `400`: Invalid phone number format
  - `429`: Too many requests (rate limiting)

#### Verify OTP
- **Endpoint**: `POST /auth/verify-otp`
- **Request Body**:
  ```json
  {
    "otp_session_id": "session_1234567890",
    "code": "123456"
  }
  ```
- **Response** (200):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_001",
      "phone": "+2348012345678",
      "name": "Ibrahim Musa",
      "email": "ibrahim@example.com",
      "role": "customer",
      "profile_pic": null
    }
  }
  ```
- **Error Responses**:
  - `400`: Invalid OTP code
  - `401`: OTP expired or invalid session
  - `404`: Session not found

### 2. Products (HIGH PRIORITY)

#### List Products
- **Endpoint**: `GET /products`
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `q` (optional): Search query
  - `page` (optional): Page number (default: 1)
  - `lat` (optional): User latitude for location-based results
  - `lng` (optional): User longitude
- **Response** (200):
  ```json
  {
    "items": [
      {
        "id": "prod_001",
        "title": "Groundnut Oil - 1L",
        "name": "Groundnut Oil - 1L",
        "description": "Premium quality groundnut oil",
        "price": 1200.00,
        "currency": "NGN",
        "vendor_id": "vend_001",
        "vendor_name": "LocalMart Pro",
        "images": ["https://example.com/image1.jpg"],
        "image_url": "https://example.com/image1.jpg",
        "variants": [
          {
            "id": "v1",
            "label": "1L",
            "price": 1200,
            "inventory": 50
          }
        ],
        "rating": 4.6,
        "review_count": 120,
        "category": "Groceries",
        "inventory": 50,
        "is_low_price": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "total": 100,
      "per_page": 20
    }
  }
  ```

#### Get Product by ID
- **Endpoint**: `GET /products/:id`
- **Response** (200): Same structure as single product in list above
- **Error Responses**:
  - `404`: Product not found

### 3. Orders (HIGH PRIORITY)

#### Create Order
- **Endpoint**: `POST /orders/create`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "user_id": "user_001",
    "items": [
      {
        "product_id": "prod_001",
        "qty": 2,
        "price": 1200.00,
        "variant_id": "v1"
      }
    ],
    "delivery_address": {
      "lat": 6.5244,
      "lng": 3.3792,
      "text": "123 Lagos Street, Ikeja, Lagos",
      "landmark": "Near mosque",
      "instructions": "Leave with neighbor",
      "type": "home"
    },
    "payment_method": "paystack",
    "meta": {
      "delivery_slot": "ASAP",
      "instructions": "Leave with neighbor",
      "coupon_code": "SAVE20"
    }
  }
  ```
- **Response** (200):
  ```json
  {
    "order_id": "order_001",
    "status": "pending",
    "total": 2400.00,
    "eta": "2024-01-01T14:00:00Z"
  }
  ```
- **Error Responses**:
  - `400`: Invalid request data
  - `401`: Unauthorized
  - `402`: Payment required
  - `422`: Validation errors

#### List Orders
- **Endpoint**: `GET /orders`
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `user_id`: User ID (required)
  - `status` (optional): Filter by status
- **Response** (200): Array of orders (see Order type below)

#### Get Order by ID
- **Endpoint**: `GET /orders/:id`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (200): Single order object

### 4. Payments (HIGH PRIORITY)

#### Initiate Payment
- **Endpoint**: `POST /payments/paystack/initiate`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "order_id": "order_001",
    "amount": 2400.00
  }
  ```
- **Response** (200):
  ```json
  {
    "authorization_url": "https://checkout.paystack.com/xxxxx",
    "reference": "ref_1234567890",
    "access_code": "access_code_123"
  }
  ```

#### Verify Payment
- **Endpoint**: `POST /payments/paystack/verify`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "reference": "ref_1234567890"
  }
  ```
- **Response** (200):
  ```json
  {
    "status": "success",
    "gateway_response": "Successful",
    "reference": "ref_1234567890"
  }
  ```

### 5. Wallet (MEDIUM PRIORITY)

#### Get Wallet Balance
- **Endpoint**: `GET /wallet/:userId`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (200):
  ```json
  {
    "balance": 5000.00,
    "currency": "NGN",
    "transactions": []
  }
  ```

#### Top Up Wallet
- **Endpoint**: `POST /wallet/top-up`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "user_id": "user_001",
    "amount": 10000.00,
    "method": "paystack"
  }
  ```
- **Response** (200): Wallet transaction object

#### Get Wallet Transactions
- **Endpoint**: `GET /wallet/:userId/transactions`
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `limit` (optional): Number of transactions
  - `offset` (optional): Pagination offset
- **Response** (200): Array of wallet transactions

### 6. Chat & Messaging (MEDIUM PRIORITY)

#### List Conversations
- **Endpoint**: `GET /chats`
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `user_id`: User ID (required)
- **Response** (200): Array of chat objects

#### Get Chat Messages
- **Endpoint**: `GET /chats/:chatId/messages`
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `limit` (optional)
  - `offset` (optional)
- **Response** (200): Array of message objects

#### Send Message
- **Endpoint**: `POST /chats/:chatId/messages`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "sender_id": "user_001",
    "content": "Hello, when will my order arrive?"
  }
  ```
- **Response** (200): Message object

### 7. Notifications (LOW PRIORITY)

#### List Notifications
- **Endpoint**: `GET /notifications`
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `user_id`: User ID (required)
  - `unread_only` (optional): Filter unread only
  - `limit` (optional)
  - `offset` (optional)
- **Response** (200): Array of notification objects

#### Mark Notification as Read
- **Endpoint**: `POST /notifications/:notificationId/mark-read`
- **Headers**: `Authorization: Bearer <access_token>`
- **Response** (200): Success

#### Mark All as Read
- **Endpoint**: `POST /notifications/mark-all-read`
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**:
  ```json
  {
    "user_id": "user_001"
  }
  ```
- **Response** (200): Success

## Authentication Flow

1. User enters phone number → `POST /auth/request-otp`
2. User enters OTP code → `POST /auth/verify-otp`
3. Backend returns `access_token` and `refresh_token`
4. Frontend stores tokens in `expo-secure-store`
5. All subsequent requests include `Authorization: Bearer <access_token>` header

### Token Refresh

- **Endpoint**: `POST /auth/refresh`
- **Request Body**:
  ```json
  {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response** (200):
  ```json
  {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token"
  }
  ```

## WebSocket Events

For real-time order tracking and chat updates:

### Connection
- **URL**: `wss://api.wakanda-x.com/ws`
- **Auth**: Include `access_token` in connection query parameter or header

### Events

#### Order Update
```json
{
  "event": "order:update",
  "data": {
    "order_id": "order_001",
    "status": "out_for_delivery",
    "eta": "2024-01-01T14:00:00Z",
    "rider": {
      "id": "rider_001",
      "name": "Ibrahim",
      "lat": 6.5244,
      "lng": 3.3792
    }
  }
}
```

#### New Message
```json
{
  "event": "chat:message",
  "data": {
    "chat_id": "chat_001",
    "message": {
      "id": "msg_001",
      "sender_id": "vend_001",
      "content": "Your order is ready!",
      "created_at": "2024-01-01T12:00:00Z"
    }
  }
}
```

## Webhooks

### Order Status Updates
- **URL**: Configured per vendor
- **Event**: `order.status_changed`
- **Payload**:
  ```json
  {
    "order_id": "order_001",
    "status": "delivered",
    "timestamp": "2024-01-01T14:00:00Z"
  }
  ```

## Error Response Format

All error responses should follow this format:

```json
{
  "error": {
    "message": "Invalid OTP code",
    "code": "INVALID_OTP",
    "errors": {
      "code": ["The code you entered is incorrect"]
    }
  }
}
```

## Security Requirements

1. **Token Format**: JWT tokens
2. **Token Expiration**:
   - Access token: 1 hour
   - Refresh token: 7 days
3. **Token Storage**: Frontend uses `expo-secure-store` (encrypted storage)
4. **HTTPS**: All API calls must use HTTPS
5. **Rate Limiting**: Implement rate limiting for OTP requests (max 3 per phone per hour)
6. **Input Validation**: Validate all inputs server-side
7. **CORS**: Configure CORS appropriately for web builds

## Testing

The frontend includes comprehensive mock data in `src/services/mocks/mockServer.ts`. You can use this as a reference for:
- Expected data structures
- Response formats
- Error scenarios
- Edge cases

## Contact

For questions or clarifications, please refer to:
- Frontend codebase: `src/services/api.ts` for API contracts
- Mock implementation: `src/services/mocks/mockServer.ts` for data structures
- Type definitions: `src/types/index.ts` for TypeScript interfaces

## Next Steps

1. Set up authentication endpoints
2. Implement product listing and search
3. Build order creation flow
4. Integrate Paystack payment gateway
5. Set up WebSocket server for real-time updates
6. Implement notification system



