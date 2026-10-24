import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import api from '../../lib/api'

interface Post {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author_id: number
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
}

interface FormData {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  status: 'draft' | 'published'
}

export default function AdminEditPost() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const containerRef = useScrollReveal()

  const [post, setPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState<FormData>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return
      try {
        const response = await api.get<Post>(`/posts/admin/my-posts`, {
          params: { page: 1, per_page: 100 }
        })
        const found = response.data.posts.find(p => p.id === parseInt(id))
        if (found) {
          setPost(found)
          setFormData({
            slug: found.slug,
            title: found.title,
            excerpt: found.excerpt,
            content: found.content,
            category: found.category,
            status: found.status as 'draft' | 'published',
          })
        } else {
          setError('Post not found')
        }
      } catch (err) {
        setError('Failed to load post')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await api.put(`/posts/${id}`, formData)
      setSuccess(true)
      setTimeout(() => navigate('/admin/my-posts'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
    
    try {
      await api.delete(`/posts/${id}`)
      navigate('/admin/my-posts')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete post')
    }
  }

  const categories = [
    'Cube Puzzles',
    'Sudoku & Logical Reasoning',
    'Mathematical Olympiad',
    'Learning Philosophy',
    'Teaching Methods',
  ]

  if (loading) {
    return (
      <div>
        <header className="admin-header">
          <div className="container admin-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <a href="/" style={{ fontWeight: 800, fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-main)' }}>
                Hexasure
              </a>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span style={{ color: 'var(--text-muted)' }}>Edit Post</span>
            </div>
          </div>
        </header>
        <main className="container" style={{ paddingTop: '4rem' }}>
          <div className="animate-pulse">Loading...</div>
        </main>
      </div>
    )
  }

  if (error && !post) {
    return (
      <div>
        <header className="admin-header">
          <div className="container admin-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <a href="/" style={{ fontWeight: 800, fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-main)' }}>
                Hexasure
              </a>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span style={{ color: 'var(--text-muted)' }}>Edit Post</span>
            </div>
          </div>
        </header>
        <main className="container" style={{ paddingTop: '4rem' }}>
          <div className="form-notice form-notice--error" role="alert">
            {error}
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/my-posts')}>
            Back to My Posts
          </button>
        </main>
      </div>
    )
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
            <span style={{ color: 'var(--text-muted)' }}>Edit Post</span>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '4rem', maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem' }} ref={containerRef.ref} style={{ opacity: containerRef.isVisible ? 1 : 0, transform: containerRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          Edit: {post?.title}
        </h1>

        {success && (
          <div className="form-notice form-notice--success" role="status" style={{ marginBottom: '2rem' }}>
            Post updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="form-notice form-notice--error" role="alert" style={{ marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              required
              maxLength={255}
              value={formData.title}
              onChange={handleChange}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug" className="form-label">Slug (URL)</label>
            <input
              type="text"
              id="slug"
              name="slug"
              className="form-control"
              required
              maxLength={255}
              value={formData.slug}
              onChange={handleChange}
              disabled={submitting}
            />
            <small style={{ color: 'var(--text-muted)' }}>Must be unique.</small>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              className="form-control"
              required
              value={formData.category}
              onChange={handleChange}
              disabled={submitting}
            >
              {categories.map(cat => (
                <option key={cat} value={cat} selected={cat === formData.category}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              className="form-control"
              rows={3}
              required
              value={formData.excerpt}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Brief summary for listings and previews"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label">Content (HTML)</label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              rows={15}
              required
              value={formData.content}
              onChange={handleChange}
              disabled={submitting}
              placeholder="Full article content in HTML format"
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/my-posts')}>
              Cancel
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleDelete} style={{ background: '#fee2e2', borderColor: '#ef4444', color: '#7f1d1d', marginLeft: 'auto' }} disabled={submitting}>
              Delete Post
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}