# Hexasure Frontend (React + Vite)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable components (Navbar, Footer, CubeScene, etc.)
├── pages/          # Page components
│   ├── admin/      # Admin panel pages
│   ├── Home.jsx
│   ├── Programmes.jsx
│   ├── About.jsx
│   ├── Approach.jsx
│   ├── Blog.jsx
│   ├── BlogPost.jsx
│   ├── Contact.jsx
│   └── Investment.jsx
├── context/        # React contexts (Theme, Auth)
├── hooks/          # Custom hooks (useScrollReveal)
├── lib/            # API client
├── styles/         # CSS files
└── main.jsx        # Entry point
```

## Features

- **Pages**: Home, Programmes, About, Approach, Blog, BlogPost, Contact, Investment
- **Admin Panel**: Login, Dashboard, Create/Edit Posts, My Posts, Profile, Users (super admin)
- **Theme**: Light/Dark mode with localStorage persistence
- **Animations**: Scroll-reveal animations, cube 3D animation
- **Forms**: Contact form with validation, Investment form
- **Responsive**: Mobile-first design with hamburger menu

## API Integration

The frontend proxies API requests to `http://localhost:8000` via Vite proxy.
Configure `vite.config.js` if your backend runs on a different port.

## Environment

Create `.env` file for environment-specific settings:
```
VITE_API_URL=http://localhost:8000/api/v1
```