'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

// Buttery inertial scrolling on desktop; native scrolling on touch devices.
export default function SmoothScroll() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -70 } });
    (window as any).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); (window as any).__lenis = undefined; };
  }, []);
  // On route change: jump to hash target or top
  useEffect(() => {
    const lenis = (window as any).__lenis;
    const id = window.location.hash.slice(1);
    const el = id ? document.getElementById(id) : null;
    requestAnimationFrame(() => {
      if (el) lenis ? lenis.scrollTo(el, { offset: -70, immediate: true }) : el.scrollIntoView();
      else lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
    });
  }, [path]);
  return null;
}
