import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import JsonLd from '@/components/JsonLd';
import { byId, catName, neighbours, projects } from '@/lib/projects';
import { site } from '@/lib/site';

export const dynamicParams = false;
export function generateStaticParams() { return projects.map((p) => ({ slug: p.id })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = byId[slug];
  if (!p) return {};
  const where = p.location;
  return {
    title: `${p.title} — ${where}`,
    description: `${p.desc} ${p.size !== 'Apartment' ? p.size + ' · ' : ''}${p.work}. Interior design & execution by Prokolpo, Chattogram.`.slice(0, 300),
    alternates: { canonical: `/projects/${p.id}` },
    openGraph: { url: `/projects/${p.id}`, title: `${p.title} | Prokolpo`, images: [{ url: p.images[0].src, width: p.images[0].w, height: p.images[0].h, alt: p.title }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = byId[slug];
  if (!p) notFound();
  const { prev, next } = neighbours(p.id);
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: p.title,
      description: p.desc,
      url: `${site.url}/projects/${p.id}`,
      creator: { '@id': `${site.url}/#business` },
      locationCreated: { '@type': 'Place', name: p.location },
      about: p.work,
      image: p.images.map((im) => `${site.url}${im.src}`),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${site.url}/portfolio` },
        { '@type': 'ListItem', position: 3, name: p.title, item: `${site.url}/projects/${p.id}` },
      ],
    },
  ];
  return (
    <main>
      <JsonLd data={ld} />
      <section className="page-hero">
        <div className="wrap">
          <Link href="/portfolio" className="crumb">← All projects</Link>
          <span className="eyebrow" style={{ display: 'block' }}>{p.cat.map((c) => catName[c]).join(' · ')}</span>
          <h1 className="h2 big">{p.title}</h1>
          <dl className="pspecs">
            {[['Client', p.client], ['Location', p.location], ['Size', p.size], ['Work', p.work]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="lead">{p.desc}</p>
        </div>
      </section>
      <section className="pd-cover"><div className="wrap"><Gallery p={p} /></div></section>
      <section style={{ padding: '0 5vw 100px' }}>
        <div className="wrap pd-nav">
          <Link href={`/projects/${prev.id}`} className="pn"><small>← Previous project</small><b>{prev.title}</b></Link>
          <Link href={`/projects/${next.id}`} className="pn right"><small>Next project →</small><b>{next.title}</b></Link>
        </div>
      </section>
      <section className="cta-band"><div className="wrap"><h2 className="serif">Want a space like <em>{p.title.replace(/ — .*/, '')}</em>?</h2><Link href="/#contact" className="btn">Book a free consultation →</Link></div></section>
    </main>
  );
}
