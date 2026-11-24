'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Adds .in to .reveal / .process elements as they enter the viewport.
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    const t = setTimeout(() => document.querySelectorAll('.reveal:not(.in), .process:not(.in)').forEach((el) => io.observe(el)), 50);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path]);
  return null;
}
