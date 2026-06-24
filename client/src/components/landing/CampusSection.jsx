import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CAMPUSES = [
  { id: 'itm-bello',   abbr: 'ITM',  fullName: 'Instituto Tecnológico Metropolitano', campus: 'Campus Bello',         city: 'Medellín', accent: '#f1adc2', emoji: '🏛️' },
  { id: 'itm-robledo', abbr: 'ITM',  fullName: 'Instituto Tecnológico Metropolitano', campus: 'Campus Robledo',       city: 'Medellín', accent: '#f7c9d7', emoji: '⚗️' },
  { id: 'udea',        abbr: 'UdeA', fullName: 'Universidad de Antioquia',            campus: 'Ciudad Universitaria', city: 'Medellín', accent: '#6ee7b7', emoji: '🌿' },
  { id: 'sena',        abbr: 'SENA', fullName: 'Servicio Nacional de Aprendizaje',   campus: 'Regional Antioquia',   city: 'Medellín', accent: '#86efac', emoji: '🛠️' },
];

const TICKER_NAMES = [
  'Instituto Tecnológico Metropolitano',
  'Universidad de Antioquia',
  'Servicio Nacional de Aprendizaje',
];

function useCountUp(target, active, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    const start = performance.now();
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, active, duration]);
  return val;
}

export default function CampusSection() {
  const [stats, setStats] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const countUsuarios     = useCountUp(stats?.usuarios,      visible);
  const countInstituciones = useCountUp(stats?.instituciones, visible);
  const countConexiones   = useCountUp(stats?.conexiones,    visible);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/stats`)
      .then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="campus"
      ref={sectionRef}
      style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #fdf2f8 0%, #fde4ec 55%, #fdf2f8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Blobs decorativos */}
      <div style={{ position: 'absolute', top: '6%', right: '-4%', width: 420, height: 420, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', background: 'radial-gradient(circle, rgba(216,180,254,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '6%', left: '-4%', width: 360, height: 360, borderRadius: '40% 60% 70% 30% / 30% 60% 40% 70%', background: 'radial-gradient(circle, rgba(241,173,194,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1060, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Encabezado ── */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 100,
            background: 'rgba(241,173,194,0.2)', border: '1px solid rgba(241,173,194,0.4)',
            fontSize: '0.78rem', fontWeight: 600, color: '#f1adc2',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18,
          }}>
            02 — Campus
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#3c2f41',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 14,
            fontFamily: "'Syne', sans-serif",
          }}>
            Tu comunidad ya está en LinkUp
          </h2>
          <p style={{ color: '#786b7d', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Conecta con estudiantes de las principales universidades de Colombia. Elige tu campus y empieza ahora.
          </p>
        </div>

        {/* ── Stats animados ── */}
        {stats && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 52, flexWrap: 'wrap' }}>
            {[
              { value: countUsuarios,      label: 'estudiantes activos', icon: '👥' },
              { value: countInstituciones, label: 'universidades',        icon: '🏫' },
              { value: countConexiones,    label: 'conexiones formadas',  icon: '🤝' },
            ].map(({ value, label, icon }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(241,173,194,0.25)',
                borderRadius: 20,
                padding: '20px 32px',
                textAlign: 'center',
                minWidth: 155,
                boxShadow: '0 4px 20px rgba(60,47,65,0.05)',
              }}>
                <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>{icon}</div>
                <div style={{
                  fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', fontWeight: 800, color: '#3c2f41',
                  letterSpacing: '-0.04em', fontFamily: "'Syne', sans-serif", lineHeight: 1,
                }}>
                  {value.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#786b7d', fontWeight: 500, marginTop: 5 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Ticker infinito ── */}
        <div style={{
          overflow: 'hidden', marginBottom: 52,
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
          maskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}>
          <div className="lu-ticker-track">
            {[...TICKER_NAMES, ...TICKER_NAMES, ...TICKER_NAMES].map((name, i) => (
              <span key={i} className="lu-ticker-item">
                <span className="lu-ticker-dot" style={{ background: i % 3 === 0 ? '#f1adc2' : i % 3 === 1 ? '#d8b4fe' : '#7dd3fc' }} />
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Grid de campus ── */}
        <div className="lu-campus-grid" style={{ marginBottom: 20 }}>
          {CAMPUSES.map(c => {
            const isSel = selected?.id === c.id;
            const isHov = hovered === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(isSel ? null : c)}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isSel
                    ? `${c.accent}22`
                    : isHov ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.68)',
                  backdropFilter: 'blur(16px)',
                  border: isSel
                    ? `1.5px solid ${c.accent}`
                    : `1px solid rgba(241,173,194,${isHov ? '0.45' : '0.2'})`,
                  borderRadius: 20,
                  padding: '20px 18px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 220ms cubic-bezier(0.16,1,0.3,1)',
                  transform: isHov && !isSel ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isSel
                    ? `0 0 0 3px ${c.accent}35, 0 8px 28px rgba(60,47,65,0.1)`
                    : isHov ? '0 8px 28px rgba(60,47,65,0.09)' : '0 2px 8px rgba(60,47,65,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: `${c.accent}22`,
                  border: `1px solid ${c.accent}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.35rem',
                }}>
                  {c.emoji}
                </div>

                <div>
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 700, color: c.accent,
                    letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3,
                  }}>
                    {c.abbr}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#3c2f41', lineHeight: 1.3 }}>
                    {c.campus}
                  </div>
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 9px', borderRadius: 100,
                  background: 'rgba(120,107,125,0.08)',
                  width: 'fit-content',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.accent, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.72rem', color: '#786b7d', fontWeight: 500 }}>{c.city}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Panel seleccionado ── */}
        {selected && (
          <div
            key={selected.id}
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${selected.accent}50`,
              borderRadius: 20,
              padding: '22px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              marginBottom: 28,
              animation: 'lu-slide-in 0.28s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: `0 8px 32px ${selected.accent}22`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: `${selected.accent}22`,
                border: `1.5px solid ${selected.accent}70`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem',
              }}>
                {selected.emoji}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: selected.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                  Campus seleccionado
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#3c2f41', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selected.campus}
                </div>
                <div style={{ fontSize: '0.83rem', color: '#786b7d' }}>
                  {selected.fullName} · {selected.city}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '12px 26px', borderRadius: 100, flexShrink: 0,
                background: `linear-gradient(135deg, ${selected.accent} 0%, ${selected.accent}cc 100%)`,
                border: 'none', color: '#3c2f41',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                boxShadow: `0 4px 20px ${selected.accent}55`,
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${selected.accent}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${selected.accent}55`; }}
            >
              Unirme a este campus →
            </button>
          </div>
        )}

        {/* ── CTA secundario ── */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/registrar-universidad')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.88rem', color: '#786b7d', fontWeight: 500,
              transition: 'color 150ms', fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#3c2f41'}
            onMouseLeave={e => e.currentTarget.style.color = '#786b7d'}
          >
            ¿Tu universidad no aparece?{' '}
            <span style={{ color: '#f1adc2', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Regístrala aquí →
            </span>
          </button>
        </div>
      </div>

      <style>{`
        .lu-ticker-track {
          display: flex;
          width: max-content;
          animation: lu-ticker 32s linear infinite;
        }
        .lu-ticker-track:hover { animation-play-state: paused; }
        .lu-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0 28px;
          white-space: nowrap;
          font-size: 0.88rem;
          font-weight: 600;
          color: #786b7d;
          letter-spacing: 0.01em;
        }
        .lu-ticker-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        @keyframes lu-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .lu-campus-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @keyframes lu-slide-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .lu-campus-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .lu-campus-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
        }
      `}</style>
    </section>
  );
}
