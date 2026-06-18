// Para Empresas — reemplaza la sección de oportunidades hardcodeada
import { useState } from 'react';

const VALUE_PROPS = [
  {
    icon: '🔍',
    title: 'Talent Discovery',
    desc: 'Filtra perfiles por carrera, habilidades, semestre e institución. Accede a talento universitario activo antes de que egrese.',
    accent: '#f1adc2',
  },
  {
    icon: '📢',
    title: 'Employer Branding',
    desc: 'Hazte visible dentro de la comunidad universitaria colombiana. Tu marca empleadora presente donde está el talento.',
    accent: '#d8b4fe',
  },
  {
    icon: '📈',
    title: 'Pipeline de talento',
    desc: 'Construye relaciones con futuros profesionales desde hoy. Identifica, conecta y mantén contacto con perfiles de alto potencial.',
    accent: '#c4b5fd',
  },
];

const METRICS = [
  { value: '35%', label: 'de los estudiantes buscan prácticas o empleo mientras estudian' },
  { value: '72%', label: 'de los profesionales valoran más el networking que el currículum en sus primeros empleos' },
  { value: '4x', label: 'mayor tasa de retención en empresas que contrataron con networking universitario' },
];

const HOW_ITEMS = [
  { step: '01', title: 'Crea tu perfil empresarial', desc: 'Presenta tu empresa, cultura y oportunidades disponibles.' },
  { step: '02', title: 'Define tu perfil de talento', desc: 'Filtra por universidad, carrera, semestre e intereses específicos.' },
  { step: '03', title: 'Conecta directamente', desc: 'Inicia conversaciones con candidatos calificados sin intermediarios.' },
];

function ValueCard({ item, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        border: hov ? `1px solid ${item.accent}60` : '1px solid rgba(241,173,194,0.2)',
        borderRadius: 20,
        padding: 28,
        transition: 'all 260ms cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hov ? `0 12px 32px ${item.accent}22` : '0 2px 12px rgba(60,47,65,0.04)',
      }}
    >
      <div style={{ fontSize: '1.8rem', marginBottom: 16 }}>{item.icon}</div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3c2f41', marginBottom: 8 }}>{item.title}</h3>
      <p style={{ fontSize: '0.85rem', color: '#786b7d', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
    </div>
  );
}

export default function CompaniesSection() {
  return (
    <section
      id="empresas"
      style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #fdf2f8 0%, #fde4ec 50%, #fdf2f8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(196,181,253,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 100,
            background: 'rgba(196,181,253,0.15)', border: '1px solid rgba(196,181,253,0.4)',
            fontSize: '0.78rem', fontWeight: 600, color: '#c4b5fd',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            Para Empresas
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#3c2f41',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16,
            fontFamily: "'Syne', sans-serif",
          }}>
            Accede al talento universitario colombiano
          </h2>
          <p style={{ color: '#786b7d', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Conecta tu empresa con estudiantes y recién graduados de las principales universidades del país. Sin intermediarios, sin ruido.
          </p>
        </div>

        {/* Value props */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 72 }}>
          {VALUE_PROPS.map((item, i) => <ValueCard key={i} item={item} index={i} />)}
        </div>

        {/* Métricas */}
        <div style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(241,173,194,0.2)',
          borderRadius: 24,
          padding: '40px 48px',
          marginBottom: 72,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 32,
        }}>
          {METRICS.map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#f1adc2', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em', marginBottom: 8 }}>
                {m.value}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#786b7d', lineHeight: 1.6, margin: 0 }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Cómo funciona para empresas */}
        <div style={{ marginBottom: 60 }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3c2f41', textAlign: 'center', marginBottom: 40, fontFamily: "'Syne', sans-serif" }}>
            Así de simple
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {HOW_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(241,173,194,0.15)', border: '1px solid rgba(241,173,194,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 800, color: '#f1adc2', letterSpacing: '0.04em',
                }}>
                  {item.step}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3c2f41', marginBottom: 4 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.83rem', color: '#786b7d', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="mailto:empresas@linkup.dev"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 36px', borderRadius: 100,
              background: 'linear-gradient(135deg, #c4b5fd 0%, #f1adc2 100%)',
              color: '#3c2f41', fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(196,181,253,0.4)',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(196,181,253,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(196,181,253,0.4)'; }}
          >
            Hablar con el equipo →
          </a>
          <p style={{ fontSize: '0.8rem', color: '#786b7d', marginTop: 12 }}>
            Respondemos en menos de 24 horas
          </p>
        </div>
      </div>
    </section>
  );
}
