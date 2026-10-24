import { NavLink } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">Hexasure</div>
            <p className="footer-tagline">Go Beyond Your Studies.</p>
            <p>Private, one-to-one learning for sharper reasoning, stronger problem-solving, and greater confidence.</p>
          </div>

          <div className="footer-nav">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/services">Programmes</NavLink></li>
                <li><NavLink to="/approach">Our Approach</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/blog">Insights</NavLink></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                <li><NavLink to="/contact">Enquiries</NavLink></li>
                <li><NavLink to="/contact">Private Lessons</NavLink></li>
                <li><NavLink to="/admin/login">Admin Login</NavLink></li>
              </ul>
            </div>
          </div>

          <div className="footer-cta">
            <h4>Start with a conversation</h4>
            <p>Tell us about the student, current goals, and the learning programme that fits best.</p>
            <NavLink to="/contact" className="btn btn-primary">Enquire About Lessons</NavLink>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} Hexasure. All rights reserved.
          </div>
          <div className="footer-links">
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </div>
      </div>
    </footer>
  )
}