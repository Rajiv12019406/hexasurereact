import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useScrollReveal, useScrollRevealMultiple } from '../../hooks/useScrollReveal'
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

interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export default function AdminMyPosts() {
  const postsRef = useScrollReveal()
  const paginationRef = useScrollReveal()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params: Record<string, any> = { page: currentPage, per_page: 10 }
      if (statusFilter !== 'all') params.status = statusFilter
      
      const response = await api.get<PostsResponse>('/posts/admin/my-posts', { params })
      setPosts(response.data.posts)
      setTotalPages(response.data.total_pages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [currentPage, statusFilter])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
    
    setDeletingId(id)
    try {
      await api.delete(`/posts/${id}`)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete post')
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

  const statusColors: Record<string, string> = {
    published: '#14532d',
    draft: '#854d0e',
  }

  const statusBgs: Record<string, string> = {
    published: '#dcfce7',
    draft: '#fef3c7',
  }

  return (
    <div>
      <header className="admin-header">
        <div className="container admin-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink to="/" style={{ fontWeight: 800, fontSize: '1.25rem', textDecoration: 'none', color: 'var(--text-main)' }}>
              Hexasure
            </NavLink>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-muted)' }}>My Insights</span>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }} ref={postsRef.ref} style={{ opacity: postsRef.isVisible ? 1 : 0, transform: postsRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
          <h1>My Insights</h1>
          <NavLink to="/admin/create-post" className="btn btn-primary">Write New Insight</NavLink>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ marginRight: '1rem', fontWeight: 500 }}>Filter by status:</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['all', 'draft', 'published'] as const).map(s => (
              <button
                key={s}
                className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setStatusFilter(s)}
                style={{ textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse" style={{ minHeight: '200px' }}></div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-3">
            {posts.map((post, index) => (
              <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: statusBgs[post.status] || statusBgs.draft,
                        color: statusColors[post.status] || statusColors.draft,
                      }}
                    >
                      {post.status}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(post.updated_at)}
                    </span>
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {post.category}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {post.excerpt.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <NavLink to={`/admin/edit-post/${post.id}`} className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                    Edit
                  </NavLink>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    style={{ flex: 1, background: '#fee2e2', borderColor: '#ef4444', color: '#7f1d1d' }}
                  >
                    {deletingId === post.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>No posts yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {statusFilter !== 'all' ? 'No posts with this status.' : 'Start writing your first insight.'}
            </p>
            {statusFilter === 'all' && (
              <NavLink to="/admin/create-post" className="btn btn-primary">Write New Insight</NavLink>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="insight-pagination" ref={paginationRef.ref} style={{ opacity: paginationRef.isVisible ? 1 : 0, transform: paginationRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
            {currentPage > 1 && (
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={loading}
              >
                &larr; Previous
              </button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentPage(page)}
                disabled={loading}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={loading}
              >
                Next &rarr;
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}