import { Link } from 'react-router-dom'
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import './Footer.css'

const footerLinks = {
  Explore: [
    { label: 'Agricultural Land',  to: '/explore?type=agricultural' },
    { label: 'Residential Plots',  to: '/explore?type=residential' },
    { label: 'Commercial Land',    to: '/explore?type=commercial' },
    { label: 'Investment Land',    to: '/explore?type=investment' },
    { label: 'Development Land',   to: '/explore?type=development' },
    { label: 'Farmhouse Land',     to: '/explore?type=farmhouse' },
  ],
  Partnership: [
    { label: 'List Your Land',         to: '/partner?role=landowner' },
    { label: 'Broker / Channel Partner', to: '/partner?role=broker' },
    { label: 'Developer',              to: '/partner?role=developer' },
    { label: 'Investor',               to: '/partner?role=investor' },
    { label: 'Strategic Partner',      to: '/partner?role=strategic' },
  ],
  Community: [
    { label: 'Join Community',       to: '/community' },
    { label: 'Location Insights',    to: '/community?cat=location' },
    { label: 'Land Investment',      to: '/community?cat=investment' },
    { label: 'Documentation Guide',  to: '/community?cat=documentation' },
    { label: 'Broker Network',       to: '/community?cat=brokers' },
  ],
  Company: [
    { label: 'About Plottage Hub',  to: '/#about' },
    { label: 'How It Works',        to: '/#how-it-works' },
    { label: 'Privacy Policy',      to: '/privacy' },
    { label: 'Terms & Conditions',  to: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand column */}
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="4" width="5" height="24" fill="#D4AF37"/>
                  <path d="M8 4h14a7 7 0 0 1 0 14H8" stroke="#D4AF37" strokeWidth="5" fill="none" strokeLinejoin="round"/>
                  <rect x="27" y="4" width="5" height="24" fill="#D4AF37"/>
                  <path d="M13 20L27 4" stroke="#D4AF37" strokeWidth="2.5"/>
                  <path d="M8 31L20 20L32 31" stroke="#D4AF37" strokeWidth="2.5" fill="none"/>
                  <rect x="18" y="31" width="4" height="5" fill="#D4AF37"/>
                </svg>
                <div>
                  <div className="footer__logo-name">PLOTTAGE HUB</div>
                  <div className="footer__logo-tagline">FIND. INVEST. GROW.</div>
                </div>
              </Link>

              <p className="footer__brand-desc">
                Maharashtra's premium land discovery platform connecting buyers, landowners, brokers, developers, and investors through trusted property intelligence and professional collaboration.
              </p>

              <div className="footer__contact">
                <a href="tel:+918855908374" className="footer__contact-item">
                  <Phone size={14} />
                  <span>+91 88559 08374</span>
                </a>
                <a href="mailto:plottagehub@gmail.com" className="footer__contact-item">
                  <Mail size={14} />
                  <span>plottagehub@gmail.com</span>
                </a>
                <a
                  href="https://wa.me/918855908374"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__contact-item"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Us</span>
                </a>
                <div className="footer__contact-item">
                  <MapPin size={14} />
                  <span>Maharashtra, India</span>
                </div>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading} className="footer__col">
                <h4 className="footer__col-heading">{heading}</h4>
                <ul className="footer__col-links">
                  {links.map(link => (
                    <li key={link.to}>
                      <Link to={link.to} className="footer__link">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copyright">
              © 2026 Plottage Hub. All rights reserved.
            </p>
            <p className="footer__disclaimer">
              Property information is owner-provided. Verify independently before any transaction.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
