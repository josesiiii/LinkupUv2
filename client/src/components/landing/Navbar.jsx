// src/components/landing/Navbar.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';

const NAV_LINKS = [
  { label: 'Inicio',        href: '#inicio' },
  { label: 'Campus',        href: '#campus' },
  { label: 'Networking',    href: '#networking' },
  { label: 'Oportunidades', href: '#oportunidades' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScroll = (href) => {
    setMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: scrolled ? '12px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: scrolled ? 'calc(100% - 48px)' : 'calc(100% - 80px)',
          maxWidth: '1100px',
          zIndex: 100,
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          background: scrolled
            ? 'rgba(255,255,255,0.72)'
            : 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(241,173,194,0.3)',
          borderRadius: scrolled ? '20px' : '24px',
          boxShadow: scrolled
            ? '0 8px 32px rgba(60,47,65,0.1), 0 1px 0 rgba(255,255,255,0.6) inset'
            : '0 4px 20px rgba(241,173,194,0.15)',
          padding: scrolled ? '10px 24px' : '14px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <Logo size={32} />
          </button>

          {/* Links — desktop */}
          <div
            className="nav-links-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => { e.preventDefault(); handleScroll(link.href); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 100,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#786b7d',
                  textDecoration: 'none',
                  transition: 'all 180ms ease',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(241,173,194,0.15)';
                  e.currentTarget.style.color = '#3c2f41';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#786b7d';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '7px 18px',
                background: 'transparent',
                border: '1px solid rgba(241,173,194,0.5)',
                borderRadius: 100,
                color: '#5e4e63',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 180ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(241,173,194,0.12)';
                e.currentTarget.style.borderColor = '#f1adc2';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(241,173,194,0.5)';
              }}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '7px 18px',
                background: '#f1adc2',
                border: '1px solid transparent',
                borderRadius: 100,
                color: '#3c2f41',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 180ms ease',
                boxShadow: '0 2px 10px rgba(241,173,194,0.4)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#e892b0';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(241,173,194,0.5)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f1adc2';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(241,173,194,0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Crear cuenta
            </button>

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(v => !v)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: '#3c2f41',
              }}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid rgba(241,173,194,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => { e.preventDefault(); handleScroll(link.href); }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 12,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: '#5e4e63',
                  textDecoration: 'none',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(241,173,194,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 680px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}