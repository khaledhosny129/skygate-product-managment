# SkyGate Product Management API
A robust product management REST API built with NestJS, MongoDB, and TypeScript. Features include JWT authentication, role-based access control, product CRUD operations, and comprehensive filtering capabilities.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Local Development](#local-development)
  - [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
  - [Auth Module](#auth-module)
  - [Products Module](#products-module)
  - [Users Module](#users-module)
- [Error Handling](#error-handling)

---

## Features

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Session management

✅ **Product Management**
- Full CRUD operations
- Advanced filtering (category, type, price range)
- Pagination and sorting
- Search functionality
- Product statistics

✅ **User Management**
- User profile management
- Password update
- Admin user management

✅ **Technical Features**
- TypeScript for type safety
- MongoDB with Mongoose ODM
- Input validation with class-validator
- Swagger API documentation
- Docker containerization
- Health checks

---

## Prerequisites

- **Node.js**: v22.19.0 or higher
- **MongoDB**: v7.0 or higher
- **Docker & Docker Compose** (optional, for containerized deployment)

---

## Setup Instructions

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/khaledhosny129/skygate-product-managment.git
   cd skygate-product-managment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create environment file
   cp .env.example .env.development
   
   # Edit .env.development with your values
   ```

4. **Run the application**
   ```bash
   # Development mode with hot-reload
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

5. **Access the application**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api

---

### Docker Deployment

1. **Create environment file**
   ```bash
   cp .env.example .env.development
   ```

2. **Edit `.env.development`** with your configuration
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb://host.docker.internal:27017/skygate
   JWT_SECRET=your-super-secret-jwt-key
   # ... other variables
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **View logs**
   ```bash
   docker-compose logs -f app
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

---

## Environment Variables

Create a `.env.development` file in the root directory with the following variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development`, `production` | Yes |
| `PORT` | Application port | `3000` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/skygate` | Yes |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d` | Yes |
| `API_URL` | Swagger documentation URL | `http://localhost:3000/api` | Yes |
| `ADMIN_EMAIL` | Default admin email | `admin@skygate.com` | Yes |
| `ADMIN_PASSWORD` | Default admin password | `Admin@123456` | Yes |

**Example `.env.development`:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/skygate
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
API_URL=http://localhost:3000/api
ADMIN_EMAIL=admin@skygate.com
ADMIN_PASSWORD=Admin@123456
SESSION_SECRET=your-super-secret-session-key
```

---

## Running the Project

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod
```

---

## API Documentation

### Swagger UI

Access the interactive API documentation at:

**URL:** [http://localhost:3000/api](http://localhost:3000/api)

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive testing interface
- Authentication support

### Default Admin Credentials

On first startup, a default admin user is created:
- **Email:** `admin@skygate.com`
- **Password:** `Admin@123456`

---

## API Endpoints

### Auth Module

#### POST /auth/signup

Register a new user account.

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "P@ssw0rd123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-12-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request** - Validation Error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "password is not strong enough"
    }
  ]
}
```

**409 Conflict** - Email Already Exists:
```json
{
  "success": false,
  "message": "User with this email already exists",
  "error": {
    "code": "DUPLICATE_EMAIL",
    "details": {
      "field": "email",
      "value": "email@example.com"
    }
  }
}
```

---

#### POST /auth/login

Authenticate user and receive JWT token.

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6584a1b2c3d4e5f6a7b8c9d0",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

**Error Responses:**

**401 Unauthorized** - Invalid Credentials:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**400 Bad Request** - Validation Error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ]
}
```

---

### Products Module

#### POST /products

Create a new product (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "sku": "PROD-001",
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "category": "Electronics",
  "type": "public",
  "price": 99.99,
  "discountPrice": 79.99,
  "quantity": 100
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "sku": "PROD-001",
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "category": "Electronics",
    "type": "public",
    "price": 99.99,
    "discountPrice": 79.99,
    "quantity": 100,
    "createdAt": "2024-12-11T15:30:00.000Z",
    "updatedAt": "2024-12-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request** - Validation Error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "price must be greater than 0"
    }
  ]
}
```

**401 Unauthorized** - Missing/Invalid Token:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden** - Insufficient Permissions:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

**409 Conflict** - SKU Already Exists:
```json
{
  "success": false,
  "message": "Product with this sku already exists",
  "error": {
    "code": "DUPLICATE_SKU",
    "details": {
      "field": "sku",
      "value": "LAPTOP-001"
    }
  }
}
```

---

#### GET /products

Get all products with filtering, pagination, and sorting.

**Access:** User, Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `1` |
| `limit` | number | Items per page (default: 10, max: 100) | `20` |
| `search` | string | Search in product name/description | `laptop` |
| `sort` | string | Sort field (default: createdAt) | `price` |
| `order` | string | Sort order: asc/desc (default: desc) | `asc` |
| `category` | string | Filter by category (exact match) | `Electronics` |
| `type` | string | Filter by type: public/private | `public` |
| `minPrice` | number | Minimum price filter | `50` |
| `maxPrice` | number | Maximum price filter | `200` |

**Example Requests:**
```bash
# Get first page with 10 items
GET /products?page=1&limit=10

# Search for laptops
GET /products?search=laptop

# Filter by category and price range
GET /products?category=Electronics&minPrice=100&maxPrice=500

# Sort by price ascending
GET /products?sort=price&order=asc

# Combined filters
GET /products?type=public&category=Electronics&minPrice=50&maxPrice=200&sort=price&order=asc&page=1&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "693ac8c71fc6e6995fab531e",
      "sku": "SPEAKER-001",
      "name": "Bluetooth Speaker",
      "description": "Portable Bluetooth speaker with 360-degree sound",
      "category": "Electronics",
      "type": "public",
      "price": 129.99,
      "discountPrice": 99.99,
      "quantity": 80,
      "createdAt": "2025-12-11T13:36:07.068Z",
      "updatedAt": "2025-12-11T13:36:07.068Z"
    }
  ],
   "pagination": {
       "currentPage": 1,
       "totalPages": 1,
       "totalItems": 1,
       "itemsPerPage": 10,
       "hasNextPage": false,
       "hasPreviousPage": false
     }
}
```

**Error Responses:**

**401 Unauthorized** - Missing/Invalid Token:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**400 Bad Request** - Invalid Query Parameters:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "limit",
      "message": "limit must not be greater than 100"
    }
  ]
}
```

---

#### GET /products/stats

Get product statistics (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalProducts": 150,
    "totalValue": 15000.50,
    "averagePrice": 100.00,
    "categoryCounts": {
      "Electronics": 50,
      "Clothing": 30,
      "Books": 70
    },
    "typeCounts": {
      "public": 120,
      "private": 30
    }
  }
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

---

#### GET /products/:id

Get a product by ID.

**Access:** User, Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "sku": "PROD-001",
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones",
    "category": "Electronics",
    "type": "public",
    "price": 99.99,
    "discountPrice": 79.99,
    "quantity": 100,
    "createdAt": "2024-12-11T15:30:00.000Z",
    "updatedAt": "2024-12-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Product with this id not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {
      "resource": "Product",
      "id": "693ac8c71fc6e6995fab5311"
    }
  }
}
```

---

#### PATCH /products/:id

Update a product by ID (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 89.99,
  "quantity": 150
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "sku": "PROD-001",
    "name": "Updated Product Name",
    "price": 89.99,
    "quantity": 150,
    "updatedAt": "2024-12-11T16:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "price must be greater than 0"
    }
  ]
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Product with this id not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {
      "resource": "Product",
      "id": "693ac8c71fc6e6995fab5311"
    }
  }
}
```

---

#### DELETE /products/:id

Delete a product by ID (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": "693ac8c71fc6e6995fab531e",
    "sku": "SPEAKER-001"
  }
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "Product with this id not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {
      "resource": "Product",
      "id": "693ac8c71fc6e6995fab5311"
    }
  }
}
```

---

### Users Module

#### GET /users/me

Get current user profile.

**Access:** User, Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-12-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

---

#### PATCH /users/me

Update current user profile.

**Access:** User, Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "email": "newemail@example.com",
    "name": "John Updated",
    "role": "user",
    "updatedAt": "2024-12-11T16:00:00.000Z"
  }
}
```

**Error Responses:**

**400 Bad Request**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    }
  ]
}
```

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**409 Conflict** - Email Already Exists:
```json
{
  "success": false,
  "message": "User with this email already exists",
  "error": {
    "code": "DUPLICATE_EMAIL",
    "details": {
      "field": "email",
      "value": "email@example.com"
    }
  }
}
```

---

#### PATCH /users/me/password

Update current user password.

**Access:** User, Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldP@ssw0rd",
  "newPassword": "NewP@ssw0rd123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Responses:**

**400 Bad Request** - Validation Error:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "newPassword",
      "message": "password is not strong enough"
    }
  ]
}
```

**401 Unauthorized** - Wrong Current Password:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

---

#### GET /users

Get all users with filtering (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `1` |
| `limit` | number | Items per page (default: 10) | `20` |
| `search` | string | Search in name/email | `john` |
| `sort` | string | Sort field (default: createdAt) | `name` |
| `order` | string | Sort order: asc/desc (default: desc) | `asc` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "6939d943cdbd33c846285cd0",
      "email": "email@example.com",
      "password": "$2b$10$2693R1XwhW/q7yEPuWUnS.vkGqnvrSUcACRbDwnE6RHQ.YSL794bC",
      "name": "John",
      "role": "user",
      "createdAt": "2025-12-10T20:34:11.650Z",
      "updatedAt": "2025-12-10T20:34:11.650Z"
    },
    {
      "_id": "693a986a934ed45b23bb1b92",
      "email": "user@example.com",
      "password": "$2b$10$Uhv6pxhapq0t95qpJ2Jk8OAsbTCh1gQh2ltzQ8ISzmLHyB6oRzzyW",
      "name": "John",
      "role": "user",
      "createdAt": "2025-12-11T10:09:46.004Z",
      "updatedAt": "2025-12-11T10:09:46.004Z"
    },
    {
      "_id": "693adab08ef2a200642145fd",
      "email": "admin@example.com",
      "password": "$2b$10$o7WUyMr8wG4BzpcQz6BGYOGunRQ1vAWBnxep2UC0ya8IE7DWx.oTK",
      "name": "Admin",
      "role": "admin",
      "createdAt": "2025-12-11T14:52:32.041Z",
      "updatedAt": "2025-12-11T14:52:32.041Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 3,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

---

#### GET /users/:id

Get a user by ID (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-12-11T15:30:00.000Z",
    "updatedAt": "2024-12-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "User with this id not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {
      "resource": "User",
      "id": "693a986a934ed45b23bb1b91"
    }
  }
}
```

---

#### PATCH /users/:id

Update a user by ID (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "6584a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "name": "Updated Name",
    "role": "admin",
    "updatedAt": "2024-12-11T16:00:00.000Z"
  }
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "User with this id not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {
      "resource": "User",
      "id": "693a986a934ed45b23bb1b91"
    }
  }
}
```

---

#### DELETE /users/:id

Delete a user by ID (Admin only).

**Access:** Admin

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

**401 Unauthorized**:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**403 Forbidden**:
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": {
    "code": "FORBIDDEN",
    "details": "admin role required for this operation"
  }
}
```

**404 Not Found**:
```json
{
  "success": false,
  "message": "User with this id not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {
      "resource": "User",
      "id": "693a986a934ed45b23bb1b91"
    }
  }
}
```

---

## Error Handling

The API uses standard HTTP status codes and returns consistent error responses.

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request - Validation error |
| `401` | Unauthorized - Authentication required |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Resource already exists |

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

### Common Errors

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email"
    },
    {
      "field": "password",
      "message": "password is not strong enough"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**Authorization Error (403):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "Invalid credentials"
  }
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "source with this id not found",
  "error": {
    "code": "NOT_FOUND",
    "details": {
      "resource": "source",
      "id": "693a986a934ed45b23bb1b91"
    }
  }
}
```

**Conflict Error (409):**
```json
{
  "success": false,
  "message": "source with this email already exists",
  "error": {
    "code": "DUPLICATE_FIELD",
    "details": {
      "field": "FIELD",
      "value": "VALUE"
    }
  }
}
```

---

## Author

Developed by Khaled Hosny

## Repository

[https://github.com/khaledhosny129/skygate-product-managment](https://github.com/khaledhosny129/skygate-product-managment)
