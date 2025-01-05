# EcoConnect API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Response Format
All responses are returned in JSON format. Successful responses have a structure of:
```json
{
    "success": true,
    "data": { ... }
}
```

Error responses:
```json
{
    "success": false,
    "error": "Error message"
}
```

## Authentication Endpoints

### Sign Up
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}'
```

**Request Body:**
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "user_id": 1,
        "username": "testuser",
        "email": "test@example.com"
    }
}
```

### Login
Authenticate a user and receive access tokens.

**Endpoint:** `POST /auth/login`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}'
```

**Response:**
```json
{
    "success": true,
    "data": {
        "access_token": "eyJhbG...",
        "refresh_token": "eyJhbG..."
    }
}
```

## Testing Helper

You can save the access token in a variable for easier testing:
```bash
# Save token after login
YOUR_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}' | jq -r .access_token)

# Use saved token
curl -X GET http://localhost:5000/api/auth/profile \
-H "Authorization: Bearer $YOUR_TOKEN"
```

### Refresh Token
Refresh an expired access token using a valid refresh token.

**Endpoint:** `POST /auth/refresh`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
-H "Authorization: Bearer YOUR_REFRESH_TOKEN_HERE"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "access_token": "eyJhbG...",
        "refresh_token": "eyJhbG..."
    }
}
```

**Endpoint:** `POST /auth/login`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
    "email": "test@example.com",
    "password": "password123"
}'
```

**Request Body:**
```json
{
    "email": "test@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "access_token": "eyJhbG...",
        "refresh_token": "eyJhbG..."
    }
}
```

### Get Profile
Get the authenticated user's profile.

**Endpoint:** `GET /auth/profile`

**Curl Command:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "user_id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "created_at": "2024-01-05T10:00:00Z"
    }
}
```

## Waste Tracking Endpoints

### Add Waste Log
Create a new waste log entry.

**Endpoint:** `POST /waste/log`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/waste/log \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "category": "plastic",
    "amount": 0.5,
    "unit": "kg"
}'
```

**Request Body:**
```json
{
    "category": "plastic",
    "amount": 0.5,
    "unit": "kg"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "log_id": 1,
        "category": "plastic",
        "amount": 0.5,
        "unit": "kg",
        "created_at": "2024-01-05T10:00:00Z"
    }
}
```

### Get Waste Logs
Retrieve waste logs with optional filtering.

**Endpoint:** `GET /waste/logs`

**Curl Commands:**
```bash
# Get all logs from last 30 days
curl -X GET http://localhost:5000/api/waste/logs \
-H "Authorization: Bearer YOUR_TOKEN"

# Filter by category and days
curl -X GET "http://localhost:5000/api/waste/logs?category=plastic&days=7" \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "logs": [
            {
                "log_id": 1,
                "category": "plastic",
                "amount": 0.5,
                "unit": "kg",
                "created_at": "2024-01-05T10:00:00Z"
            }
        ]
    }
}
```

### Get Waste Statistics
Get statistics about waste logs.

**Endpoint:** `GET /waste/stats`

**Curl Commands:**
```bash
# Get stats for last 30 days
curl -X GET http://localhost:5000/api/waste/stats \
-H "Authorization: Bearer YOUR_TOKEN"

# Get stats for specific period
curl -X GET "http://localhost:5000/api/waste/stats?days=7" \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "total_waste": {
            "plastic": 2.5,
            "paper": 1.8,
            "glass": 3.0
        },
        "daily_averages": {
            "plastic": 0.08,
            "paper": 0.06,
            "glass": 0.1
        }
    }
}
```

### Delete Waste Log
Delete a specific waste log entry.

**Endpoint:** `DELETE /waste/log/{id}`

**Curl Command:**
```bash
curl -X DELETE http://localhost:5000/api/waste/log/1 \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "message": "Waste log deleted successfully"
    }
}
```

**Endpoint:** `GET /waste/logs`

**Curl Commands:**
```bash
# Get all logs from last 30 days
curl -X GET http://localhost:5000/api/waste/logs \
-H "Authorization: Bearer YOUR_TOKEN"

# Filter by category and days
curl -X GET "http://localhost:5000/api/waste/logs?category=plastic&days=7" \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "logs": [
            {
                "log_id": 1,
                "category": "plastic",
                "amount": 0.5,
                "unit": "kg",
                "created_at": "2024-01-05T10:00:00Z"
            }
        ]
    }
}
```

## Business Directory Endpoints

### Get All Businesses
Retrieve list of eco-friendly businesses.

**Endpoint:** `GET /businesses`

**Curl Commands:**
```bash
# Get all businesses
curl -X GET http://localhost:5000/api/businesses

# With filters
curl -X GET "http://localhost:5000/api/businesses?category=zero_waste_store&min_rating=4&verified=true"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "businesses": [
            {
                "id": 1,
                "name": "Green Earth Store",
                "description": "Zero waste grocery store",
                "category": "zero_waste_store",
                "address": "123 Eco Street",
                "rating": 4.5,
                "verified": true
            }
        ]
    }
}
```

### Add Business Review
Add a review for a business.

**Endpoint:** `POST /businesses/{business_id}/review`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/businesses/1/review \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "rating": 5,
    "comment": "Great eco-friendly products!"
}'
```

**Response:**
```json
{
    "success": true,
    "data": {
        "review_id": 1,
        "business_id": 1,
        "rating": 5,
        "comment": "Great eco-friendly products!",
        "created_at": "2024-01-05T10:00:00Z"
    }
}
```

### Get Business Reviews
Get all reviews for a specific business.

**Endpoint:** `GET /businesses/{business_id}/reviews`

**Curl Command:**
```bash
curl -X GET http://localhost:5000/api/businesses/1/reviews
```

**Response:**
```json
{
    "success": true,
    "data": {
        "reviews": [
            {
                "review_id": 1,
                "user_id": 2,
                "username": "eco_warrior",
                "rating": 5,
                "comment": "Great eco-friendly products!",
                "created_at": "2024-01-05T10:00:00Z"
            }
        ],
        "average_rating": 4.5,
        "total_reviews": 1
    }
}
```

### Verify Business
Verify a business (admin only).

**Endpoint:** `POST /businesses/{business_id}/verify`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/businesses/1/verify \
-H "Authorization: Bearer ADMIN_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "business_id": 1,
        "name": "Green Earth Store",
        "verified": true,
        "verified_at": "2024-01-05T10:00:00Z"
    }
}
```

**Endpoint:** `POST /businesses/{business_id}/review`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/businesses/1/review \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "rating": 5,
    "comment": "Great eco-friendly products!"
}'
```

**Response:**
```json
{
    "success": true,
    "data": {
        "review_id": 1,
        "business_id": 1,
        "rating": 5,
        "comment": "Great eco-friendly products!",
        "created_at": "2024-01-05T10:00:00Z"
    }
}
```

## Social Features

### Follow User
Follow another user.

**Endpoint:** `POST /social/follow/{user_id}`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/social/follow/2 \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "following_id": 2,
        "followed_at": "2024-01-05T10:00:00Z"
    }
}
```

### Unfollow User
Unfollow a previously followed user.

**Endpoint:** `POST /social/unfollow/{user_id}`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/social/unfollow/2 \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "message": "Successfully unfollowed user"
    }
}
```

### Get User Achievements
Get achievements for the authenticated user.

**Endpoint:** `GET /social/achievements`

**Curl Command:**
```bash
curl -X GET http://localhost:5000/api/social/achievements \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "achievements": [
            {
                "id": 1,
                "type": "waste_reduction",
                "title": "Waste Warrior",
                "description": "Reduced waste by 50% in one month",
                "earned_at": "2024-01-05T10:00:00Z"
            }
        ],
        "total_badges": 5,
        "points": 1500
    }
}
```

### Get Leaderboard
Get the community leaderboard.

**Endpoint:** `GET /social/leaderboard`

**Curl Commands:**
```bash
# Weekly leaderboard
curl -X GET "http://localhost:5000/api/social/leaderboard?timeframe=week"

# Monthly leaderboard
curl -X GET "http://localhost:5000/api/social/leaderboard?timeframe=month"

# All-time leaderboard
curl -X GET "http://localhost:5000/api/social/leaderboard?timeframe=all-time"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "timeframe": "week",
        "leaders": [
            {
                "rank": 1,
                "user_id": 2,
                "username": "eco_warrior",
                "points": 1500,
                "achievements": 5
            }
        ]
    }
}
```

**Endpoint:** `POST /social/follow/{user_id}`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/social/follow/2 \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "following_id": 2,
        "followed_at": "2024-01-05T10:00:00Z"
    }
}
```

### Get Activity Feed
Retrieve activity feed for authenticated user.

**Endpoint:** `GET /social/feed`

**Curl Command:**
```bash
curl -X GET http://localhost:5000/api/social/feed \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "activities": [
            {
                "id": 1,
                "type": "waste_log",
                "user": {
                    "id": 2,
                    "username": "eco_warrior"
                },
                "content": "Logged 0.5kg of plastic waste",
                "created_at": "2024-01-05T10:00:00Z"
            }
        ]
    }
}
```

## Community Initiatives

### Create Initiative
Create a new community initiative.

**Endpoint:** `POST /initiatives`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/initiatives \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "title": "Marina Beach Cleanup",
    "description": "Join us for a community beach cleanup drive",
    "location": "Marina Beach, Chennai",
    "event_date": "2025-01-15T09:00:00Z",
    "duration_hours": 3,
    "max_participants": 50,
    "requirements": "Please bring gloves and water bottle",
    "contact_info": "Contact: John at 1234567890"
}'
```

**Response:**
```json
{
    "success": true,
    "data": {
        "initiative_id": 1,
        "title": "Marina Beach Cleanup",
        "creator_id": 1,
        "current_participants": 1,
        "created_at": "2024-01-05T10:00:00Z"
    }
}
```

### Get All Initiatives
Get list of all initiatives.

**Endpoint:** `GET /initiatives`

**Curl Commands:**
```bash
# Get all upcoming initiatives
curl -X GET http://localhost:5000/api/initiatives

# Filter by location and status
curl -X GET "http://localhost:5000/api/initiatives?location=Marina&status=upcoming"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "initiatives": [
            {
                "id": 1,
                "title": "Marina Beach Cleanup",
                "description": "Join us for a community beach cleanup drive",
                "location": "Marina Beach, Chennai",
                "event_date": "2025-01-15T09:00:00Z",
                "status": "upcoming",
                "current_participants": 25,
                "max_participants": 50
            }
        ]
    }
}
```

### Get Initiative Details
Get detailed information about a specific initiative.

**Endpoint:** `GET /initiatives/{initiative_id}`

**Curl Command:**
```bash
curl -X GET http://localhost:5000/api/initiatives/1
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Marina Beach Cleanup",
        "description": "Join us for a community beach cleanup drive",
        "location": "Marina Beach, Chennai",
        "event_date": "2025-01-15T09:00:00Z",
        "duration_hours": 3,
        "status": "upcoming",
        "current_participants": 25,
        "max_participants": 50,
        "requirements": "Please bring gloves and water bottle",
        "contact_info": "Contact: John at 1234567890",
        "creator": {
            "id": 1,
            "username": "eco_warrior"
        }
    }
}
```

### Get Initiative Participants
Get list of participants for a specific initiative.

**Endpoint:** `GET /initiatives/{initiative_id}/participants`

**Curl Command:**
```bash
curl -X GET http://localhost:5000/api/initiatives/1/participants
```

**Response:**
```json
{
    "success": true,
    "data": {
        "participants": [
            {
                "user_id": 2,
                "username": "eco_warrior",
                "joined_at": "2024-01-05T10:00:00Z"
            }
        ],
        "total_participants": 25,
        "max_participants": 50
    }
}
```

### Join Initiative
Join an existing initiative.

**Endpoint:** `POST /initiatives/{initiative_id}/join`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/initiatives/1/join \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "initiative_id": 1,
        "joined_at": "2024-01-05T10:00:00Z",
        "current_participants": 26,
        "max_participants": 50
    }
}
```

### Leave Initiative
Leave a previously joined initiative.

**Endpoint:** `POST /initiatives/{initiative_id}/leave`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/initiatives/1/leave \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "message": "Successfully left the initiative",
        "current_participants": 25
    }
}
```

### Update Initiative
Update an initiative (creator only).

**Endpoint:** `PUT /initiatives/{initiative_id}`

**Curl Command:**
```bash
curl -X PUT http://localhost:5000/api/initiatives/1 \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
    "title": "Updated: Marina Beach Cleanup",
    "description": "Updated description",
    "status": "completed"
}'
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Updated: Marina Beach Cleanup",
        "description": "Updated description",
        "status": "completed",
        "updated_at": "2024-01-05T10:00:00Z"
    }
}
```

**Endpoint:** `POST /initiatives/{initiative_id}/join`

**Curl Command:**
```bash
curl -X POST http://localhost:5000/api/initiatives/1/join \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
    "success": true,
    "data": {
        "initiative_id": 1,
        "joined_at": "2024-01-05T10:00:00Z",
        "current_participants": 2,
        "max_participants": 50
    }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input parameters |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist |
| 409  | Conflict - Resource already exists |
| 422  | Unprocessable Entity - Validation error |
| 500  | Internal Server Error |


## Pagination

For endpoints that return lists, pagination is supported using the following query parameters:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)

Example:
```bash
curl -X GET "http://localhost:5000/api/businesses?page=2&per_page=50"
```