// src/components/ui/animated-shader-hero.jsx
import { useRef, useEffect } from 'react';
 
const defaultShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
 
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
 
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
 
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) { t+=a*noise(p); p*=2.*m; a*=.5; }
  return t;
}
 
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a); d=a; p*=2./(i+1.);
  }
  return t;
}
 
void main(void) {
  vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2,1);
  vec3 col=vec3(0);
 
  // Warm pastel base: pink, lavender, white
  vec3 pink    = vec3(0.945, 0.678, 0.761);  // #f1adc2
  vec3 lavender= vec3(0.847, 0.706, 0.996);  // #d8b4fe
  vec3 lilac   = vec3(0.769, 0.710, 0.992);  // #c4b5fd
  vec3 white   = vec3(0.992, 0.949, 0.973);  // #fdf2f8
  vec3 blush   = vec3(0.988, 0.894, 0.925);  // #fde4ec
 
  float bg = clouds(vec2(st.x+T*.3, -st.y));
 
  uv *= 1. - .2*(sin(T*.15)*.5+.5);
 
  for (float i=1.; i<10.; i++) {
    uv += .08*cos(i*vec2(.12+.008*i, .7)+i*i+T*.35+.08*uv.x);
    vec2 p = uv;
    float d = length(p);
 
    // Pink core glow
    col += .0015/d * (pink * (cos(sin(i*1.3)*vec3(.8,1.2,1.6))+1.));
 
    float b = noise(i+p+bg*1.5);
 
    // Lavender ribbons
    col += .0018*b/length(max(p, vec2(b*p.x*.015, p.y))) * lavender;
 
    // White sparkles at center
    col += .0005/(d*d+.01) * white * smoothstep(.8,1.,b);
 
    // Mix background: soft pink-lilac fog
    vec3 fogColor = mix(blush, lavender, bg*.6);
    col = mix(col, fogColor*(bg*.35+.08), d*.4);
  }
 
  // Subtle lavender vignette
  col = mix(col, lilac*.18, smoothstep(.3,1.2,length(uv*.6)));
 
  // Gentle brightness boost for pastel feel
  col = pow(max(col,vec3(0)), vec3(.75));
  col = mix(col, white, .08);
 
  O = vec4(col, 1);
}`;
 
const shaderStyles = `
  @keyframes linkup-fade-down {
    from { opacity: 0; transform: translateY(-18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes linkup-fade-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lu-fade-down { animation: linkup-fade-down 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
  .lu-fade-up   { animation: linkup-fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
  .lu-d1 { animation-delay: 0.15s; }
  .lu-d2 { animation-delay: 0.3s; }
  .lu-d3 { animation-delay: 0.45s; }
  .lu-d4 { animation-delay: 0.6s; }
`;
 
function useShaderBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef();
 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
 
    const gl = canvas.getContext('webgl2');
    if (!gl) return;
 
    const vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){ gl_Position = position; }`;
 
    function compile(shader, source) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
      }
    }
 
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    compile(vs, vertexSrc);
    compile(fs, defaultShaderSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
 
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
 
    const uRes   = gl.getUniformLocation(program, 'resolution');
    const uTime  = gl.getUniformLocation(program, 'time');
    const uTouch = gl.getUniformLocation(program, 'touch');
 
    let mouse = [0, 0];
    canvas.addEventListener('pointermove', e => {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      mouse = [e.clientX * dpr, canvas.height - e.clientY * dpr];
    });
 
    function resize() {
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
      canvas.width  = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
 
    function loop(now) {
      gl.clearColor(0.992, 0.894, 0.925, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.uniform2f(uTouch, ...mouse);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(loop);
    }
 
    resize();
    loop(0);
    window.addEventListener('resize', resize);
 
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);
 
  return canvasRef;
}
 
export default function Hero({ trustBadge, headline, subtitle, buttons, className = "" }) {
  const canvasRef = useShaderBackground();
 
  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`} style={{ background: '#fdf2f8' }}>
      <style>{shaderStyles}</style>
 
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none"
      />
 
      {/* Soft white vignette overlay for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(253,242,248,0.35) 100%)',
        }}
      />
 
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        {trustBadge && (
          <div className="mb-8 lu-fade-down">
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm"
              style={{
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(241,173,194,0.4)',
                color: '#5e4e63',
                boxShadow: '0 2px 12px rgba(241,173,194,0.2)',
              }}
            >
              {trustBadge.icons?.map((icon, i) => <span key={i}>{icon}</span>)}
              <span>{trustBadge.text}</span>
            </div>
          </div>
        )}
 
        <div className="text-center max-w-4xl mx-auto px-6">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1
              className="lu-fade-up lu-d1"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#3c2f41',
                fontFamily: "'Syne', 'Georgia', serif",
              }}
            >
              {headline.line1}
            </h1>
            <h1
              className="lu-fade-up lu-d2"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #f1adc2 0%, #d8b4fe 60%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: "'Syne', 'Georgia', serif",
              }}
            >
              {headline.line2}
            </h1>
          </div>
 
          <p
            className="lu-fade-up lu-d3"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#5e4e63',
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}
          >
            {subtitle}
          </p>
 
          {buttons && (
            <div className="lu-fade-up lu-d4 flex flex-col sm:flex-row gap-3 justify-center">
              {buttons.primary && (
                <button
                  onClick={buttons.primary.onClick}
                  style={{
                    padding: '14px 32px',
                    background: '#f1adc2',
                    border: 'none',
                    borderRadius: '100px',
                    color: '#3c2f41',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
                    boxShadow: '0 4px 20px rgba(241,173,194,0.5)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#e892b0';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(241,173,194,0.55)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#f1adc2';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(241,173,194,0.5)';
                  }}
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button
                  onClick={buttons.secondary.onClick}
                  style={{
                    padding: '14px 32px',
                    background: 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(241,173,194,0.45)',
                    borderRadius: '100px',
                    color: '#5e4e63',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 