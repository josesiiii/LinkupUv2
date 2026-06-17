// src/components/landing/CampusSection.jsx
import { useState, useEffect } from 'react';

const CAMPUSES = [
  { id: 'itm-bello',     label: 'Campus Bello',         institution: 'Instituto Tecnológico Metropolitano', city: 'Medellín, Colombia',  emoji: '🏛️' },
  { id: 'itm-robledo',   label: 'Campus Robledo',       institution: 'Instituto Tecnológico Metropolitano', city: 'Medellín, Colombia',  emoji: '⚗️' },
  { id: 'unal-medellin', label: 'Sede Medellín',        institution: 'Universidad Nacional de Colombia',    city: 'Medellín, Colombia',  emoji: '🎓' },
  { id: 'unal-bogota',   label: 'Sede Bogotá',          institution: 'Universidad Nacional de Colombia',    city: 'Bogotá, Colombia',    emoji: '🏙️' },
  { id: 'udea',          label: 'Ciudad Universitaria', institution: 'Universidad de Antioquia',            city: 'Medellín, Colombia',  emoji: '🌿' },
  { id: 'eafit',         label: 'Campus EAFIT',         institution: 'Universidad EAFIT',                   city: 'Medellín, Colombia',  emoji: '💡' },
  { id: 'javeriana',     label: 'Sede Central',         institution: 'Pontificia Universidad Javeriana',    city: 'Bogotá, Colombia',    emoji: '⚖️' },
  { id: 'los-andes',     label: 'Campus Norte',         institution: 'Universidad de los Andes',            city: 'Bogotá, Colombia',    emoji: '🔬' },
];

export default function CampusSection() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const choose = (c) => {
    setSelected(c);
    setOpen(false);
  };

  return (
    <section
      id="campus"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #fdf2f8 0%, #fde4ec 50%, #fdf2f8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: 400, height: 400, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        background: 'radial-gradient(circle, rgba(216,180,254,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: 350, height: 350, borderRadius: '40% 60% 70% 30% / 30% 60% 40% 70%',
        background: 'radial-gradient(circle, rgba(241,173,194,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{ maxWidth: 620, width: '100%', zIndex: 1 }}>
        {/* Label */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 16px',
            borderRadius: 100,
            background: 'rgba(241,173,194,0.2)',
            border: '1px solid rgba(241,173,194,0.4)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#f1adc2',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            02 — Campus
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          color: '#3c2f41',
          textAlign: 'center',
          letterSpacing: '-0.03em',
          marginBottom: 12,
          fontFamily: "'Syne', sans-serif",
          lineHeight: 1.1,
        }}>
          Encuentra tu comunidad
        </h2>
        <p style={{
          color: '#786b7d',
          textAlign: 'center',
          fontSize: '1.05rem',
          marginBottom: stats ? 24 : 48,
          lineHeight: 1.7,
        }}>
          Selecciona tu campus y conecta con estudiantes que comparten tu espacio, tu institución y tus objetivos.
        </p>

        {/* Stats reales de la plataforma */}
        {stats && (
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 32,
            marginBottom: 40, flexWrap: 'wrap',
          }}>
            {[
              { value: stats.usuarios,      label: 'usuarios activos' },
              { value: stats.instituciones, label: 'universidades' },
              { value: stats.conexiones,    label: 'conexiones' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#f1adc2', letterSpacing: '-0.03em', fontFamily: "'Syne', sans-serif" }}>
                  {value.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#786b7d', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(20px)',
              border: open
                ? '1px solid rgba(241,173,194,0.7)'
                : '1px solid rgba(241,173,194,0.3)',
              borderRadius: open ? '20px 20px 0 0' : 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 250ms ease',
              boxShadow: open
                ? '0 4px 20px rgba(241,173,194,0.2)'
                : '0 2px 12px rgba(241,173,194,0.1)',
            }}
          >
            {selected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                <span style={{ fontSize: 28 }}>{selected.emoji}</span>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#3c2f41' }}>{selected.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#786b7d' }}>{selected.institution} · {selected.city}</div>
                </div>
              </div>
            ) : (
              <span style={{ color: '#786b7d', fontSize: '0.95rem' }}>
                Elige tu campus…
              </span>
            )}
            <svg
              width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#786b7d" strokeWidth="2" strokeLinecap="round"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 250ms ease', flexShrink: 0 }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {open && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0, right: 0,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(241,173,194,0.4)',
              borderTop: 'none',
              borderRadius: '0 0 20px 20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(60,47,65,0.12)',
              zIndex: 50,
              maxHeight: 360,
              overflowY: 'auto',
            }}>
              {CAMPUSES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => choose(c)}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: hovered === c.id ? 'rgba(241,173,194,0.1)' : 'transparent',
                    border: 'none',
                    borderBottom: i < CAMPUSES.length - 1 ? '1px solid rgba(241,173,194,0.12)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{c.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#3c2f41' }}>{c.label}</div>
                    <div style={{ fontSize: '0.78rem', color: '#786b7d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.institution}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: '#786b7d' }}>{c.city}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA after selection */}
        {selected && (
          <div style={{
            marginTop: 24,
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(216,180,254,0.3)',
            borderRadius: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            animation: 'lu-slide-in 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#786b7d', margin: 0 }}>Explorando</p>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#3c2f41', margin: '2px 0 0' }}>
                {selected.label} · {selected.institution}
              </p>
            </div>
            <button
              style={{
                padding: '10px 22px',
                background: '#f1adc2',
                border: 'none',
                borderRadius: 100,
                color: '#3c2f41',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(241,173,194,0.45)',
                flexShrink: 0,
              }}
            >
              Explorar campus →
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes lu-slide-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}