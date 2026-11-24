'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { byId } from '@/lib/projects';

type Frame = [string, string];

export default function Hero3D() {
  const ref = useRef<HTMLElement>(null);
  const [view, setView] = useState<{ index: number; frames: Frame[] } | null>(null);
  const close = useCallback(() => setView(null), []);
  const step = useCallback((d: number) => setView((v) => v && { ...v, index: (v.index + d + v.frames.length) % v.frames.length }), []);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const onOpen = (e: Event) => setView((e as CustomEvent).detail);
    el.addEventListener('hero-open', onOpen);
    return () => el.removeEventListener('hero-open', onOpen);
  }, []);
  useEffect(() => {
    if (!view) return;
    const lenis = (window as any).__lenis; lenis?.stop(); document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); };
    window.addEventListener('keydown', onKey);
    return () => { lenis?.start(); document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [view, close, step]);
  const cur = view ? (() => {
    const [pid, img] = view.frames[view.index];
    const p = byId[pid]; const src = `/projects/${img}.jpg`;
    const im = p.images.find((x) => x.src === src) || p.images[0];
    return { p, im };
  })() : null;
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import('@/lib/three/tunnel').then(({ initTunnel }) => {
      if (!cancelled && ref.current) dispose = initTunnel(ref.current, byId);
    });
    return () => { cancelled = true; dispose?.(); };
  }, []);
  const letters = 'Prokolpo'.split('');
  return (
    <section id="hero" ref={ref} aria-label="Prokolpo — interior design studio">
      <div className="stage">
        <canvas id="tunnel" aria-hidden="true" />
        <div className="hero-shade" />
        <div className="hero-intro" id="heroIntro">
          <span className="eyebrow">Interior Design &amp; Build Studio · Chattogram · 14 years</span>
          <h1 className="wordmark" aria-label="Prokolpo — Interior Design Studio in Chattogram">
            {letters.map((l, i) => <span key={i} aria-hidden="true" style={{ animationDelay: `${0.05 + i * 0.06}s` }}>{l}</span>)}
            <span className="dot" aria-hidden="true" style={{ animationDelay: '.6s' }}>.</span>
          </h1>
          <p className="hero-tag">Homes designed in 3D — <b>and built exactly as promised.</b></p>
          <p className="hero-bn bn" lang="bn">আপনার স্বপ্নের ঘর, আমাদের নকশায়।</p>
          <div className="hero-cta">
            <Link href="/portfolio" className="btn">See our projects</Link>
            <Link href="/#contact" className="btn ghost">Book a free consultation</Link>
          </div>
        </div>
        <div className="hero-caption" id="heroCap" aria-live="polite"><small id="capLoc" /><h3 id="capTitle" /><p id="capSub" /></div>
        <div className="hero-outro" id="heroOutro">
          <h2>Every frame is a home <em>we built.</em></h2>
          <p>From 1,250 sft flats to duplexes, shops and university libraries — designed, visualized and executed by one team.</p>
          <Link href="/portfolio" className="btn">Explore all projects →</Link>
        </div>
        <div className="hero-meter" id="meter" aria-hidden="true" />
        <div className="scrollhint"><i />Scroll to walk through our work · tap a photo to enlarge</div>
      </div>
      <div className={`lb ${cur ? 'open' : ''}`} id="pv" role="dialog" aria-modal="true" aria-label="Project photo" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {cur && (
          <>
            <button className="x" onClick={close} aria-label="Close">✕</button>
            <button className="pvb l" onClick={() => step(-1)} aria-label="Previous photo">←</button>
            <div className="pvimg"><Image src={cur.im.src} alt={`${cur.p.title} — ${cur.p.location}`} width={cur.im.w} height={cur.im.h} sizes="92vw" quality={85} priority /></div>
            <button className="pvb r" onClick={() => step(1)} aria-label="Next photo">→</button>
            <div className="pvc hero-pvc">
              <span><b>{cur.p.title}</b> · {cur.p.location}</span>
              <Link href={`/projects/${cur.p.id}`} className="btn" onClick={close}>View full project →</Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
