import Link from 'next/link';
import Image from 'next/image';
import { Project, isPrivate } from '@/lib/projects';

export default function ProjectCard({ p, priority = false, sizes = '(max-width: 900px) 100vw, 33vw' }: { p: Project; priority?: boolean; sizes?: string }) {
  const img = p.images[0];
  return (
    <Link href={`/projects/${p.id}`} className="proj reveal" data-cat={p.cat.join(' ')}>
      <div className="img"><Image src={img.src} alt={`${p.title} — ${p.location}`} fill sizes={sizes} priority={priority} quality={72} /></div>
      <span className="count">{p.images.length} photos</span>
      <div className="meta">
        <div>
          <small>{p.location}</small>
          <h3 style={{ fontFamily: 'var(--f-serif)', fontWeight: 500, fontSize: '1.3rem' }}>{p.title}</h3>
          <span className="sub">{!isPrivate(p) ? `${p.client} · ` : ''}{p.size}</span>
        </div>
        <span className="arrow" aria-hidden="true">→</span>
      </div>
    </Link>
  );
}
