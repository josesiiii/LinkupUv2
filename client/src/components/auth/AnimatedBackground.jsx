// src/components/auth/AnimatedBackground.jsx
import { useEffect, useRef } from "react";

const PARTICLES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  size:  Math.floor(Math.random() * 9) + 6,           // 6-14px
  left:  Math.floor(Math.random() * 90) + 5,          // 5-95%
  top:   Math.floor(Math.random() * 90) + 5,          // 5-95%
  duration: (Math.random() * 4 + 4).toFixed(1),       // 4-8s
  delay:    (Math.random() * 3).toFixed(1),            // 0-3s
  color: ["#4F8EF7", "#7C5EF0", "#F0F2F7"][i % 3],
  opacity: (Math.random() * 0.3 + 0.15).toFixed(2),   // 0.15-0.45
}));

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Posiciones animadas de las partículas para el canvas
    const positions = PARTICLES.map(p => ({
      x: (p.left / 100) * window.innerWidth,
      y: (p.top  / 100) * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    const draw = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar posiciones
      positions.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      // Dibujar líneas entre partículas cercanas
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx   = positions[i].x - positions[j].x;
          const dy   = positions[i].y - positions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79, 142, 247, ${opacity})`;
            ctx.lineWidth   = 1;
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>

      {/* Fondo base con gradiente radial */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, #0D1628 0%, #0A0C10 100%)"
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Blob 1 */}
      <div
        className="absolute animate-blob"
        style={{
          width:  700,
          height: 700,
          top:    "-15%",
          left:   "-10%",
          background: "#4F8EF715",
          borderRadius: "50%",
          filter: "blur(600px)",
        }}
      />

      {/* Blob 2 */}
      <div
        className="absolute animate-blob-delay"
        style={{
          width:  600,
          height: 600,
          bottom: "-10%",
          right:  "-5%",
          background: "#7C5EF010",
          borderRadius: "50%",
          filter: "blur(500px)",
        }}
      />

      {/* Canvas de líneas de conexión */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />

      {/* Partículas flotantes */}
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width:     p.size,
            height:    p.size,
            left:      `${p.left}%`,
            top:       `${p.top}%`,
            background: p.color,
            opacity:   p.opacity,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

    </div>
  );
}
