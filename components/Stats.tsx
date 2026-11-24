'use client';
import { useEffect, useRef } from 'react';

const items: { n?: number; suffix?: string; text?: string; label: string }[] = [
  { n: 14, label: 'years designing & building interiors in Chattogram' },
  { n: 16, suffix: 'K+', label: 'followers who watch our projects come to life' },
  { n: 200, suffix: '+', label: 'projects designed & handed over — homes, duplexes, shops & institutions' },
  { text: '3D', label: 'every project visualized before a single wall is touched' },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const b = e.target.querySelector<HTMLElement>('b[data-count]'); if (!b) return;
      const end = +b.dataset.count!, suf = b.dataset.suffix || '', t0 = performance.now();
      const step = (t: number) => { const k = Math.min(1, (t - t0) / 1400); b.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.5 });
    ref.current?.querySelectorAll('.stat').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return (
    <section className="stats" id="stats" aria-label="Prokolpo in numbers">
      <div className="wrap statgrid" ref={ref}>
        {items.map((it) => (
          <div className="stat reveal" key={it.label}>
            {it.n ? <b data-count={it.n} data-suffix={it.suffix || ''}>{it.n}{it.suffix}</b> : <b>{it.text}</b>}
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
