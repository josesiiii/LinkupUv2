// src/pages/LandingPage.jsx
import { useNavigate } from 'react-router-dom';
import Hero from '../components/ui/animated-shader-hero';
import Navbar from '../components/landing/Navbar';
import CampusSection from '../components/landing/CampusSection';
import NetworkingSection from '../components/landing/NetworkingSection';
import OpportunitiesSection from '../components/landing/OpportunitiesSection';
import Footer from '../components/landing/Footer';

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

      {/* Section 1 — Hero with WebGL shader */}
      <div style={{ position: 'relative' }}>
        <Hero
          headline={{
            line1: 'Conecta. Colabora.',
            line2: 'Crece.',
          }}
          subtitle="Encuentra personas, proyectos y oportunidades dentro de tu comunidad universitaria."
          buttons={{
            primary: {
              text: 'Crear cuenta gratis',
              onClick: () => navigate('/register'),
            },
            secondary: {
              text: 'Explorar la plataforma',
              onClick: () => {
                document.querySelector('#campus')?.scrollIntoView({ behavior: 'smooth' });
              },
            },
          }}
        />
        {/* Transición premium Hero → CampusSection */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 180,
          background: 'linear-gradient(180deg, transparent 0%, rgba(253,242,248,0.6) 55%, #fdf2f8 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }} />
      </div>

      {/* Section 2 — Campus Discovery */}
      <CampusSection />

      {/* Section 3 — Networking cards */}
      <NetworkingSection />

      {/* Section 4 — Projects & Opportunities */}
      <OpportunitiesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}