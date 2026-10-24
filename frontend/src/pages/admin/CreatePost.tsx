import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import api from '../../lib/api'

interface FormData {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  status: 'draft' | 'published'
}

export default function AdminCreatePost() {
  const navigate = useNavigate()
  const containerRef = useScrollReveal()

  const [formData, setFormData] = useState<FormData>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      }
      await api.post('/posts', payload)
      setSuccess(true)
      setTimeout(() => navigate('/admin/my-posts'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }
  }

  const categories = [
    'Cube Puzzles',
    'Sudoku & Logical Reasoning',
    'Mathematical Olympiad',
    'Learning Philosophy',
    'Teaching Methods',
  ]

  return (
    <div>
      <header className="admin-header">
        <div className="container admin-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/" style={{ fontWeight: 800, fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-main)' }}>
              Hexasure
            </a>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>Create Post</span>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '4rem', maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem' }} ref={containerRef.ref} style={{ opacity: containerRef.isVisible ? 1 : 0, transform: containerRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          Write New Insight
        </h1>

        {success && (
          <div className="form-notice form-notice--success" role="status" style={{ marginBottom: '2rem' }}>
            Post created successfully! Redirecting...
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
            <small style={{ color: 'var(--text-muted)' }}>Auto-generated from title. Must be unique.</small>
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
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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
              placeholder="Full article content. You can use HTML tags like <p>, <h2>, <ul>, <li>, <strong>, <em>, <img>, etc."
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
            />
            <small style={{ color: 'var(--text-muted)' }}>Write content in HTML format. Images should use full URLs.</small>
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

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/my-posts')}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}