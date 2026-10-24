import { NavLink } from 'react-router-dom'
import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal'
import CubeScene from '../components/CubeScene'

export default function Home() {
  const heroRef = useScrollReveal()
  const cubeRef = useScrollReveal()
  const programmesRef = useScrollReveal()
  const philosophyRef = useScrollRevealMultiple(4)
  const stepsRef = useScrollRevealMultiple(5)
  const profileRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  const programmes = [
    {
      id: 'cube-puzzles',
      eyebrow: 'Programme 01',
      title: 'Cube Puzzles & Speedcubing',
      description: 'Develop spatial reasoning, observation, pattern recognition, and efficient problem-solving through structured cube practice.',
      features: [
        '2x2, 3x3, 4x4, and Mirror Cube',
        'Algorithmic thinking and persistence',
        'Improved focus and pattern recognition',
      ],
      link: '/services#cube-puzzles',
    },
    {
      id: 'sudoku-logical-reasoning',
      eyebrow: 'Programme 02',
      title: 'Sudoku & Logical Reasoning',
      description: 'Strengthen systematic thinking, elimination techniques, and constraint-based reasoning using progressive, well-structured challenges.',
      features: [
        'Beginner to advanced Sudoku',
        'Logical deduction and pattern recognition',
        'Solving without guesswork',
      ],
      link: '/services#sudoku-logical-reasoning',
    },
    {
      id: 'olympiad-problem-solving',
      eyebrow: 'Programme 03',
      title: 'Mathematical Olympiad & Problem-Solving',
      description: 'Explore logic, creativity, and structured thinking through olympiad-style challenges and mathematical proof-building.',
      features: [
        'Number theory, combinatorics, and geometry',
        'Reasoning and mathematical proof',
        'Explaining why a solution works',
      ],
      link: '/services#olympiad-problem-solving',
    },
  ]

  const philosophies = [
    { title: 'Think beyond memorised answers.', description: 'Students are encouraged to understand the method, not just the result.' },
    { title: 'Observe before acting.', description: 'Careful attention to patterns, structure, and constraints develops sharper analytical instincts.' },
    { title: 'Explore multiple approaches.', description: 'Different routes to a solution build flexibility and deeper understanding.' },
    { title: 'Learn to explain your reasoning.', description: 'Clear communication is part of mathematical and logical mastery.' },
  ]

  const steps = [
    { number: 1, title: 'Choose a programme', description: 'Select the area of focus that best matches the student\'s interests and goals.' },
    { number: 2, title: 'Discuss current level', description: 'We begin by understanding the student\'s strengths, challenges, and learning objectives.' },
    { number: 3, title: 'Plan the learning journey', description: 'Each lesson is shaped around the student\'s pace, needs, and next stage of development.' },
    { number: 4, title: 'Practise with guidance', description: 'Students work through carefully chosen problems with support, reflection, and feedback.' },
    { number: 5, title: 'Review and next steps', description: 'We identify patterns to address, strengths to build on, and the most effective next challenge.' },
  ]

  return (
    <>
      <section className="edu-hero" ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container text-center">
          <div className="edu-hero__badge">Private learning • reasoning-first</div>
          <h1>Go Beyond Your Studies.</h1>
          <p>
            Build sharper thinking, stronger reasoning, and independent problem-solving through private, one-to-one learning.
          </p>

          <div className="hero-buttons">
            <NavLink to="/services" className="btn btn-primary">Explore Our Programmes</NavLink>
            <NavLink to="/contact" className="btn btn-secondary">Enquire About Private Lessons</NavLink>
          </div>

          <div className="edu-proof-row">
            <span>✓ One-to-one support</span>
            <span>✓ Independent thinking</span>
            <span>✓ Personalised learning plans</span>
          </div>
        </div>
      </section>

      <section className="cube-feature-section" ref={cubeRef.ref} style={{ opacity: cubeRef.isVisible ? 1 : 0, transform: cubeRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container cube-feature-layout">
          <div className="cube-feature-copy reveal">
            <span className="eyebrow">A closer look · Cube puzzles</span>
            <h2 id="cube-feature-heading">See the patterns. Find the next move.</h2>
            <p>
              Cube puzzles turn observation into action. In one-to-one lessons, students explore how pieces move, recognise patterns, and choose a strategy rather than relying on guesswork.
            </p>
            <p>
              Explore 3×3 and 4×4 cube challenges as part of the Cube Puzzles & Speedcubing programme.
            </p>
            <NavLink to="/services#cube-puzzles" className="btn btn-primary">Explore Cube Puzzles</NavLink>
          </div>

          <div className="cube-feature-visual reveal">
            <CubeScene />
          </div>
        </div>
      </section>

      <section className="edu-section" ref={programmesRef.ref} style={{ opacity: programmesRef.isVisible ? 1 : 0, transform: programmesRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>Three learning programmes</h2>
            <p>
              Designed for curious students who want to solve unfamiliar problems with clarity, structure, and confidence.
            </p>
          </div>

          <div className="edu-programmes-grid">
            {programmes.map((programme, index) => (
              <article
                key={programme.id}
                className={`programme-card reveal ${index > 0 ? `delay-${index}00` : ''}`}
                style={{ opacity: programmesRef.isVisible ? 1 : 0, transform: programmesRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}
              >
                <span className="eyebrow">{programme.eyebrow}</span>
                <h3>{programme.title}</h3>
                <p>{programme.description}</p>
                <ul className="programme-features">
                  {programme.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <NavLink className="programme-link" to={programme.link}>View programme &rarr;</NavLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="edu-section" id="approach" ref={philosophyRef.ref}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>Our philosophy</h2>
            <p>
              We help students think independently, explore multiple approaches, and explain their reasoning with confidence.
            </p>
          </div>

          <div className="edu-philosophy-grid">
            {philosophies.map((philosophy, index) => (
              <div
                key={index}
                ref={philosophyRef.setRef(index)}
                className={`philosophy-card reveal ${index % 2 === 1 ? 'delay-100' : ''}`}
                style={{ opacity: philosophyRef.visible[index] ? 1 : 0, transform: philosophyRef.visible[index] ? 'translateY(0)' : 'translateY(20px)' }}
              >
                <h3>{philosophy.title}</h3>
                <p>{philosophy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="edu-section" ref={stepsRef.ref}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>How private lessons work</h2>
            <p>
              A clear and personal process that helps students grow with structure and purpose.
            </p>
          </div>

          <div className="edu-step-grid">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={stepsRef.setRef(index)}
                className={`step-card reveal ${index > 0 ? `delay-${index}00` : ''}`}
                style={{ opacity: stepsRef.visible[index] ? 1 : 0, transform: stepsRef.visible[index] ? 'translateY(0)' : 'translateY(20px)' }}
              >
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="edu-section" ref={profileRef.ref} style={{ opacity: profileRef.isVisible ? 1 : 0, transform: profileRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-profile-grid">
            <div className="profile-placeholder reveal">
              Instructor profile placeholder<br />
              To be supplied later
            </div>
            <div className="edu-profile-card reveal delay-100">
              <h2>Meet the instructor</h2>
              <p>
                Hexasure provides private, one-to-one educational enrichment with a focus on reasoning, analytical thinking, and independent problem-solving.
              </p>
              <p>
                Full teaching profile details, verified qualifications, and instructor-specific information will be added once confirmed.
              </p>
              <p>
                For younger students, parent or guardian communication, consent, and privacy considerations are handled carefully throughout the enquiry process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="edu-section" ref={ctaRef.ref} style={{ opacity: ctaRef.isVisible ? 1 : 0, transform: ctaRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-cta reveal">
            <h2>Start with a tailored learning conversation.</h2>
            <p>
              Whether your student is exploring a new challenge or strengthening core skills, we can recommend the right programme and next steps.
            </p>
            <div className="hero-buttons">
              <NavLink to="/contact" className="btn btn-primary">Enquire About Lessons</NavLink>
              <NavLink to="/services" className="btn btn-secondary">Explore Programmes</NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}