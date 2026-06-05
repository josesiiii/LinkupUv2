// src/components/landing/OpportunitiesSection.jsx
import { useState } from 'react';

const ITEMS = [
  {
    id: 1,
    type: 'Hackathon',
    icon: '⚡',
    title: 'HackITM 2025',
    org: 'Instituto Tecnológico Metropolitano',
    desc: '48h para construir soluciones con impacto social. Equipos de 3-5 personas. Premios en efectivo y mentoría.',
    tags: ['Presencial', 'Medellín', 'Open'],
    deadline: '20 Jun',
    spots: '12 equipos',
    accent: '#f1adc2',
    featured: true,
  },
  {
    id: 2,
    type: 'Investigación',
    icon: '🔬',
    title: 'Grupo IA & Salud',
    org: 'Universidad de Antioquia',
    desc: 'Semillero de investigación en inteligencia artificial aplicada a diagnóstico médico. Publicaciones ISI.',
    tags: ['Remoto', 'Postgrado', 'Abierto'],
    deadline: 'Continuo',
    spots: '3 cupos',
    accent: '#d8b4fe',
    featured: false,
  },
  {
    id: 3,
    type: 'Emprendimiento',
    icon: '🚀',
    title: 'EduFlow Startup',
    org: 'Startup — Campus EAFIT',
    desc: 'Buscamos co-fundador técnico para plataforma de microaprendizaje. Pre-seed. Equity disponible.',
    tags: ['Híbrido', 'Equity', 'Series A'],
    deadline: 'Cerrado pronto',
    spots: '1 co-founder',
    accent: '#f7c9d7',
    featured: false,
  },
  {
    id: 4,
    type: 'Vacante',
    icon: '💼',
    title: 'Dev React Jr.',
    org: 'MiTienda.co · Medellín',
    desc: 'Posición part-time para estudiante de sistemas o afines. React, Tailwind, Node. Modalidad híbrida.',
    tags: ['Part-time', 'Pago', 'Híbrido'],
    deadline: '15 Jun',
    spots: '2 posiciones',
    accent: '#c4b5fd',
    featured: false,
  },
  {
    id: 5,
    type: 'Proyecto',
    icon: '🌱',
    title: 'MapUrbe',
    org: 'Proyecto independiente',
    desc: 'App de mapeo ciudadano colaborativo. Stack: React Native + Firebase. Buscamos diseñador y backend.',
    tags: ['Remoto', 'Open source', 'Voluntario'],
    deadline: 'Abierto',
    spots: '2 roles',
    accent: '#f1adc2',
    featured: false,
  },
  {
    id: 6,
    type: 'Investigación',
    icon: '🤖',
    title: 'NLP para Lenguas Nativas',
    org: 'UNAL Bogotá',
    desc: 'Proyecto de procesamiento de lenguaje natural para lenguas indígenas colombianas. Convocatoria Colciencias.',
    tags: ['Presencial', 'Financiado', 'Bogotá'],
    deadline: '30 Jun',
    spots: '4 estudiantes',
    accent: '#d8b4fe',
    featured: false,
  },
];

const TYPE_COLORS = {
  'Hackathon':     { bg: 'rgba(241,173,194,0.12)', text: '#f1adc2' },
  'Investigación': { bg: 'rgba(216,180,254,0.12)', text: '#d8b4fe' },
  'Emprendimiento':{ bg: 'rgba(247,201,215,0.15)', text: '#e892b0' },
  'Vacante':       { bg: 'rgba(196,181,253,0.12)', text: '#c4b5fd' },
  'Proyecto':      { bg: 'rgba(241,173,194,0.12)', text: '#f1adc2' },
};

function OpportunityCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const typeStyle = TYPE_COLORS[item.type] || TYPE_COLORS['Proyecto'];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(20px)',
        border: hovered
          ? `1px solid ${item.accent}60`
          : '1px solid rgba(241,173,194,0.2)',
        borderRadius: 24,
        padding: '24px 24px 20px',
        transition: 'all 280ms cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 16px 40px ${item.accent}30, 0 4px 12px rgba(60,47,65,0.05)`
          : '0 4px 16px rgba(241,173,194,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {item.featured && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          padding: '3px 10px', borderRadius: 100,
          background: 'linear-gradient(135deg, #f1adc2, #d8b4fe)',
          fontSize: '0.68rem', fontWeight: 700, color: '#3c2f41',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          Destacado
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14, flexShrink: 0,
          background: `${item.accent}20`,
          border: `1px solid ${item.accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem',
        }}>
          {item.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingRight: item.featured ? 64 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: 600,
              background: typeStyle.bg, color: typeStyle.text,
              padding: '2px 8px', borderRadius: 100,
            }}>
              {item.type}
            </span>
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3c2f41', lineHeight: 1.3 }}>
            {item.title}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#786b7d', marginTop: 1 }}>{item.org}</div>
        </div>
      </div>

      <p style={{ fontSize: '0.83rem', color: '#5e4e63', lineHeight: 1.65, margin: 0 }}>
        {item.desc}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {item.tags.map(t => (
          <span key={t} style={{
            padding: '3px 9px', borderRadius: 100,
            fontSize: '0.7rem', fontWeight: 500,
            background: 'rgba(253,228,236,0.5)',
            border: '1px solid rgba(241,173,194,0.25)',
            color: '#786b7d',
          }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 12,
        borderTop: '1px solid rgba(241,173,194,0.15)',
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#786b7d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cierre</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3c2f41' }}>{item.deadline}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', color: '#786b7d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cupos</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3c2f41' }}>{item.spots}</div>
          </div>
        </div>
        <button style={{
          padding: '8px 18px',
          borderRadius: 100,
          background: hovered ? item.accent : `${item.accent}18`,
          border: `1px solid ${item.accent}40`,
          color: hovered ? '#3c2f41' : '#5e4e63',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 180ms ease',
          boxShadow: hovered ? `0 4px 14px ${item.accent}50` : 'none',
        }}>
          Ver más
        </button>
      </div>
    </div>
  );
}

export default function OpportunitiesSection() {
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Hackathon', 'Investigación', 'Emprendimiento', 'Vacante', 'Proyecto'];

  const filtered = filter === 'Todos' ? ITEMS : ITEMS.filter(i => i.type === filter);

  return (
    <section
      id="oportunidades"
      style={{
        minHeight: '100vh',
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #fdf2f8 0%, #fde4ec 40%, #fdf2f8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', bottom: '5%', right: '-5%',
        width: 450, height: 450,
        background: 'radial-gradient(circle, rgba(196,181,253,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 16px', borderRadius: 100,
            background: 'rgba(196,181,253,0.15)',
            border: '1px solid rgba(196,181,253,0.4)',
            fontSize: '0.78rem', fontWeight: 600,
            color: '#c4b5fd', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>
            04 — Oportunidades
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800, color: '#3c2f41',
            letterSpacing: '-0.03em', marginBottom: 12,
            fontFamily: "'Syne', sans-serif", lineHeight: 1.1,
          }}>
            Tu próximo gran proyecto te espera
          </h2>
          <p style={{ color: '#786b7d', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Hackathons, investigación, emprendimientos y vacantes estudiantiles en un solo lugar.
          </p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 18px', borderRadius: 100,
                fontSize: '0.83rem', fontWeight: 500,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 180ms ease',
                background: filter === f ? '#f1adc2' : 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(12px)',
                borderColor: filter === f ? '#f1adc2' : 'rgba(241,173,194,0.3)',
                color: filter === f ? '#3c2f41' : '#786b7d',
                boxShadow: filter === f ? '0 2px 10px rgba(241,173,194,0.4)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {filtered.map(item => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}