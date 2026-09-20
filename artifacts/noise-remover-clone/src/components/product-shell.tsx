import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

const links = [
  ['Blog', '/blog'],
  ['About', '/about'],
  ['FAQ', '/faq'],
  ['Contact Us', '/contact'],
];

export function ProductLogo() {
  return (
    <Link className="brand" href="/" data-testid="link-brand">
      <span className="brand-mark">NR</span>
      <span className="brand-name">Noise<span>Remover</span></span>
    </Link>
  );
}

export function ProductShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="site-shell internal-shell">
      <header className="topbar">
        <div className="container nav-inner">
          <ProductLogo />
          <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open} data-testid="button-mobile-menu">
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
            {links.map(([label, href]) => (
              <Link className="nav-link" href={href} key={href} onClick={() => setOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`}>{label}</Link>
            ))}
          </nav>
          <div className="nav-actions">
            <Link className="btn btn-outline btn-small" href="/login" data-testid="link-login">Log in</Link>
            <Link className="btn btn-dark btn-small" href="/signup" data-testid="link-signup">Sign up free</Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div><ProductLogo /><p className="footer-copy">Clearer speech for creators, teams, and the moments worth hearing.</p></div>
            <div><h4>Explore</h4><div className="footer-links"><Link className="footer-link" href="/blog">Blog</Link><Link className="footer-link" href="/about">About</Link><Link className="footer-link" href="/faq">FAQ</Link></div></div>
            <div><h4>Get in touch</h4><div className="footer-links"><Link className="footer-link" href="/contact">Contact Us</Link><Link className="footer-link" href="/signup">Create a free account</Link><Link className="footer-link" href="/login">Log in</Link></div></div>
            <div><h4>Resources</h4><div className="footer-links"><Link className="footer-link" href="/faq">Help center</Link><Link className="footer-link" href="/#before-after">Audio samples</Link><Link className="footer-link" href="/#how-it-works">How it works</Link></div></div>
          </div>
          <div className="footer-bottom"><span>Made in Pakistan</span><span>Made for better listening.</span></div>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ kicker, title, copy }: { kicker: string; title: string; copy: string }) {
  return <div className="page-intro"><div className="section-kicker">{kicker}</div><h1 className="display">{title}</h1><p>{copy}</p></div>;
}

export function ContactCta({ title = 'Have a recording worth rescuing?', copy = 'Start with a free clean-up, or talk with a human about your workflow.' }) {
  return <section className="internal-cta"><div><div className="section-kicker">Keep the good parts</div><h2>{title}</h2><p>{copy}</p></div><Link className="btn btn-dark" href="/contact">Talk to our team <ArrowRight size={15} /></Link></section>;
}