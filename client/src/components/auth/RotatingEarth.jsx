// src/components/auth/RotatingEarth.jsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function RotatingEarth({ size = 340 }) {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const W = size;
    const H = size;
    const radius = size / 2.08;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([W / 2, H / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    let landFeatures = null;
    const allDots = [];

    // ── helpers ─────────────────────────────────────────
    const pointInPolygon = (point, polygon) => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
          inside = !inside;
      }
      return inside;
    };

    const pointInFeature = (point, feature) => {
      const { type, coordinates } = feature.geometry;
      if (type === "Polygon") {
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++)
          if (pointInPolygon(point, coordinates[i])) return false;
        return true;
      }
      if (type === "MultiPolygon") {
        for (const poly of coordinates) {
          if (pointInPolygon(point, poly[0])) {
            let inHole = false;
            for (let i = 1; i < poly.length; i++)
              if (pointInPolygon(point, poly[i])) { inHole = true; break; }
            if (!inHole) return true;
          }
        }
        return false;
      }
      return false;
    };

    const generateDots = (feature, spacing = 17) => {
      const dots = [];
      const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature);
      const step = spacing * 0.08;
      for (let lng = minLng; lng <= maxLng; lng += step)
        for (let lat = minLat; lat <= maxLat; lat += step)
          if (pointInFeature([lng, lat], feature)) dots.push([lng, lat]);
      return dots;
    };

    // ── render ───────────────────────────────────────────
    const render = () => {
      context.clearRect(0, 0, W, H);
      const scale = projection.scale();
      const sf = scale / radius;

      // ── Ocean: transparent (el fondo del panel se ve) ──
      // Clip al círculo del planeta para que nada se salga
      context.save();
      context.beginPath();
      context.arc(W / 2, H / 2, scale, 0, 2 * Math.PI);
      context.clip();

      // Fondo del océano: rosado suave, casi transparente
      context.beginPath();
      context.arc(W / 2, H / 2, scale, 0, 2 * Math.PI);
      context.fillStyle = "rgba(207, 94, 242, 0.65)";
      context.fill();

      if (landFeatures) {
        // Graticule (grilla) — rosa suave
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(255, 255, 255, 0.39)";
        context.lineWidth = 0.7 * sf;
        context.stroke();

        // Land fill — rosa sólido
        context.beginPath();
        landFeatures.features.forEach((f) => path(f));
        context.fillStyle = "rgba(253,242,248,0.35)";
        context.fill();

        // Land outline — rosa más oscuro para definir
        context.beginPath();
        landFeatures.features.forEach((f) => path(f));
        context.strokeStyle = "rgba(0, 0, 0, 0.52)";
        context.lineWidth = 0.8 * sf;
        context.stroke();

        // Dots sobre los continentes — rosa más oscuro/brillante
        allDots.forEach(([lng, lat]) => {
          const p = projection([lng, lat]);
          if (!p) return;
          if (p[0] < 0 || p[0] > W || p[1] < 0 || p[1] > H) return;
          context.beginPath();
          context.arc(p[0], p[1], 1.3 * sf, 0, 2 * Math.PI);
          context.fillStyle = "rgba(253,242,248,0.35)";
          context.fill();
        });
      }

      context.restore();

      // Borde del planeta — anillo rosa
      context.beginPath();
      context.arc(W / 2, H / 2, scale, 0, 2 * Math.PI);
      context.strokeStyle = "rgba(255, 255, 255, 0)";
      context.lineWidth = 1.5 * sf;
      context.stroke();
    };

    // ── load data ────────────────────────────────────────
    const rotation = [0, -20];
    let autoRotate = true;
    const SPEED = 0.32;

    const timer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += SPEED;
        projection.rotate(rotation);
        render();
      }
    });

    fetch(
      "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
    )
      .then((r) => r.json())
      .then((data) => {
        landFeatures = data;
        data.features.forEach((f) =>
          generateDots(f, 17).forEach(([lng, lat]) => allDots.push([lng, lat]))
        );
        render();
        setLoaded(true);
      })
      .catch(() => setLoaded(true));

    // ── drag interaction ─────────────────────────────────
    const onMouseDown = (e) => {
      autoRotate = false;
      const sx = e.clientX, sy = e.clientY;
      const sr = [...rotation];
      const onMove = (me) => {
        rotation[0] = sr[0] + (me.clientX - sx) * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5));
        projection.rotate(rotation);
        render();
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        setTimeout(() => (autoRotate = true), 20);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    const onTouchStart = (e) => {
      autoRotate = false;
      const t = e.touches[0];
      const sx = t.clientX, sy = t.clientY;
      const sr = [...rotation];
      const onMove = (te) => {
        const tt = te.touches[0];
        rotation[0] = sr[0] + (tt.clientX - sx) * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (tt.clientY - sy) * 0.5));
        projection.rotate(rotation);
        render();
      };
      const onEnd = () => {
        canvas.removeEventListener("touchmove", onMove);
        canvas.removeEventListener("touchend", onEnd);
        setTimeout(() => (autoRotate = true), 20);
      };
      canvas.addEventListener("touchmove", onMove, { passive: true });
      canvas.addEventListener("touchend", onEnd);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      timer.stop();
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, [size]);

  return (
    <div style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          cursor: "grab",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}
      />
      {/* Placeholder mientras carga */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, rgba(255,100,180,0.25), rgba(255,61,158,0.10) 60%, transparent)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: 28, height: 28,
            border: "2px solid rgba(255,61,158,0.25)",
            borderTopColor: "#FF3D9E",
            borderRadius: "50%",
            animation: "earth-spin 0.8s linear infinite",
          }} />
        </div>
      )}
      <style>{`@keyframes earth-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}