// src/hooks/usePhotoCarousel.js
import { useState, useRef, useCallback } from "react";

export default function usePhotoCarousel(photos = []) {
  const [current, setCurrent] = useState(0);
  const touchStart   = useRef({ x: 0, y: 0 });
  const isHorizontal = useRef(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const reset = useCallback(() => setCurrent(0), []);

  const onTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontal.current = null;
  };

  const onTouchMove = (e) => {
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (isHorizontal.current === null) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy);
    }
    if (isHorizontal.current) e.stopPropagation();
  };

  const onTouchEnd = (e) => {
    if (!isHorizontal.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
    isHorizontal.current = null;
  };

  const tapLeft  = (e) => { e.stopPropagation(); prev(); };
  const tapRight = (e) => { e.stopPropagation(); next(); };

  return {
    current, setCurrent, next, prev, reset,
    onTouchStart, onTouchMove, onTouchEnd,
    tapLeft, tapRight,
  };
}