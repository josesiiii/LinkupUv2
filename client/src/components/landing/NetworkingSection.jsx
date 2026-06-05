// src/components/landing/NetworkingSection.jsx
import { useState } from 'react';

const STUDENTS = [
  {
    id: 1,
    name: 'Valentina Ríos',
    career: 'Ingeniería de Sistemas',
    campus: 'ITM Robledo',
    semester: '6to semestre',
    bio: 'Apasionada por el ML y el diseño. Busco equipo para hackathon.',
    interests: ['Python', 'ML', 'Figma', 'UI/UX'],
    goal: 'Proyectos',
    avatar: 'VR',
    color: '#f1adc2',
  },
  {
    id: 2,
    name: 'Santiago Morales',
    career: 'Ingeniería Electrónica',
    campus: 'UNAL Medellín',
    semester: '8vo semestre',
    bio: 'IoT + Arduino lover. Quiero construir soluciones reales para problemas reales.',
    interests: ['Arduino', 'IoT', 'C++', 'Linux'],
    goal: 'Investigación',
    avatar: 'SM',
    color: '#d8b4fe',
  },
  {
    id: 3,
    name: 'Isabela Cano',
    career: 'Diseño de Comunicación Visual',
    campus: 'EAFIT',
    semester: '4to semestre',
    bio: 'Diseñadora con ojo para los detalles. Me interesan los proyectos con impacto social.',
    interests: ['Figma', 'Branding', 'CSS', 'Motion'],
    goal: 'Emprendimiento',
    avatar: 'IC',
    color: '#f7c9d7',
  },
  {
    id: 4,
    name: 'Daniel Ospina',
    career: 'Ciencias de la Computación',
    campus: 'U. de Antioquia',
    semester: '7mo semestre',
    bio: 'Backend dev buscando co-fundador para startup EdTech.',
    interests: ['Node.js', 'Docker', 'AWS', 'MongoDB'],
    goal: 'Networking',
    avatar: 'DO',
    color: '#c4b5fd',
  },
];

const GOAL_COLORS = {
  'Proyectos':      { bg: 'rgba(241,173,194,0.15)', text: '#f1adc2' },
  'Investigación':  { bg: 'rgba(216,180,254,0.15)', text: '#d8b4fe' },
  'Emprendimiento': { bg: 'rgba(247,201,215,0.2)',  text: '#e892b0' },
  'Networking':     { bg: 'rgba(196,181,253,0.15)', text: '#c4b5fd' },
};

function StudentCard({ student, index }) {
  const [hovered, setHovered] = useState(false);
  const goalStyle = GOAL_COLORS[student.goal] || GOAL_COLORS['Networking'];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        border: hovered
          ? '1px solid rgba(241,173,194,0.5)'
          : '1px solid rgba(241,173,194,0.2)',
        borderRadius: 24,
        padding: 24,
        transition: 'all 280ms cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 40px rgba(241,173,194,0.25), 0 4px 12px rgba(60,47,65,0.06)'
          : '0 4px 16px rgba(241,173,194,0.1)',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Avatar + name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16, flexShrink: 0,
          background: `linear-gradient(135deg, ${student.color}60 0%, ${student.color}30 100%)`,
          border: `2px solid ${student.color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 700, color: '#3c2f41',
          letterSpacing: '0.02em',
        }}>
          {student.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#3c2f41', fontSize: '0.95rem', marginBottom: 2 }}>
            {student.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#786b7d' }}>{student.career}</div>
          <div style={{ fontSize: '0.78rem', color: '#786b7d', opacity: 0.8 }}>
            {student.campus} · {student.semester}
          </div>
        </div>
        <span style={{
          padding: '4px 10px',
          borderRadius: 100,
          fontSize: '0.72rem',
          fontWeight: 600,
          background: goalStyle.bg,
          color: goalStyle.text,
          flexShrink: 0,
        }}>
          {student.goal}
        </span>
      </div>

      {/* Bio */}
      <p style={{
        fontSize: '0.85rem',
        color: '#5e4e63',
        lineHeight: 1.6,
        marginBottom: 16,
      }}>
        {student.bio}
      </p>

      {/* Interests */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
        {student.interests.map(tag => (
          <span key={tag} style={{
            padding: '3px 10px',
            borderRadius: 100,
            fontSize: '0.72rem',
            fontWeight: 500,
            background: 'rgba(216,180,254,0.12)',
            border: '1px solid rgba(216,180,254,0.3)',
            color: '#786b7d',
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Action */}
      <button style={{
        width: '100%',
        padding: '10px',
        borderRadius: 12,
        background: hovered ? 'rgba(241,173,194,0.15)' : 'rgba(241,173,194,0.08)',
        border: `1px solid ${hovered ? 'rgba(241,173,194,0.4)' : 'rgba(241,173,194,0.2)'}`,
        color: '#3c2f41',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 180ms ease',
      }}>
        Conectar →
      </button>
    </div>
  );
}

export default function NetworkingSection() {
  return (
    <section
      id="networking"
      style={{
        minHeight: '100vh',
        padding: '100px 24px',
        background: '#fdf2f8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(216,180,254,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 16px',
            borderRadius: 100,
            background: 'rgba(216,180,254,0.15)',
            border: '1px solid rgba(216,180,254,0.4)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#d8b4fe',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            03 — Networking
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            color: '#3c2f41',
            letterSpacing: '-0.03em',
            marginBottom: 12,
            fontFamily: "'Syne', sans-serif",
            lineHeight: 1.1,
          }}>
            Conoce a quienes piensan como tú
          </h2>
          <p style={{ color: '#786b7d', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Perfiles reales de estudiantes con proyectos, metas y pasiones en común.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {STUDENTS.map((s, i) => (
            <StudentCard key={s.id} student={s} index={i} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button style={{
            padding: '14px 36px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(241,173,194,0.35)',
            borderRadius: 100,
            color: '#5e4e63',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            boxShadow: '0 2px 12px rgba(241,173,194,0.1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f1adc2';
            e.currentTarget.style.color = '#3c2f41';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(241,173,194,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.6)';
            e.currentTarget.style.color = '#5e4e63';
            e.currentTarget.style.boxShadow = '0 2px 12px rgba(241,173,194,0.1)';
          }}
          >
            Ver más perfiles
          </button>
        </div>
      </div>
    </section>
  );
}