import type { Metadata } from 'next';
import Link from 'next/link';
import PortfolioGrid from '@/components/PortfolioGrid';
import JsonLd from '@/components/JsonLd';
import { projects } from '@/lib/projects';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Portfolio — Homes, Shops, Offices & 3D Designs',
  description: `Browse ${projects.length} interior projects by Prokolpo in Chattogram: apartments in Shyamoli, Chandranagar, Pathorghata and Didar Market, duplexes, retail stores, offices, the CUET hall library and photoreal 3D designs.`,
  alternates: { canonical: '/portfolio' },
  openGraph: { url: '/portfolio', images: ['/projects/shahanshah-0.jpg'] },
};

const also = [
  ['Duplex, Waliullah R/A — Mr. Ahmedullah', '2,250 sft'], ['Epic Ferdous Windsor apartment', '2,400 sft'], ['Mohra residence', '2,500 sft'],
  ['Pathorghata family home', '2,000 sft'], ["Foy's Lake apartment", '1,400 sft'], ['Patiya home', '1,250 sft'],
  ['BTI premium residence, Khulshi', 'Apartment'], ['Firoz Shah R/A transformation', 'Apartment'], ['Masterpool residence', 'Apartment'],
];

export default function Portfolio() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Prokolpo Portfolio',
    url: `${site.url}/portfolio`,
    mainEntity: { '@type': 'ItemList', itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/projects/${p.id}`, name: p.title })) },
  };
  return (
    <main>
      <JsonLd data={ld} />
      <section className="page-hero">
        <div className="wrap">
          <Link href="/" className="crumb">← Home</Link>
          <span className="eyebrow" style={{ display: 'block' }}>Portfolio</span>
          <h1 className="h2 big">Every project, <em>room by room</em>.</h1>
          <p className="lead">Homes, shops, offices, institutions and 3D designs by Prokolpo. Choose a category, then open a project for the client, location, size and full photo set.</p>
          <div style={{ marginTop: 40 }}><PortfolioGrid /></div>
        </div>
      </section>
      <section className="block" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="more">
            <h2 className="serif" style={{ fontWeight: 400, fontSize: '1.4rem' }}>Also completed by Prokolpo</h2>
            <ul>{also.map(([a, b]) => <li key={a}>{a}<span>{b}</span></li>)}</ul>
          </div>
        </div>
      </section>
      <section className="cta-band"><div className="wrap"><h2 className="serif">Like what you see? Let&apos;s plan <em>yours</em>.</h2><Link href="/#contact" className="btn">Free consultation →</Link></div></section>
    </main>
  );
}
