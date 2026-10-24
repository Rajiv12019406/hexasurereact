import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useScrollReveal, useScrollRevealMultiple } from '../../hooks/useScrollReveal'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const heroRef = useScrollReveal()
  const cardsRef = useScrollRevealMultiple(4)

  const cards = [
    { icon: '✍️', title: 'Write New Insight', description: 'Draft and publish a new blog post.', href: '/admin/create-post' },
    { icon: '📄', title: 'My Insights', description: 'View, edit, and manage your articles.', href: '/admin/my-posts' },
    { icon: '👤', title: 'My Profile', description: 'Update your name, details, and password.', href: '/admin/profile' },
  ]

  return (
    <div>
      <header className="admin-header">
        <div className="container admin-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink to="/" style={{ fontWeight: 800, fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-main)' }}>
              Hexasure
            </NavLink>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>Dashboard</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Welcome, <strong>{user?.first_name || user?.email}</strong></span>
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '4rem' }}>
        <h1 style={{ marginBottom: '2rem' }} ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          Overview
        </h1>

        <div className="grid grid-3">
          {cards.map((card, index) => (
            <NavLink
              key={card.title}
              to={card.href}
              className="dashboard-card"
              style={{ opacity: cardsRef.visible[index] ? 1 : 0, transform: cardsRef.visible[index] ? 'translateY(0)' : 'translateY(20px)' }}
            >
              <span className="icon">{card.icon}</span>
              <h3>{card.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{card.description}</p>
            </NavLink>
          ))}

          {user?.is_super_admin && (
            <NavLink
              to="/admin/users"
              className="dashboard-card"
              style={{ opacity: cardsRef.visible[3] ? 1 : 0, transform: cardsRef.visible[3] ? 'translateY(0)' : 'translateY(20px)' }}
            >
              <span className="icon">👥</span>
              <h3>Manage Users</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Add users, edit profiles, and reset passwords.</p>
            </NavLink>
          )}
        </div>
      </main>
    </div>
  )
}