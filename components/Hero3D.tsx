'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { byId } from '@/lib/projects';

export default function Hero3D() {
  const ref = useRef<HTMLElement>(null);
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
        <div className="scrollhint"><i />Scroll to walk through our work</div>
      </div>
    </section>
  );
}
