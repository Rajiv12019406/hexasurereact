import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import Home from './pages/Home'
import Programmes from './pages/Programmes'
import About from './pages/About'
import Approach from './pages/Approach'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Investment from './pages/Investment'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminCreatePost from './pages/admin/CreatePost'
import AdminEditPost from './pages/admin/EditPost'
import AdminMyPosts from './pages/admin/MyPosts'
import AdminProfile from './pages/admin/Profile'
import AdminUsers from './pages/admin/Users'

function PrivateRoute({ children, superAdminOnly = false }: { children: React.ReactNode, superAdminOnly?: boolean }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  if (superAdminOnly && !user?.is_super_admin) {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return <>{children}</>
}

function App() {
  const { theme } = useTheme()
  const { isLoading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div id="preloader">
        <div className="loader-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" data-theme={theme}>
      <Preloader />
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Programmes />} />
          <Route path="/about" element={<About />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/investment" element={<Investment />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="create-post" element={<AdminCreatePost />} />
                  <Route path="edit-post/:id" element={<AdminEditPost />} />
                  <Route path="my-posts" element={<AdminMyPosts />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App