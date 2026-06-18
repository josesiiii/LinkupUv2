const STEPS = [
  {
    number: '01',
    icon: '✏️',
    title: 'Completa tu perfil',
    desc: 'Agrega tu carrera, intereses académicos y objetivos. Cuanto más detallado, mejores conexiones.',
    accent: '#f1adc2',
  },
  {
    number: '02',
    icon: '✨',
    title: 'Descubre compatibles',
    desc: 'Nuestro algoritmo calcula afinidad en base a intereses, facultad, objetivos y conexiones mutuas. Sin ruido.',
    accent: '#d8b4fe',
  },
  {
    number: '03',
    icon: '💬',
    title: 'Conecta y colabora',
    desc: 'Envía solicitudes, chatea en tiempo real, forma equipos y construye tu red universitaria.',
    accent: '#c4b5fd',
  },
];

export default function HowItWorksSection() {
  return (
    <section
      style={{
        padding: '88px 24px',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(241,173,194,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 100,
            background: 'rgba(241,173,194,0.12)', border: '1px solid rgba(241,173,194,0.4)',
            fontSize: '0.78rem', fontWeight: 600, color: '#f1adc2',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14,
          }}>
            Cómo funciona
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: '#3c2f41',
            letterSpacing: '-0.03em', lineHeight: 1.1,
            fontFamily: "'Syne', sans-serif",
          }}>
            Simple para todos
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 0, position: 'relative' }}>
          {/* Línea conectora (solo desktop) */}
          <div style={{
            position: 'absolute', top: 28, left: '16.5%', right: '16.5%', height: 1,
            background: 'linear-gradient(90deg, #f1adc2, #d8b4fe, #c4b5fd)',
            opacity: 0.35, pointerEvents: 'none',
          }} />

          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px' }}>
              {/* Ícono */}
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: `${step.accent}20`, border: `1.5px solid ${step.accent}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', marginBottom: 20, position: 'relative', zIndex: 1,
                backdropFilter: 'blur(4px)',
              }}>
                {step.icon}
              </div>
              <div style={{
                fontSize: '0.7rem', fontWeight: 800, color: step.accent,
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                {step.number}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#3c2f41', marginBottom: 10, letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#786b7d', lineHeight: 1.65, maxWidth: 240, margin: '0 auto' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
