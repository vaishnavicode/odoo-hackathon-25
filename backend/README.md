# Django Authentication API

This Django application provides a complete authentication system with JWT tokens for both users and admins, including user management and question handling.

## Features

- User and Admin registration
- User and Admin login/logout
- JWT token-based authentication
- Profile management
- Account deletion (soft delete)
- Admin can delete any user
- Question listing with filtering and pagination
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
- **Authentication**: Not required
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

### 12. Delete User Account
**DELETE** `/auth/user/delete/`
- **Description**: Delete current user's account (soft delete)
- **Authentication**: Required (Bearer token - User)
- **Response**:
```json
{
    "message": "User account deleted successfully"
}
```

### 13. Delete Admin Account
**DELETE** `/auth/admin/delete/`
- **Description**: Delete current admin's account (soft delete)
- **Authentication**: Required (Bearer token - Admin)
- **Response**:
```json
{
    "message": "Admin account deleted successfully"
}
```

### 14. Admin Delete User
**DELETE** `/auth/admin/delete-user/{user_id}/`
- **Description**: Admin can delete any user account
- **Authentication**: Required (Bearer token - Admin)
- **Response**:
```json
{
    "message": "User john_doe deleted successfully by admin"
}
```

### 15. List Questions
**GET** `/questions/`
- **Description**: Get list of questions with filtering and pagination
- **Authentication**: Not required
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `page_size`: Items per page (default: 10, max: 100)
  - `user`: Filter by user ID
  - `question_tag`: Filter by question tag
  - `ordering`: Sort by field (e.g., `question_title`, `-question_title`)
  - `search`: Search in title and description
- **Response**:
```json
{
    "count": 25,
    "next": "http://localhost:8000/api/questions/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "question_title": "How to use Django?",
            "question_description": "I'm new to Django...",
            "question_tag": "django",
            "user": "john_doe",
            "upvotes": 5,
            "answer_count": 3
        }
    ]
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
pip install djangorestframework djangorestframework-simplejwt django-cors-headers django-filter
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

**Delete user account:**
```bash
curl -X DELETE http://localhost:8000/api/auth/user/delete/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Admin delete user:**
```bash
curl -X DELETE http://localhost:8000/api/auth/admin/delete-user/1/ \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**List questions with filtering:**
```bash
curl -X GET "http://localhost:8000/api/questions/?search=django&ordering=-question_title&page=1"
```

## Security Features

- **Soft Delete**: Accounts are marked as deleted but not permanently removed
- **Password Hashing**: All passwords are securely hashed
- **JWT Blacklisting**: Refresh tokens are blacklisted on logout
- **Permission-based Access**: Different endpoints require different authentication levels
- **Input Validation**: All inputs are validated and sanitized 