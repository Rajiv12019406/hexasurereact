import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal'
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
}

interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export default function Blog() {
  const heroRef = useScrollReveal()
  const topicsRef = useScrollReveal()
  const articlesRef = useScrollReveal()
  const paginationRef = useScrollReveal()

  const [featuredPost, setFeaturedPost] = useState<Post | null>(null)
  const [gridPosts, setGridPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const limit = page === 1 ? 7 : 6
      const offset = page === 1 ? 0 : (page - 1) * 6 + 1
      
      const response = await api.get<PostsResponse>('/posts', {
        params: { page, per_page: limit },
      })
      
      const data = response.data
      
      if (page === 1 && data.posts.length > 0) {
        setFeaturedPost(data.posts[0])
        setGridPosts(data.posts.slice(1, 7))
      } else {
        setGridPosts(data.posts)
      }
      
      setTotalPages(data.total_pages)
    } catch (err) {
      setError('Failed to load posts. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, limit: number) => {
    const stripped = text.replace(/<[^>]*>/g, '')
    if (stripped.length > limit) {
      return stripped.substring(0, limit) + '...'
    }
    return stripped
  }

  const topicCards = [
    {
      href: '/services#cube-puzzles',
      eyebrow: '01 · Cube puzzles',
      title: 'Cube-solving techniques',
      description: 'Patterns, spatial reasoning, algorithms, and patient practice.',
    },
    {
      href: '/services#sudoku-logical-reasoning',
      eyebrow: '02 · Logical reasoning',
      title: 'Sudoku strategies',
      description: 'Structured deduction, elimination, and solving without guesswork.',
    },
    {
      href: '/services#olympiad-problem-solving',
      eyebrow: '03 · Mathematical thinking',
      title: 'Challenges and proofs',
      description: 'Creative approaches, clear arguments, and why a solution works.',
    },
  ]

  return (
    <>
      <section className="edu-hero" ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-section-header reveal">
            <div className="edu-hero__badge">Ideas for curious learners</div>
            <h1>Insights for thinking beyond the answer.</h1>
            <p>
              Explore approaches to cube-solving, Sudoku, logical reasoning, mathematical challenges, and independent learning.
            </p>
          </div>

          {featuredPost && (
            <div className="reveal delay-100" style={{ marginTop: '4rem', marginBottom: '6rem' }}>
              <Link to={`/blog/${featuredPost.slug}`} className="insight-featured-link">
                <div className="insight-featured">
                  <div>
                    <span className="eyebrow">Featured Insight</span>
                    <h2>{featuredPost.title}</h2>
                    <p className="insight-featured-excerpt">
                      {truncateText(featuredPost.excerpt, 200)}
                    </p>
                    <div className="insight-meta">
                      <span>Read Article &rarr;</span>
                      <span>|</span>
                      <span>{formatDate(featuredPost.published_at || featuredPost.created_at)}</span>
                      <span>|</span>
                      <span>{featuredPost.category}</span>
                    </div>
                  </div>
                  <div className="insight-featured-art" aria-hidden="true">
                    <span className="insight-art-mark">?</span>
                    <span>Observe. Reason. Explain.</span>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="edu-section" ref={topicsRef.ref} style={{ opacity: topicsRef.isVisible ? 1 : 0, transform: topicsRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>Explore learning themes</h2>
            <p>These are the three programme areas around which Hexasure's educational insights are organised.</p>
          </div>

          <div className="insight-topic-grid">
            {topicCards.map((topic, index) => (
              <NavLink
                key={index}
                to={topic.href}
                className="insight-topic-card"
              >
                <span className="eyebrow">{topic.eyebrow}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
              </NavLink>
            ))}
          </div>

          <div className="insight-articles" ref={articlesRef.ref} style={{ opacity: articlesRef.isVisible ? 1 : 0, transform: articlesRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
            <h2 className="reveal">Latest published articles</h2>
            <p className="insight-articles-note">
              Articles remain loaded from the existing publishing database. Existing records have not been edited or deleted.
            </p>

            <div className="grid grid-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <article key={i} className="insight-article-card reveal animate-pulse">
                    <div className="insight-article-art" aria-hidden="true"></div>
                    <div className="eyebrow">Category</div>
                    <h3><a href="#">Loading article title...</a></h3>
                    <p>Loading excerpt...</p>
                    <div className="insight-article-date">Loading...</div>
                  </article>
                ))
              ) : gridPosts.length > 0 ? (
                gridPosts.map((post, index) => (
                  <article key={post.id} className="insight-article-card reveal" style={{ transitionDelay: `${index * 100}ms` }}>
                    <div className="insight-article-art" aria-hidden="true"></div>
                    <div className="eyebrow">{post.category}</div>
                    <h3>
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p>{truncateText(post.excerpt, 100)}</p>
                    <div className="insight-article-date">
                      {formatDate(post.published_at || post.created_at)}
                    </div>
                  </article>
                ))
              ) : (
                <div className="insight-empty-state">
                  <p>No published articles are available on this page yet. Explore a programme to discover the learning themes.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="reveal insight-pagination" ref={paginationRef.ref} style={{ opacity: paginationRef.isVisible ? 1 : 0, transform: paginationRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
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

            {error && (
              <div className="form-notice form-notice--error" role="alert" style={{ marginTop: '2rem' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}