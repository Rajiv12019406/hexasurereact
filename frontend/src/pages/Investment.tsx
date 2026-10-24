import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../lib/api'

interface FormData {
  name: string
  email: string
  organization: string
  region: string
  message: string
}

export default function Investment() {
  const heroRef = useScrollReveal()
  const philosophyRef = useScrollReveal()
  const criteriaRef = useScrollReveal()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organization: '',
    region: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Name and Email are required.')
      setSubmitStatus('error')
      return
    }

    setSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      await api.post('/investment', formData)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', organization: '', region: '', message: '' })
    } catch (err: any) {
      setSubmitStatus('error')
      setErrorMessage(err.response?.data?.detail || 'Error submitting form. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <section className="investment-section" ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container">
          <div className="section-header">
            <h1>Investment & Partnerships</h1>
            <p>Collaborating with visionary investors and partners to build the future.</p>
          </div>

          <div className="investment-grid">
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>Our Philosophy</h2>
              <p>
                Hexasure works with a select group of partners and investors who share our long-term view 
                on building ventures. We believe that capital is a commodity, but strategic value is rare.
              </p>
              <p>
                We bridge the gap between capital and execution, ensuring that investments are backed 
                by solid operational foundations and clear growth strategies.
              </p>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>What We Offer Partners</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> Deal flow & curated opportunities
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> Strategic oversight & due diligence
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> Access to global consulting capabilities
                  </li>
                </ul>
              </div>
            </div>

            <div className="investment-card">
              <h3 style={{ marginBottom: '1.5rem' }}>Partnership Enquiry</h3>
              
              {submitStatus === 'success' && (
                <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  Thank you for your interest. We will be in touch shortly.
                </div>
              )}

              {submitStatus === 'error' && (
                <div style={{ backgroundColor: '#fee2e2', color: '#7f1d1d', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="organization" className="form-label">Organisation / Fund</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    className="form-control"
                    value={formData.organization}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="region" className="form-label">Region of Interest</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    className="form-control"
                    placeholder="e.g. Southeast Asia, Europe"
                    value={formData.region}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    placeholder="Tell us about your investment focus or partnership goals..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section ref={philosophyRef.ref} style={{ opacity: philosophyRef.isVisible ? 1 : 0, transform: philosophyRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container text-center">
          <div className="section-header">
            <h2>What We Look For</h2>
          </div>
          <div className="grid grid-3" ref={criteriaRef.ref}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Long-term Orientation</h3>
              <p>Partners who understand that building great ventures takes time and patience.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Strategic Alignment</h3>
              <p>Shared vision on sectors, regions, and the future of technology and business.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Value Add</h3>
              <p>Investors and partners who bring more than just capital to the table.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}