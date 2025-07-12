# Django Authentication API

This Django application provides a complete authentication system with JWT tokens for both users and admins.

## Features

- User and Admin registration
- User and Admin login/logout
- JWT token-based authentication
- Profile management
- Password hashing and validation
- CORS support for frontend integration

## API Endpoints

### Base URL
```
http://localhost:8000/api/
```

### 1. Test Endpoint
**GET** `/test/`
- **Description**: Test endpoint to verify API is working
- **Authentication**: Not required
- **Response**:
```json
{
    "message": "API is working!",
    "status": "success"
}
```

### 2. User Registration
**POST** `/auth/user/register/`
- **Description**: Register a new user
- **Authentication**: Not required
- **Request Body**:
```json
{
    "username": "john_doe",
    "user_email": "john@example.com",
    "password": "securepassword123",
    "password2": "securepassword123"
}
```
- **Response**:
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "john_doe",
        "user_email": "john@example.com"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### 3. Admin Registration
**POST** `/auth/admin/register/`
- **Description**: Register a new admin
- **Authentication**: Not required
- **Request Body**:
```json
{
    "username": "admin_user",
    "admin_email": "admin@example.com",
    "password": "adminpassword123",
    "password2": "adminpassword123"
}
```
- **Response**:
```json
{
    "message": "Admin registered successfully",
    "admin": {
        "id": 1,
        "username": "admin_user",
        "admin_email": "admin@example.com"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### 4. User Login
**POST** `/auth/user/login/`
- **Description**: Login as a user
- **Authentication**: Not required
- **Request Body**:
```json
{
    "email": "john@example.com",
    "password": "securepassword123"
}
```
- **Response**:
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "john_doe",
        "user_email": "john@example.com"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### 5. Admin Login
**POST** `/auth/admin/login/`
- **Description**: Login as an admin
- **Authentication**: Not required
- **Request Body**:
```json
{
    "email": "admin@example.com",
    "password": "adminpassword123"
}
```
- **Response**:
```json
{
    "message": "Login successful",
    "admin": {
        "id": 1,
        "username": "admin_user",
        "admin_email": "admin@example.com"
    },
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
}
```

### 6. Logout
**POST** `/auth/logout/`
- **Description**: Logout and blacklist refresh token
- **Authentication**: Required (Bearer token)
- **Request Body**:
```json
{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response**:
```json
{
    "message": "Logout successful"
}
```

### 7. Token Refresh
**POST** `/auth/token/refresh/`
- **Description**: Get new access token using refresh token
- **Authentication**: Not required
- **Request Body**:
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response**:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 8. Get User Profile
**GET** `/auth/user/profile/`
- **Description**: Get current user's profile
- **Authentication**: Required (Bearer token)
- **Response**:
```json
{
    "id": 1,
    "username": "john_doe",
    "user_email": "john@example.com"
}
```

### 9. Get Admin Profile
**GET** `/auth/admin/profile/`
- **Description**: Get current admin's profile
- **Authentication**: Required (Bearer token)
- **Response**:
```json
{
    "id": 1,
    "username": "admin_user",
    "admin_email": "admin@example.com"
}
```

### 10. Update User Profile
**PUT** `/auth/user/profile/update/`
- **Description**: Update current user's profile
- **Authentication**: Required (Bearer token)
- **Request Body**:
```json
{
    "username": "new_username",
    "user_email": "newemail@example.com"
}
```
- **Response**:
```json
{
    "message": "Profile updated successfully",
    "user": {
        "id": 1,
        "username": "new_username",
        "user_email": "newemail@example.com"
    }
}
```

### 11. Update Admin Profile
**PUT** `/auth/admin/profile/update/`
- **Description**: Update current admin's profile
- **Authentication**: Required (Bearer token)
- **Request Body**:
```json
{
    "username": "new_admin_username",
    "admin_email": "newadmin@example.com"
}
```
- **Response**:
```json
{
    "message": "Profile updated successfully",
    "admin": {
        "id": 1,
        "username": "new_admin_username",
        "admin_email": "newadmin@example.com"
    }
}
```

## Authentication

### JWT Token Usage
Include the access token in the Authorization header for protected endpoints:
```
Authorization: Bearer <access_token>
```

### Token Lifetime
- **Access Token**: 60 minutes
- **Refresh Token**: 1 day

## Error Responses

### 400 Bad Request
```json
{
    "error": "Invalid credentials"
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
    "error": "User not found"
}
```

## Setup Instructions

1. Install required packages:
```bash
pip install djangorestframework djangorestframework-simplejwt django-cors-headers
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Start the development server:
```bash
python manage.py runserver
```

## Testing the API

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)
- Any HTTP client

### Example cURL commands:

**Test endpoint:**
```bash
curl -X GET http://localhost:8000/api/test/
```

**User registration:**
```bash
curl -X POST http://localhost:8000/api/auth/user/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "user_email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123"
  }'
```

**User login:**
```bash
curl -X POST http://localhost:8000/api/auth/user/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Get user profile (with token):**
```bash
curl -X GET http://localhost:8000/api/auth/user/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
``` 