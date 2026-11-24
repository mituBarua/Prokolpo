'use client';
import { useState } from 'react';
import { Category, catName, projects } from '@/lib/projects';
import ProjectCard from './ProjectCard';

const tabs: ('all' | Category)[] = ['all', 'residential', 'shop', 'institutional', '3d'];

export default function PortfolioGrid() {
  const [f, setF] = useState<'all' | Category>('all');
  const shown = projects.filter((p) => f === 'all' || p.cat.includes(f));
  return (
    <>
      <div className="filters" role="tablist" aria-label="Project categories">
        {tabs.filter((t) => t === 'all' || projects.some((p) => p.cat.includes(t))).map((t) => (
          <button key={t} role="tab" aria-selected={f === t} className={f === t ? 'on' : ''} onClick={() => setF(t)}>
            {t === 'all' ? 'All' : catName[t]} <span style={{ opacity: .55 }}>{t === 'all' ? projects.length : projects.filter((p) => p.cat.includes(t)).length}</span>
          </button>
        ))}
      </div>
      <div className="grid pgrid" style={{ marginTop: 40 }}>
        {shown.map((p, i) => <ProjectCard key={p.id} p={p} priority={i < 3} />)}
      </div>
    </>
  );
}
