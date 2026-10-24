import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import api from '../../lib/api'

interface User {
  id: number
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  is_super_admin: boolean
  created_at: string
}

interface UsersResponse {
  users: User[]
  total: number
}

export default function AdminUsers() {
  const { user } = useAuth()
  const containerRef = useScrollReveal()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'admin' as 'admin' | 'super_admin',
    is_super_admin: false,
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await api.get<UsersResponse>('/auth/users')
      setUsers(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({
      email: '',
      first_name: '',
      last_name: '',
      role: 'admin',
      is_super_admin: false,
      password: '',
    })
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role as 'admin' | 'super_admin',
      is_super_admin: user.is_super_admin,
      password: '',
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (editingUser) {
        await api.put(`/auth/users/${editingUser.id}`, formData)
      } else {
        await api.post('/auth/register', formData)
      }
      closeModal()
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save user')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const handleDelete = async (id: number) => {
    if (id === user?.id) {
      alert('You cannot delete yourself')
      return
    }
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    setDeletingId(id)
    try {
      await api.delete(`/auth/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete user')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
            <span style={{ color: 'var(--text-muted)' }}>Manage Users</span>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} ref={containerRef.ref} style={{ opacity: containerRef.isVisible ? 1 : 0, transform: containerRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          <h1>Manage Users</h1>
          <button className="btn btn-primary" onClick={openCreateModal}>Add User</button>
        </div>

        {loading ? (
          <div className="card">
            <div className="animate-pulse" style={{ height: '200px' }}></div>
          </div>
        ) : (
          <div className="card" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>User</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>Super Admin</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 600 }}>Created</th>
                  <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500 }}>{u.first_name || u.email}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {u.is_super_admin ? (
                        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Yes</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>No</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>{formatDate(u.created_at)}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary"
                          onClick={() => openEditModal(u)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#fee2e2', borderColor: '#ef4444', color: '#7f1d1d' }}
                        >
                          {deletingId === u.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No users found. Click "Add User" to create one.
              </div>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 style={{ marginBottom: '1.5rem' }}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              
              {error && (
                <div className="form-notice form-notice--error" role="alert" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting || editingUser}
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

                <div className="form-group">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    id="role"
                    name="role"
                    className="form-control"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div className="form-group consent-group">
                  <input
                    type="checkbox"
                    id="is_super_admin"
                    name="is_super_admin"
                    checked={formData.is_super_admin}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                  <label htmlFor="is_super_admin">Super Admin Access</label>
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={submitting}
                    required={!editingUser}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}