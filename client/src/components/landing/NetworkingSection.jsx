// Para Universidades — reemplaza la sección de networking hardcodeada
import { useState } from 'react';

const FEATURES = [
  {
    icon: '🎓',
    title: 'Red estudiantil viva',
    desc: 'Conecta a toda tu comunidad en un espacio digital propio. Cada estudiante es un nodo activo en la red de tu institución.',
    accent: '#f1adc2',
  },
  {
    icon: '📊',
    title: 'Analítica en tiempo real',
    desc: 'Métricas de actividad, conexiones, intereses y engagement estudiantil disponibles para tu equipo institucional.',
    accent: '#d8b4fe',
  },
  {
    icon: '🤝',
    title: 'Colaboración interdisciplinaria',
    desc: 'El algoritmo conecta estudiantes de distintas carreras y semestres con intereses comunes. Grupos de estudio y proyectos emergen naturalmente.',
    accent: '#f7c9d7',
  },
  {
    icon: '🔒',
    title: 'Control institucional',
    desc: 'Panel administrativo con supervisión completa. Gestión de usuarios, moderación y configuración de la plataforma para tu campus.',
    accent: '#c4b5fd',
  },
];

const CHECKS = [
  'Perfiles verificados por dominio de correo institucional',
  'Compatibilidad basada en carrera, intereses y objetivos',
  'Chat privado entre estudiantes con historial permanente',
  'Historias y actividad efímera para mantener el engagement',
  'Sistema de conexiones con tasa de aceptación medible',
];

function FeatureCard({ f, index }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        border: hov ? `1px solid ${f.accent}70` : '1px solid rgba(241,173,194,0.2)',
        borderRadius: 20,
        padding: 24,
        transition: 'all 260ms cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hov ? `0 12px 32px ${f.accent}25` : '0 2px 12px rgba(60,47,65,0.05)',
        animationDelay: `${index * 0.08}s`,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${f.accent}20`, border: `1px solid ${f.accent}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem', marginBottom: 16,
      }}>
        {f.icon}
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3c2f41', marginBottom: 8, letterSpacing: '-0.01em' }}>
        {f.title}
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#786b7d', lineHeight: 1.65, margin: 0 }}>
        {f.desc}
      </p>
    </div>
  );
}

export default function UniversitiesSection() {
  return (
    <section
      id="networking"
      style={{
        padding: '100px 24px',
        background: '#fdf2f8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorativo */}
      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(216,180,254,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        {/* Encabezado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', marginBottom: 64 }}>
          <div>
            <span style={{
              display: 'inline-block', padding: '5px 16px', borderRadius: 100,
              background: 'rgba(216,180,254,0.15)', border: '1px solid rgba(216,180,254,0.4)',
              fontSize: '0.78rem', fontWeight: 600, color: '#d8b4fe',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              Para Universidades
            </span>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#3c2f41',
              letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16,
              fontFamily: "'Syne', sans-serif",
            }}>
              Diseñado para instituciones educativas
            </h2>
            <p style={{ color: '#786b7d', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 28 }}>
              Dale a tus estudiantes una plataforma de networking que potencia su comunidad, fomenta la colaboración y genera datos de valor institucional.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {CHECKS.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(241,173,194,0.2)', border: '1px solid rgba(241,173,194,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#f1adc2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#5e4e63', lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
            <a
              href="mailto:hola@linkup.dev"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 100,
                background: 'linear-gradient(135deg, #f1adc2 0%, #d8b4fe 100%)',
                color: '#3c2f41', fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(241,173,194,0.4)',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(241,173,194,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(241,173,194,0.4)'; }}
            >
              Registrar mi universidad →
            </a>
          </div>

          {/* Cards de features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} f={f} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
