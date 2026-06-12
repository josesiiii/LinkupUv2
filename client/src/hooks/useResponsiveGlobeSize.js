// src/hooks/useResponsiveGlobeSize.js
import { useEffect, useState } from "react";

// Calcula un tamaño de planeta proporcional al ancho de la ventana,
// para que el globo (RotatingEarth) sea el elemento protagonista y responsivo.
export default function useResponsiveGlobeSize({ min = 200, max = 460, ratio = 0.34 } = {}) {
  const getSize = () =>
    typeof window === "undefined"
      ? max
      : Math.round(Math.min(max, Math.max(min, window.innerWidth * ratio)));

  const [size, setSize] = useState(getSize);

  useEffect(() => {
    const onResize = () => setSize(getSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [min, max, ratio]);

  return size;
}
