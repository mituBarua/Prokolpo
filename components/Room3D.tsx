'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Room3D() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let cancelled = false;
    // Only load the 3D room when the section gets close to the viewport
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      import('@/lib/three/room').then(({ initRoom }) => { if (!cancelled && ref.current) dispose = initRoom(ref.current); });
    }, { rootMargin: '600px' });
    if (ref.current) io.observe(ref.current);
    return () => { cancelled = true; io.disconnect(); dispose?.(); };
  }, []);
  return (
    <section id="visualize" ref={ref} aria-label="How we design in 3D">
      <div className="stage">
        <div className="fallback" />
        <canvas id="scene" aria-hidden="true" />
        <div className="vignette" />
        <div className="step" data-from="0" data-to=".3">
          <span className="eyebrow">How we work</span>
          <h2>Before a wall is touched, <em>we build it in 3D</em>.</h2>
          <p>Every piece of furniture, every light and every finish is modelled first — so you can walk through your home before it exists.</p>
        </div>
        <div className="step" data-from=".32" data-to=".62">
          <span className="eyebrow">Revise freely</span>
          <h2>Move it. Change it. <em>Approve it.</em></h2>
          <p>Layouts, materials and lighting are adjusted on screen until it feels right — no costly changes on site.</p>
        </div>
        <div className="step" data-from=".64" data-to="1.01">
          <span className="eyebrow">Concept → Visualization → Execution</span>
          <h2>Then we <em>bring it</em> to life.</h2>
          <p>One team handles design, materials, carpentry and site supervision — so what you approve in 3D is exactly what you get.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}><Link href="/#contact" className="btn">Start your project</Link></div>
        </div>
        <div className="progress" id="prog">00%</div>
      </div>
    </section>
  );
}
