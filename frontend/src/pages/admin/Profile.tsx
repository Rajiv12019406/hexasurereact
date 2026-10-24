import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import api from '../../lib/api'

interface ProfileFormData {
  email: string
  first_name: string
  last_name: string
  password: string
  confirmPassword: string
}

export default function AdminProfile() {
  const { user } = useAuth()
  const containerRef = useScrollReveal()

  const [formData, setFormData] = useState<ProfileFormData>({
    email: user?.email || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    password: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (formData.password && formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setSubmitting(true)

    try {
      const payload: Record<string, any> = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      }
      if (formData.password) {
        payload.password = formData.password
      }

      await api.put('/auth/profile', payload)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setMessage(null)
  }

  return (
    <div>
      <header className="admin-header">
        <div className="container admin-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/" style={{ fontWeight: 800, fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-main)' }}>
              Hexasure
            </a>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>My Profile</span>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '4rem', maxWidth: '600px' }}>
        <h1 style={{ marginBottom: '2rem' }} ref={containerRef.ref} style={{ opacity: containerRef.isVisible ? 1 : 0, transform: containerRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          My Profile
        </h1>

        {message && (
          <div className={`form-notice form-notice--${message.type}`} role={message.type === 'success' ? 'status' : 'alert'} style={{ marginBottom: '2rem' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card profile-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="first_name" className="form-label">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name" className="form-label">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Change Password</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Leave blank to keep current password.
            </p>

            <div className="form-group">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={submitting}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '1rem' }}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  )
}