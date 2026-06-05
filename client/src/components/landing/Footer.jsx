// src/components/landing/Footer.jsx
export default function Footer() {
  return (
    <footer style={{
      background: '#fdf2f8',
      borderTop: '1px solid rgba(241,173,194,0.2)',
      padding: '48px 24px 32px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #f1adc2 0%, #d8b4fe 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm0 10.2a6 6 0 01-5-2.68c.02-1.66 3.34-2.57 5-2.57s4.98.91 5 2.57a6 6 0 01-5 2.68z" fill="white"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, color: '#3c2f41', fontSize: '1rem', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}>
            LinkUp
          </span>
        </div>

        <p style={{ color: '#786b7d', fontSize: '0.85rem', marginBottom: 20 }}>
          La red de networking universitario para conectar, colaborar y crecer.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 28 }}>
          {['Campus', 'Networking', 'Oportunidades', 'Privacidad', 'Términos'].map(link => (
            <a key={link} href="#" style={{
              fontSize: '0.83rem', color: '#786b7d',
              textDecoration: 'none', transition: 'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f1adc2'}
            onMouseLeave={e => e.currentTarget.style.color = '#786b7d'}
            >
              {link}
            </a>
          ))}
        </div>

        <p style={{ fontSize: '0.75rem', color: '#786b7d', opacity: 0.7 }}>
          © 2025 LinkUp · Hecho con 💜 para estudiantes colombianos
        </p>
      </div>
    </footer>
  );
}