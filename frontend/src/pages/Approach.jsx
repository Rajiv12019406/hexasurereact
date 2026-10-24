import { NavLink } from 'react-router-dom'
import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal'

export default function Approach() {
  const heroRef = useScrollReveal()
  const philosophyRef = useScrollRevealMultiple(4)
  const stepsRef = useScrollRevealMultiple(4)
  const ctaRef = useScrollReveal()

  const philosophies = [
    { title: 'Observe before acting.', description: 'Notice clues, patterns, and constraints before choosing a move or method.' },
    { title: 'Explore more than one route.', description: 'Compare strategies and learn when different approaches are useful.' },
    { title: 'Explain why it works.', description: 'Put reasoning into words and support conclusions with clear steps.' },
    { title: 'Persist through challenge.', description: 'Treat mistakes as information and use them to refine the next attempt.' },
  ]

  const steps = [
    { number: 1, title: 'Understand the goal', description: 'Discuss the student\'s interests, experience, and what they hope to develop.' },
    { number: 2, title: 'Choose a challenge', description: 'Focus on cube puzzles, Sudoku and logical reasoning, or mathematical problem-solving.' },
    { number: 3, title: 'Work through it together', description: 'Use guided questions and practice to develop the student\'s own approach.' },
    { number: 4, title: 'Reflect and continue', description: 'Review the reasoning and discuss a useful next challenge.' },
  ]

  return (
    <>
      <section className="edu-hero" ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container text-center">
          <div className="edu-hero__badge">Our approach</div>
          <h1>Learning to think, not just to answer.</h1>
          <p>
            Private, one-to-one lessons help students examine a problem, choose a strategy, and explain how they reached a solution.
          </p>
        </div>
      </section>

      <section className="edu-section" ref={philosophyRef.ref}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>Reasoning is the real practice.</h2>
            <p>
              Each programme uses puzzles and mathematical challenges to help students build habits they can apply to unfamiliar problems.
            </p>
          </div>

          <div className="edu-philosophy-grid">
            {philosophies.map((philosophy, index) => (
              <article
                key={index}
                className={`philosophy-card reveal ${index % 2 === 1 ? 'delay-100' : ''}`}
                style={{ opacity: philosophyRef.visible[index] ? 1 : 0, transform: philosophyRef.visible[index] ? 'translateY(0)' : 'translateY(20px)' }}
              >
                <h3>{philosophy.title}</h3>
                <p>{philosophy.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="edu-section" ref={stepsRef.ref}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>A personal learning process</h2>
            <p>Lessons are intended to adapt to a student's current level, interests, and learning goals.</p>
          </div>
          <div className="edu-step-grid">
            {steps.map((step, index) => (
              <article
                key={index}
                className={`step-card reveal ${index > 0 ? `delay-${index}00` : ''}`}
                style={{ opacity: stepsRef.visible[index] ? 1 : 0, transform: stepsRef.visible[index] ? 'translateY(0)' : 'translateY(20px)' }}
              >
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="edu-section" ref={ctaRef.ref} style={{ opacity: ctaRef.isVisible ? 1 : 0, transform: ctaRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-cta reveal">
            <h2>Choose a programme to get started.</h2>
            <p>Explore the three learning areas or send an enquiry to discuss what may suit the student.</p>
            <div className="hero-buttons">
              <NavLink to="/services" className="btn btn-primary">Explore Programmes</NavLink>
              <NavLink to="/contact" className="btn btn-secondary">Enquire About Lessons</NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}