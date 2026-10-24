import { useState, useEffect } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../lib/api'

interface FormData {
  name: string
  email: string
  region: string
  type: string
  message: string
  guardian_confirmation: boolean
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const heroRef = useScrollReveal()
  const formRef = useScrollReveal()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    region: '',
    type: '',
    message: '',
    guardian_confirmation: false,
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    if (success === '1') setSubmitStatus('success')
    if (error) setSubmitStatus('error')
  }, [searchParams])

  const validateForm = () => {
    const newErrors: Partial<FormData> = {}
    if (!formData.name.trim()) newErrors.name = true
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true
    if (!formData.type) newErrors.type = true
    if (!formData.guardian_confirmation) newErrors.guardian_confirmation = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const programmes: Record<string, string> = {
        cube_puzzles: 'Cube Puzzles & Speedcubing',
        sudoku_reasoning: 'Sudoku & Logical Reasoning',
        math_olympiad: 'Mathematical Olympiad & Problem-Solving',
        not_sure: 'Not sure yet',
      }

      const messageParts = [
        'Adult contact confirmation: adult; parent/guardian submitting for any student under 18.',
        `Programme of interest: ${programmes[formData.type]}`,
      ]

      if (formData.message.trim()) {
        messageParts.push(`Learning goals or questions: ${formData.message}`)
      }

      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        region: formData.region,
        type: formData.type,
        message: formData.message,
        guardian_confirmation: formData.guardian_confirmation,
      })

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        region: '',
        type: '',
        message: '',
        guardian_confirmation: false,
      })
      setErrors({})
    } catch (err: any) {
      setSubmitStatus('error')
      setErrorMessage(err.response?.data?.detail || 'We couldn\'t submit your enquiry just now. Please try again later or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: false }))
    }
  }

  const programmes = [
    { value: '', label: 'Choose a programme' },
    { value: 'cube_puzzles', label: 'Cube Puzzles & Speedcubing' },
    { value: 'sudoku_reasoning', label: 'Sudoku & Logical Reasoning' },
    { value: 'math_olympiad', label: 'Mathematical Olympiad & Problem-Solving' },
    { value: 'not_sure', label: 'Not sure yet' },
  ]

  return (
    <>
      <section className="edu-hero" ref={heroRef.ref} style={{ opacity: heroRef.isVisible ? 1 : 0, transform: heroRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container text-center">
          <div className="edu-hero__badge">Private lesson enquiries</div>
          <h1>Let's find the right learning challenge.</h1>
          <p>
            Tell us a little about what the student would like to explore. We'll follow up to discuss the programme and possible next steps.
          </p>
        </div>
      </section>

      <section className="edu-section" ref={formRef.ref} style={{ opacity: formRef.isVisible ? 1 : 0, transform: formRef.isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
        <div className="container contact-enquiry-layout">
          <div className="contact-enquiry-intro">
            <h2>A personal starting point</h2>
            <p>
              Hexasure offers private, one-to-one educational enrichment focused on reasoning, careful observation, and independent problem-solving.
            </p>
            <p>
              This form is an enquiry only. It does not confirm a lesson, booking, place, availability, or payment.
            </p>
            <div className="contact-note">
              <h3>For students under 18</h3>
              <p>
                A parent or legal guardian must submit the enquiry on the student's behalf. Please do not include sensitive personal information or school records.
              </p>
            </div>
            <p className="contact-email-note">
              Prefer email? <a href="mailto:contact@hexasure.com">contact@hexasure.com</a>
            </p>
          </div>

          <div className="edu-profile-card contact-form-card">
            <h2>Enquire about lessons</h2>

            {submitStatus === 'success' && (
              <div className="form-notice form-notice--success" role="status">
                Thank you. Your enquiry has been received. This is not a confirmed booking; we'll be in touch to discuss next steps.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-notice form-notice--error" role="alert">
                {errorMessage || 'Please check the required fields and try again.'}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Parent or adult contact name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  autoComplete="name"
                  maxLength={120}
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {errors.name && <span className="text-muted" style={{fontSize: '0.85rem'}}>Required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {errors.email && <span className="text-muted" style={{fontSize: '0.85rem'}}>Valid email required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="region" className="form-label">
                  Country or time zone <span className="text-muted">(optional)</span>
                </label>
                <input
                  type="text"
                  id="region"
                  name="region"
                  className="form-control"
                  autoComplete="country-name"
                  maxLength={120}
                  value={formData.region}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Programme of interest
                </label>
                <select
                  id="type"
                  name="type"
                  className={`form-control ${errors.type ? 'error' : ''}`}
                  required
                  value={formData.type}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  {programmes.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                {errors.type && <span className="text-muted" style={{fontSize: '0.85rem'}}>Required</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  What would you like the student to work on? <span className="text-muted">(optional)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  rows={4}
                  maxLength={2000}
                  placeholder="Share interests, goals, or questions. Please do not include sensitive personal information."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="form-group consent-group">
                <input
                  type="checkbox"
                  id="guardian_confirmation"
                  name="guardian_confirmation"
                  className={`${errors.guardian_confirmation ? 'error' : ''}`}
                  required
                  checked={formData.guardian_confirmation}
                  onChange={handleChange}
                  disabled={submitting}
                />
                <label htmlFor="guardian_confirmation">
                  I am an adult. If this enquiry is for a student under 18, I am their parent or legal guardian and am submitting it on their behalf.
                </label>
                {errors.guardian_confirmation && <span className="text-muted" style={{fontSize: '0.85rem'}}>Required</span>}
              </div>

              <p className="form-privacy-note">
                We use these details to manage and respond to this enquiry. Do not enter sensitive personal information.
              </p>

              <button type="submit" className="btn btn-primary contact-submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Lesson Enquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}