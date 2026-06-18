// src/pages/LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import Hero from '../components/ui/animated-shader-hero';
import Navbar from '../components/landing/Navbar';
import CampusSection from '../components/landing/CampusSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import UniversitiesSection from '../components/landing/NetworkingSection';
import CompaniesSection from '../components/landing/OpportunitiesSection';
import Footer from '../components/landing/Footer';

function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section style={{
      padding: '96px 24px',
      background: '#fdf2f8',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Gradiente decorativo */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(216,180,254,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{
          display: 'inline-block', padding: '5px 16px', borderRadius: 100,
          background: 'rgba(241,173,194,0.15)', border: '1px solid rgba(241,173,194,0.4)',
          fontSize: '0.78rem', fontWeight: 600, color: '#f1adc2',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20,
        }}>
          Únete hoy
        </span>

        <h2 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, color: '#3c2f41',
          letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 16,
          fontFamily: "'Syne', sans-serif",
        }}>
          Tu red universitaria empieza aquí
        </h2>
        <p style={{ color: '#786b7d', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Miles de estudiantes colombianos ya construyen su red académica en LinkUp. Gratis, seguro y diseñado para la universidad.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '14px 36px', borderRadius: 100,
              background: 'linear-gradient(135deg, #f1adc2 0%, #d8b4fe 100%)',
              border: 'none', color: '#3c2f41', fontWeight: 700, fontSize: '0.95rem',
              cursor: 'pointer', boxShadow: '0 4px 24px rgba(241,173,194,0.45)',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(241,173,194,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(241,173,194,0.45)'; }}
          >
            Crear cuenta gratis
          </button>
          <a
            href="mailto:hola@linkup.dev"
            style={{
              padding: '14px 32px', borderRadius: 100,
              background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(241,173,194,0.35)', color: '#5e4e63',
              fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none',
              transition: 'all 180ms ease',
              boxShadow: '0 2px 12px rgba(241,173,194,0.08)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f1adc2'; e.currentTarget.style.color = '#3c2f41'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.65)'; e.currentTarget.style.color = '#5e4e63'; }}
          >
            Solicitar demo
          </a>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#a09ab8', marginTop: 20 }}>
          Sin tarjeta de crédito · Acceso inmediato · Soporte en español
        </p>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflowX: 'hidden' }}>

      {/* Google Fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap"
      />

      {/* Sticky floating navbar */}
      <Navbar />

      {/* 01 — Hero con shader WebGL */}
      <div id="inicio" style={{ position: 'relative' }}>
        <Hero
          headline={{ line1: 'Conecta. Colabora.', line2: 'Crece.' }}
          subtitle="La red de networking universitario diseñada para Colombia. Encuentra personas, proyectos y oportunidades en tu comunidad académica."
          buttons={{
            primary:   { text: 'Crear cuenta gratis', onClick: () => navigate('/register') },
            secondary: { text: 'Explorar la plataforma', onClick: () => document.querySelector('#campus')?.scrollIntoView({ behavior: 'smooth' }) },
          }}
        />
        {/* Transición Hero → CampusSection */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, background: 'linear-gradient(180deg, transparent 0%, rgba(253,242,248,0.6) 55%, #fdf2f8 100%)', pointerEvents: 'none', zIndex: 5 }} />
      </div>

      {/* 02 — Campus Discovery (datos reales de la API) */}
      <CampusSection />

      {/* 03 — Cómo funciona */}
      <HowItWorksSection />

      {/* 04 — Para Universidades */}
      <UniversitiesSection />

      {/* 05 — Para Empresas */}
      <CompaniesSection />

      {/* 06 — CTA Final */}
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
