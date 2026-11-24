'use client';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { Project } from '@/lib/projects';

export default function Gallery({ p }: { p: Project }) {
  const [k, setK] = useState<number | null>(null);
  const n = p.images.length;
  const close = useCallback(() => setK(null), []);
  useEffect(() => {
    if (k === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') setK((x) => (x! + 1) % n);
      if (e.key === 'ArrowLeft') setK((x) => (x! - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [k, n, close]);
  return (
    <>
      <div className="cover">
        <a href={p.images[0].src} onClick={(e) => { e.preventDefault(); setK(0); }} aria-label="Open photo 1">
          <Image src={p.images[0].src} alt={`${p.title}, ${p.location} — designed by Prokolpo`} fill priority sizes="(max-width: 1240px) 100vw, 1200px" quality={80} />
        </a>
      </div>
      <div style={{ marginTop: 60 }}>
        <div>
          <div className="pd-head"><h2 className="serif" style={{ fontWeight: 400, fontSize: '1.6rem' }}>All photos <span>({n})</span></h2></div>
          <div className="masonry">
            {p.images.map((im, i) => (
              <a key={im.src} href={im.src} onClick={(e) => { e.preventDefault(); setK(i); }} aria-label={`Open photo ${i + 1}`}>
                <Image src={im.src} alt={`${p.title} — photo ${i + 1}`} width={im.w} height={im.h} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" quality={72} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className={`lb ${k !== null ? 'open' : ''}`} id="pv" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        {k !== null && (
          <>
            <button className="x" onClick={close} aria-label="Close">✕</button>
            <button className="pvb l" onClick={() => setK((k - 1 + n) % n)} aria-label="Previous photo">←</button>
            <div className="pvimg"><Image src={p.images[k].src} alt={`${p.title} — photo ${k + 1}`} width={p.images[k].w} height={p.images[k].h} sizes="92vw" quality={85} /></div>
            <button className="pvb r" onClick={() => setK((k + 1) % n)} aria-label="Next photo">→</button>
            <div className="pvc">{p.title} · {k + 1} / {n}</div>
          </>
        )}
      </div>
    </>
  );
}
