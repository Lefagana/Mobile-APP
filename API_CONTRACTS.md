# API Contracts Documentation

This document outlines the API contracts used in the Wakanda e-commerce mobile application. All endpoints are currently mocked for frontend development, but these contracts define the expected structure for backend integration.

## Base URL

```
Production: https://api.wakanda.com/v1
Development: https://api-dev.wakanda.com/v1
Mock: Uses mockServer.ts for local development
```

## Authentication

### Headers
All authenticated requests require:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Refresh
- Access tokens expire after 24 hours
- Refresh tokens expire after 30 days
- Use `/auth/refresh` endpoint to obtain new access token

---

## Authentication Endpoints

### POST `/auth/phone/request-otp`
Request OTP for phone number verification.

**Request:**
```json
{
  "phone": "+2341234567890",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expires_in": 300
}
```

### POST `/auth/phone/verify-otp`
Verify OTP and authenticate user.

**Request:**
```json
{
  "phone": "+2341234567890",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_001",
    "name": "John Doe",
    "phone": "+2341234567890",
    "email": "john@example.com",
    "profile_pic": "https://...",
    "role": "customer"
  },
  "tokens": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400
  }
}
```

### POST `/auth/refresh`
Refresh access token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}
```

---

## Products Endpoints

### GET `/products`
List products with filtering and pagination.

**Query Parameters:**
- `category` (string, optional): Filter by category
- `vendor_id` (string, optional): Filter by vendor
- `search` (string, optional): Search query
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page
- `sort` (string, optional): Sort order (price_asc, price_desc, rating, newest)

**Response:**
```json
{
  "items": [
    {
      "id": "prod_001",
      "title": "Product Name",
      "description": "Product description",
      "price": 5000,
      "currency": "NGN",
      "images": ["https://..."],
      "category": "electronics",
      "vendor_id": "vendor_001",
      "vendor_name": "Shop Name",
      "rating": 4.5,
      "review_count": 120,
      "inventory": 50,
      "variants": [
        {
          "id": "var_001",
          "label": "Small",
          "price": 5000,
          "inventory": 20
        }
      ],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

### GET `/products/:id`
Get product details.

**Response:**
```json
{
  "id": "prod_001",
  "title": "Product Name",
  "description": "Full product description",
  "price": 5000,
  "currency": "NGN",
  "images": ["https://..."],
  "category": "electronics",
  "vendor_id": "vendor_001",
  "vendor": {
    "id": "vendor_001",
    "shop_name": "Shop Name",
    "rating": 4.8,
    "address_text": "123 Main St"
  },
  "rating": 4.5,
  "review_count": 120,
  "inventory": 50,
  "variants": [...],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET `/products/:id/reviews`
Get product reviews with pagination.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**
```json
{
  "reviews": [
    {
      "id": "rev_001",
      "user_id": "user_001",
      "user_name": "John Doe",
      "user_avatar": "https://...",
      "rating": 5,
      "comment": "Great product!",
      "images": ["https://..."],
      "verified_purchase": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 10,
    "average_rating": 4.5
  }
}
```

### GET `/products/:id/related`
Get related products.

**Response:**
```json
{
  "items": [
    {
      "id": "prod_002",
      "title": "Related Product",
      "price": 3000,
      "images": ["https://..."],
      ...
    }
  ]
}
```

---

## Cart Endpoints

### GET `/cart`
Get user's cart.

**Response:**
```json
{
  "id": "cart_001",
  "items": [
    {
      "id": "item_001",
      "product_id": "prod_001",
      "product": {
        "id": "prod_001",
        "title": "Product Name",
        "price": 5000,
        "images": ["https://..."]
      },
      "variant_id": "var_001",
      "quantity": 2,
      "price": 5000
    }
  ],
  "subtotal": 10000,
  "delivery_fee": 500,
  "total": 10500,
  "currency": "NGN"
}
```

### POST `/cart/items`
Add item to cart.

**Request:**
```json
{
  "product_id": "prod_001",
  "variant_id": "var_001",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "item": {
    "id": "item_001",
    "product_id": "prod_001",
    "variant_id": "var_001",
    "quantity": 1,
    "price": 5000
  }
}
```

### PUT `/cart/items/:id`
Update cart item quantity.

**Request:**
```json
{
  "quantity": 3
}
```

### DELETE `/cart/items/:id`
Remove item from cart.

### POST `/cart/apply-coupon`
Apply coupon code.

**Request:**
```json
{
  "code": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "discount": 1000,
  "new_total": 9500
}
```

### DELETE `/cart`
Clear entire cart.

---

## Orders Endpoints

### GET `/orders`
List user's orders.

**Query Parameters:**
- `status` (string, optional): Filter by status
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response:**
```json
{
  "items": [
    {
      "id": "order_001",
      "order_id": "ORD-2024-001",
      "status": "delivered",
      "total": 10500,
      "currency": "NGN",
      "items": [
        {
          "id": "item_001",
          "product_id": "prod_001",
          "product": {...},
          "variant_id": "var_001",
          "qty": 2,
          "price": 5000
        }
      ],
      "delivery_address": {...},
      "payment_info": {
        "method": "paystack",
        "status": "success",
        "reference": "ref_001"
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

### GET `/orders/:id`
Get order details.

**Response:**
```json
{
  "id": "order_001",
  "order_id": "ORD-2024-001",
  "status": "delivered",
  "total": 10500,
  "currency": "NGN",
  "items": [...],
  "delivery_address": {
    "id": "addr_001",
    "label": "Home",
    "address_text": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria"
  },
  "vendor": {
    "id": "vendor_001",
    "shop_name": "Shop Name",
    "phone": "+2341234567890"
  },
  "rider": {
    "id": "rider_001",
    "name": "Rider Name",
    "phone": "+2341234567890",
    "vehicle": "Motorcycle"
  },
  "payment_info": {
    "method": "paystack",
    "status": "success",
    "reference": "ref_001"
  },
  "delivery_type": "standard",
  "delivery_slot": "asap",
  "delivery_instructions": "Leave at door",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### POST `/orders`
Create new order.

**Request:**
```json
{
  "items": [
    {
      "product_id": "prod_001",
      "variant_id": "var_001",
      "quantity": 2
    }
  ],
  "delivery_address_id": "addr_001",
  "delivery_type": "standard",
  "delivery_slot": "asap",
  "delivery_instructions": "Leave at door",
  "payment_method": "paystack",
  "rider_id": "rider_001"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_001",
    "order_id": "ORD-2024-001",
    "status": "pending",
    "total": 10500,
    ...
  }
}
```

### GET `/orders/:id/receipt`
Download order receipt (PDF).

**Response:**
- Content-Type: `application/pdf`
- Returns PDF file

---

## Payment Endpoints

### POST `/payments/initiate`
Initiate payment for an order.

**Request:**
```json
{
  "order_id": "order_001",
  "method": "paystack"
}
```

**Response:**
```json
{
  "success": true,
  "authorization_url": "https://checkout.paystack.com/...",
  "reference": "ref_001",
  "access_code": "access_001"
}
```

### POST `/payments/verify`
Verify payment status.

**Request:**
```json
{
  "reference": "ref_001"
}
```

**Response:**
```json
{
  "success": true,
  "status": "success",
  "gateway_response": "Successful"
}
```

---

## Address Endpoints

### GET `/addresses`
List user's addresses.

**Response:**
```json
{
  "items": [
    {
      "id": "addr_001",
      "label": "Home",
      "address_text": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "is_default": true
    }
  ]
}
```

### POST `/addresses`
Create new address.

**Request:**
```json
{
  "label": "Home",
  "address_text": "123 Main St",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "is_default": false
}
```

### PUT `/addresses/:id`
Update address.

### DELETE `/addresses/:id`
Delete address.

---

## Chat Endpoints

### GET `/chats`
List user's conversations.

**Response:**
```json
{
  "items": [
    {
      "id": "chat_001",
      "order_id": "order_001",
      "participants": ["user_001", "vendor_001"],
      "last_message": "Hello",
      "updated_at": "2024-01-01T00:00:00Z",
      "unread_count": 2
    }
  ]
}
```

### GET `/chats/:id`
Get chat details.

### GET `/chats/:id/messages`
Get chat messages.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)

**Response:**
```json
{
  "items": [
    {
      "id": "msg_001",
      "chat_id": "chat_001",
      "sender_id": "user_001",
      "content": "Hello",
      "attachments": [
        {
          "type": "image",
          "url": "https://..."
        }
      ],
      "created_at": "2024-01-01T00:00:00Z",
      "read": false
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 50
  }
}
```

### POST `/chats/:id/messages`
Send message.

**Request:**
```json
{
  "content": "Hello",
  "attachments": [
    {
      "type": "image",
      "url": "https://..."
    }
  ]
}
```

---

## Return/Refund Endpoints

### POST `/orders/:id/returns`
Initiate return request.

**Request:**
```json
{
  "items": [
    {
      "order_item_id": "item_001",
      "reason": "defective",
      "quantity": 1
    }
  ],
  "resolution": "refund",
  "photos": ["https://..."]
}
```

**Response:**
```json
{
  "success": true,
  "return_id": "return_001",
  "status": "pending"
}
```

### GET `/orders/:id/returns`
Get return status.

---

## Wallet Endpoints

### GET `/wallet`
Get wallet balance and transactions.

**Response:**
```json
{
  "balance": 50000,
  "currency": "NGN",
  "transactions": [
    {
      "id": "txn_001",
      "type": "credit",
      "amount": 10000,
      "description": "Top up",
      "status": "completed",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST `/wallet/top-up`
Top up wallet.

**Request:**
```json
{
  "amount": 10000,
  "payment_method": "paystack"
}
```

---

## Vendors Endpoints

### GET `/vendors`
List vendors.

**Query Parameters:**
- `search` (string, optional)
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response:**
```json
{
  "items": [
    {
      "id": "vendor_001",
      "shop_name": "Shop Name",
      "description": "Shop description",
      "rating": 4.8,
      "address_text": "123 Main St",
      "logo": "https://..."
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

### GET `/vendors/:id`
Get vendor details.

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `SERVER_ERROR` (500): Internal server error
- `RATE_LIMIT_EXCEEDED` (429): Too many requests

---

## Pagination

All list endpoints support pagination with the following query parameters:

- `page` (number, default: 1): Page number
- `limit` (number, default: 20, max: 100): Items per page

Response includes `meta` object:
```json
{
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

---

## Rate Limiting

- Authenticated requests: 100 requests per minute
- Unauthenticated requests: 20 requests per minute
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Webhooks

The backend may send webhooks for the following events:

- `order.status_changed`
- `payment.completed`
- `return.approved`
- `message.received`

Webhook payloads follow the same structure as API responses.

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All monetary values are in the smallest currency unit (e.g., kobo for NGN)
3. Image URLs should be HTTPS and support CDN
4. All IDs are strings (UUIDs or custom identifiers)
5. The mock server (`mockServer.ts`) implements all these contracts for local development

