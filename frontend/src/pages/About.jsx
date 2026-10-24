import { NavLink } from 'react-router-dom'
import { useScrollReveal, useScrollRevealMultiple } from '../hooks/useScrollReveal'

export default function About() {
  const heroRef = useScrollReveal()
  const missionRef = useScrollReveal()
  const philosophyRef = useScrollRevealMultiple(4)
  const profileRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  const missions = [
    { title: 'Mission', description: 'To empower students with the confidence and methods they need to approach difficult problems with curiosity, discipline, and clarity.' },
    { title: 'Vision', description: 'To make premium, reasoning-first education accessible to students who want to grow beyond the classroom and develop lasting intellectual habits.' },
  ]

  const philosophies = [
    { title: 'Think beyond memorised answers.', description: 'Students are guided to understand the structure behind a problem and why a method works.' },
    { title: 'Observe before acting.', description: 'Careful attention to clues, patterns, and constraints leads to clearer decisions.' },
    { title: 'Explore multiple approaches.', description: 'Different strategies deepen understanding and increase flexibility in unfamiliar situations.' },
    { title: 'Explain your reasoning.', description: 'When students articulate their thinking, they become more confident and more capable learners.' },
  ]

  return (
    <>
      <section className="edu-hero" ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container text-center">
          <div className="edu-hero__badge">About Hexasure</div>
          <h1>Helping students think clearly and solve with confidence.</h1>
          <p>
            Hexasure supports learners who want to go beyond memorised answers and build lasting analytical habits through personalised instruction.
          </p>
        </div>
      </section>

      <section className="edu-section" ref={missionRef.ref} style={{ opacity: missionRef.isVisible ? 1 : 0, transform: missionRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>Our mission</h2>
            <p>
              We help students develop the habits of careful observation, critical thinking, structured reasoning, and independent problem-solving.
            </p>
          </div>

          <div className="edu-mission-grid">
            {missions.map((mission, index) => (
              <div key={index} className={`edu-profile-card reveal ${index > 0 ? 'delay-100' : ''}`}>
                <h3>{mission.title}</h3>
                <p>{mission.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="edu-section" ref={philosophyRef.ref}>
        <div className="container">
          <div className="edu-section-header reveal">
            <h2>Our teaching philosophy</h2>
            <p>
              We believe strong learning develops through reflection, explanation, and persistence — not shortcuts.
            </p>
          </div>

          <div className="edu-philosophy-grid">
            {philosophies.map((philosophy, index) => (
              <div
                key={index}
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

      <section className="edu-section" ref={profileRef.ref} style={{ opacity: profileRef.isVisible ? 1 : 0, transform: profileRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-profile-grid">
            <div className="profile-placeholder reveal">
              Instructor profile placeholder<br />
              To be supplied later
            </div>
            <div className="edu-profile-card reveal delay-100">
              <h2>Instructor profile</h2>
              <p>
                Hexasure is building a premium educational enrichment offering grounded in private, one-to-one learning and personalised guidance.
              </p>
              <p>
                Full instructor details, verified qualifications, and profile information will be added once confirmed and approved.
              </p>
              <p>
                Parent and guardian communication, consent, privacy, and age-appropriate support remain a central part of the educational experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="edu-section" ref={ctaRef.ref} style={{ opacity: ctaRef.isVisible ? 1 : 0, transform: ctaRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="edu-cta reveal">
            <h2>Start a personalised learning conversation.</h2>
            <p>
              If you are looking for private lessons that help students build real reasoning skills, we would be pleased to discuss the right programme.
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