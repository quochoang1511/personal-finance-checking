# Personal Finance API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication Header
All protected endpoints require:
```
X-User-Id: {userId}
```

---

## 1. Authentication APIs

### Register
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyen Van A"
}
```

### Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get Current User
```
GET /api/auth/me
Headers: X-User-Id: 1
```

### Update Profile
```
PUT /api/auth/profile
Headers: X-User-Id: 1
```
**Request Body:**
```json
{
  "fullName": "Nguyen Van B",
  "email": "newemail@example.com"
}
```

### Change Password
```
PUT /api/auth/password
Headers: X-User-Id: 1
```
**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Logout
```
POST /api/auth/logout
```

---

## 2. Transaction APIs

### Get Transactions (with pagination & filters)
```
GET /api/transactions
Headers: X-User-Id: 1
```
**Query Parameters:**
- `type` (optional): INCOME | EXPENSE
- `categoryId` (optional): Long
- `startDate` (optional): ISO DateTime (2024-01-01T00:00:00)
- `endDate` (optional): ISO DateTime
- `search` (optional): String
- `page` (default: 0): int
- `size` (default: 20): int

### Get All Transactions (no pagination)
```
GET /api/transactions/all
Headers: X-User-Id: 1
```

### Get Recent Transactions
```
GET /api/transactions/recent?limit=5
Headers: X-User-Id: 1
```

### Get Transaction by ID
```
GET /api/transactions/{id}
Headers: X-User-Id: 1
```

### Create Transaction
```
POST /api/transactions
Headers: X-User-Id: 1
```
**Request Body:**
```json
{
  "amount": 500000,
  "description": "Tien luong thang 3",
  "transactionDate": "2024-03-15T10:30:00",
  "type": "INCOME",
  "categoryId": 1
}
```

### Update Transaction
```
PUT /api/transactions/{id}
Headers: X-User-Id: 1
```
**Request Body:** (same as create)

### Delete Transaction
```
DELETE /api/transactions/{id}
Headers: X-User-Id: 1
```

---

## 3. Category APIs

### Get All Categories
```
GET /api/categories
Headers: X-User-Id: 1
```
**Query Parameters:**
- `type` (optional): INCOME | EXPENSE

### Get Category by ID
```
GET /api/categories/{id}
Headers: X-User-Id: 1
```

### Create Category
```
POST /api/categories
Headers: X-User-Id: 1
```
**Request Body:**
```json
{
  "name": "An uong",
  "description": "Chi phi an uong hang ngay",
  "defaultType": "EXPENSE"
}
```

### Update Category
```
PUT /api/categories/{id}
Headers: X-User-Id: 1
```

### Delete Category
```
DELETE /api/categories/{id}
Headers: X-User-Id: 1
```

---

## 4. Statistics APIs

### Get Summary
```
GET /api/statistics/summary
Headers: X-User-Id: 1
```
**Response:**
```json
{
  "success": true,
  "message": "Summary retrieved successfully",
  "data": {
    "totalIncome": 15000000,
    "totalExpense": 8500000,
    "balance": 6500000,
    "transactionCount": 45
  }
}
```

### Get Summary by Date Range
```
GET /api/statistics/summary/range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
Headers: X-User-Id: 1
```

### Get Monthly Data (for charts)
```
GET /api/statistics/monthly?year=2024
Headers: X-User-Id: 1
```
**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "T1", "monthNumber": 1, "income": 12000000, "expense": 8000000 },
    { "month": "T2", "monthNumber": 2, "income": 15000000, "expense": 9000000 }
  ]
}
```

### Get Category Statistics (for pie chart)
```
GET /api/statistics/by-category?type=EXPENSE&year=2024&month=3
Headers: X-User-Id: 1
```
**Response:**
```json
{
  "success": true,
  "data": [
    { "categoryId": 1, "categoryName": "An uong", "amount": 3000000, "percentage": 35.5 },
    { "categoryId": 2, "categoryName": "Di lai", "amount": 2000000, "percentage": 23.5 }
  ]
}
```

### Get Dashboard Data (all-in-one)
```
GET /api/statistics/dashboard?year=2024
Headers: X-User-Id: 1
```
**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalIncome": 15000000,
      "totalExpense": 8500000,
      "balance": 6500000,
      "transactionCount": 45
    },
    "monthlyData": [...],
    "categoryStats": [...],
    "year": 2024
  }
}
```

---

## Response Format

All APIs return:
```json
{
  "success": true | false,
  "message": "Description",
  "data": { ... } | null
}
```

## Error Handling

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "Invalid email format",
    "amount": "Amount must be non-negative"
  }
}
```

### Not Found (200 with success: false)
```json
{
  "success": false,
  "message": "Transaction not found",
  "data": null
}
```

### Unauthorized (200 with success: false)
```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": null
}
```
