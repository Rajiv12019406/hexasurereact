import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Programmes() {
  const location = useLocation()
  const heroRef = useScrollReveal()
  const programmesRef = useScrollReveal()
  const approachRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  useEffect(() => {
    const hash = location.hash?.replace('#', '')
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const scrollToHash = () => {
      const target = document.getElementById(hash)
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Wait a tick so layout/reveal styles settle after route change
    const timer = window.setTimeout(scrollToHash, 80)
    return () => window.clearTimeout(timer)
  }, [location.pathname, location.hash])

  const programmes = [
    {
      id: 'cube-puzzles',
      eyebrow: 'Category 01',
      title: 'Cube Puzzles & Speedcubing',
      description: 'Learn to observe patterns, apply efficient techniques, and improve spatial reasoning through guided cube-solving practice.',
      features: [
        '2x2, 3x3, 4x4, and Mirror Cube',
        'Algorithms, observation, and reduction of errors',
        'Persistence in unfamiliar problem-solving',
      ],
    },
    {
      id: 'sudoku-logical-reasoning',
      eyebrow: 'Category 02',
      title: 'Sudoku & Logical Reasoning',
      description: 'Develop systematic thinking through structured deduction, elimination, and disciplined reasoning without guesswork.',
      features: [
        'Beginner, intermediate, and advanced Sudoku',
        'Constraint-based reasoning and pattern recognition',
        'Clear steps, checking, and logical justification',
      ],
    },
    {
      id: 'olympiad-problem-solving',
      eyebrow: 'Category 03',
      title: 'Mathematical Olympiad & Problem-Solving',
      description: 'Explore elegant problem-solving, structured arguments, and mathematical proof through olympiad-style challenges.',
      features: [
        'Number theory, combinatorics, and geometry',
        'Creative and rigorous mathematical thinking',
        'Explaining why a solution works',
      ],
    },
  ]

  return (
    <>
      <section className="edu-hero" ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container text-center">
          <div className="edu-hero__badge">Private, one-to-one learning</div>
          <h1>Programmes for independent thinking.</h1>
          <p>
            Build reasoning, persistence, and problem-solving confidence through carefully guided learning in three focused categories.
          </p>
        </div>
      </section>

      <section
        id="pathways"
        className="edu-section"
        ref={programmesRef.ref}
        style={{ opacity: programmesRef.isVisible ? 1 : 0, transform: programmesRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>Three pathways to stronger reasoning</h2>
            <p>
              Each programme is designed to help students think more clearly, solve unfamiliar challenges, and explain their thinking with confidence.
            </p>
          </div>

          <div className="edu-programmes-grid">
            {programmes.map((programme, index) => {
              const isTarget = location.hash === `#${programme.id}`
              return (
                <article
                  key={programme.id}
                  className={`programme-card reveal ${index > 0 ? `delay-${index}00` : ''} ${isTarget ? 'programme-card--target' : ''}`}
                  id={programme.id}
                >
                  <span className="eyebrow">{programme.eyebrow}</span>
                  <h3>{programme.title}</h3>
                  <p>{programme.description}</p>
                  <ul className="programme-features">
                    {programme.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <NavLink className="programme-link" to="/contact">Enquire about this programme &rarr;</NavLink>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="learning-approach"
        className="edu-section"
        ref={approachRef.ref}
        style={{ opacity: approachRef.isVisible ? 1 : 0, transform: approachRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <div className="container">
          <div className="edu-profile-grid edu-profile-grid--equal">
            <div className="edu-profile-card reveal">
              <h2>Learning approach</h2>
              <p>
                Every lesson is shaped around the student's current level, goals, and the habits needed to tackle unfamiliar challenges with confidence.
              </p>
              <p>
                We focus on problem structure, independent thinking, and clear reasoning rather than answer-first methods.
              </p>
            </div>
            <div className="edu-profile-card reveal delay-100">
              <h2>Private lesson format</h2>
              <p>
                Students may be school-age and may require parent or guardian support at the enquiry stage. The learning experience is designed to remain personalised, focused, and age-appropriate.
              </p>
              <p>
                Full lesson logistics, availability, and pricing details remain subject to final confirmation and are intentionally kept flexible at this stage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="book-conversation"
        className="edu-section"
        ref={ctaRef.ref}
        style={{ opacity: ctaRef.isVisible ? 1 : 0, transform: ctaRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <div className="container">
          <div className="edu-cta reveal">
            <h2>Book a learning conversation.</h2>
            <p>
              Tell us which programme fits the student best and we will guide the next steps with a personalised approach.
            </p>
            <div className="hero-buttons">
              <NavLink to="/contact" className="btn btn-primary">Enquire About Lessons</NavLink>
              <NavLink to="/about" className="btn btn-secondary">Learn About Hexasure</NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}