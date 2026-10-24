import { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../lib/api'

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
  author?: {
    first_name: string | null
    last_name: string | null
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const containerRef = useScrollReveal()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return
      try {
        setLoading(true)
        const response = await api.get<Post>(`/posts/${slug}`)
        setPost(response.data)
      } catch (err) {
        setError('Post not found')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <article className="edu-section insight-post" ref={containerRef.ref}>
        <div className="container insight-post-container">
          <header className="insight-post-header animate-pulse">
            <div className="eyebrow">Category</div>
            <h1>Loading article title...</h1>
            <p className="insight-post-meta">
              By Author <span aria-hidden="true">·</span> Date
            </p>
          </header>
          <div className="insight-post-content animate-pulse">
            <p>Loading content...</p>
            <p>Loading content...</p>
            <p>Loading content...</p>
          </div>
        </div>
      </article>
    )
  }

  if (error || !post) {
    return (
      <article className="edu-section insight-post" ref={containerRef.ref}>
        <div className="container insight-post-container">
          <div className="form-notice form-notice--error" role="alert">
            {error || 'Post not found'}
          </div>
          <div className="hero-buttons" style={{ marginTop: '2rem' }}>
            <NavLink to="/blog" className="btn btn-secondary">&larr; Back to Insights</NavLink>
          </div>
        </div>
      </article>
    )
  }

  const authorName = post.author 
    ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim()
    : 'Hexasure'

  return (
    <article className="edu-section insight-post" ref={containerRef.ref} style={{ opacity: containerRef.isVisible ? 1 : 0, transform: containerRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
      <div className="container insight-post-container">
        <header className="insight-post-header">
          <div className="eyebrow">{post.category}</div>
          <h1>{post.title}</h1>
          <p className="insight-post-meta">
            By {authorName}
            <span aria-hidden="true">·</span>
            {formatDate(post.published_at || post.created_at)}
          </p>
        </header>

        <div className="insight-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        <footer className="insight-post-footer">
          <NavLink to="/blog" className="btn btn-secondary">&larr; Back to Insights</NavLink>
          <NavLink to="/contact" className="btn btn-primary">Enquire About Lessons</NavLink>
        </footer>
      </div>
    </article>
  )
}