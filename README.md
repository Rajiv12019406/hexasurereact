# Hexasure - React + FastAPI

A complete rewrite of the PHP Hexasure website using React (frontend) and FastAPI (backend).

## Quick Start with Docker

```bash
# Clone and navigate
cd hexasurclone

# Start all services
docker-compose up -d

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/v1/openapi.json
```

## Manual Setup

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
hexasurclone/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/       # API routes
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── crud/      # Database operations
│   │   ├── core/      # Config, security
│   │   └── db/        # Database session
│   ├── requirements.txt
│   └── .env.example
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml
```

## Features Preserved from PHP Version

- ✅ Home page with hero, cube animation, programmes, philosophy, steps, profile, CTA
- ✅ Programmes page with three learning programmes
- ✅ About page with mission, philosophy, instructor profile
- ✅ Approach page with philosophy and learning process
- ✅ Blog with featured post, topic cards, paginated articles
- ✅ Individual blog posts
- ✅ Contact form with validation and guardian confirmation
- ✅ Investment/Partnership form
- ✅ Admin panel with authentication (JWT)
- ✅ Admin dashboard, create/edit posts, my posts, profile
- ✅ User management (super admin only)
- ✅ Dark/Light theme toggle with persistence
- ✅ Mobile responsive navigation
- ✅ Scroll-reveal animations
- ✅ 3D Cube animation on home page
- ✅ All original CSS styles preserved

## Database

MySQL database with tables:
- `users` - Admin users with roles
- `posts` - Blog posts with slugs, categories, status
- `contact_messages` - Contact and investment enquiries

## Default Admin User

Create an admin user via the registration endpoint or directly in database:

```sql
INSERT INTO users (email, password_hash, first_name, last_name, role, is_super_admin)
VALUES ('admin@hexasure.com', '$2b$12$...', 'Admin', 'User', 'super_admin', 1);
```

Password hash generated with bcrypt (use the `/auth/register` endpoint or a bcrypt tool).

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Tech Stack

**Backend:**
- FastAPI 0.109
- SQLAlchemy 2.0
- PyMySQL
- python-jose (JWT)
- passlib (bcrypt)
- Pydantic 2

**Frontend:**
- React 18
- Vite 5
- React Router 6
- Axios
- CSS Variables for theming

## License

MIT