# Hexasure Backend (FastAPI)

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Create database (MySQL):
```sql
CREATE DATABASE xgroup_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Run migrations (or let FastAPI create tables on startup):
```bash
alembic upgrade head
```

6. Start development server:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/register` - Register (admin only)
- `PUT /api/v1/auth/profile` - Update profile
- `GET /api/v1/auth/users` - List users (super admin)
- `PUT /api/v1/auth/users/{id}` - Update user (super admin)
- `DELETE /api/v1/auth/users/{id}` - Delete user (super admin)

### Posts
- `GET /api/v1/posts` - List published posts (paginated)
- `GET /api/v1/posts/featured` - Get featured posts
- `GET /api/v1/posts/{slug}` - Get post by slug
- `POST /api/v1/posts` - Create post (authenticated)
- `GET /api/v1/posts/admin/my-posts` - List my posts (authenticated)
- `PUT /api/v1/posts/{id}` - Update post (author or super admin)
- `DELETE /api/v1/posts/{id}` - Delete post (author or super admin)

### Contact
- `POST /api/v1/contact` - Submit contact form
- `POST /api/v1/investment` - Submit investment form
- `GET /api/v1/messages` - List contact messages (super admin)

## Environment Variables

See `.env.example` for all options.

## Database Schema

Tables created automatically on startup:
- `users` - Admin users
- `posts` - Blog posts
- `contact_messages` - Contact/investment enquiries