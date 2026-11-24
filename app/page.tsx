import Image from 'next/image';
import Link from 'next/link';
import Hero3D from '@/components/Hero3D';
import Room3D from '@/components/Room3D';
import Stats from '@/components/Stats';
import ProjectCard from '@/components/ProjectCard';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { FEATURED, byId, projects } from '@/lib/projects';
import { faqs } from '@/lib/faq';
import { site } from '@/lib/site';

const services = [
  { t: 'Residential Interiors', d: 'Apartments, duplexes and family homes — living rooms, bedrooms, kitchens and everything between.', i: <><path d="M6 26L27 8l21 18v22H6z" /><path d="M21 48V32h12v16" /></> },
  { t: 'Shops & Offices', d: 'Retail stores, showrooms and offices with shopfronts, display systems and lighting that sell — like Shahanshah and Blue Moon.', i: <><rect x="8" y="10" width="38" height="38" /><path d="M8 22h38M20 22v26M34 22v26" /></> },
  { t: '3D Visualization', d: 'Photoreal renders and walkthroughs so you can see and approve your space before we build.', i: <><path d="M27 6l19 11v20L27 48 8 37V17z" /><path d="M27 6v42M8 17l19 11 19-11" /></> },
  { t: 'Custom Furniture & Carve Studio', d: 'Wardrobes, kitchens, display units, carved wooden prayer altars and one-off pieces made to your measurements.', i: <path d="M8 40h38M12 40V24h30v16M16 24v-8h22v8" /> },
  { t: '3D Wall Murals & Ceilings', d: 'Exclusive sculpted murals made once for one home, plus false ceilings and LED lighting that change how a room feels.', i: <><circle cx="27" cy="22" r="10" /><path d="M22 34h10v8H22zM27 6v4M10 22H6M48 22h-4M15 10l3 3M39 10l-3 3" /></> },
  { t: 'Exterior & Turnkey', d: 'Building exteriors, floor plans and rooftop gardens — and full site execution with a termite-proof guarantee until handover.', i: <><path d="M10 44l14-14M30 8l16 16-8 8-16-16z" /><path d="M22 16L8 30l16 16 14-14" /></> },
];

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function Home() {
  return (
    <main>
      <JsonLd data={faqLd} />
      <Hero3D />
      <Stats />

      <section className="block" id="about">
        <div className="wrap about">
          <div className="reveal">
            <span className="eyebrow">The Studio</span>
            <h2 className="h2">An interior design &amp; build studio, rooted in <em>Chattogram</em>.</h2>
            <p className="lead">Prokolpo is a creative design studio where imagination meets precision. Over 14 years and 200+ handed-over projects, we have turned flats, duplexes, shops and institutions across Chattogram — and as far as Dhaka — into spaces that carry the story of the people inside them. Every project is planned in 3D first, then built by our own team.</p>
            <div className="facts">
              <div><b>Design + build</b><span>One team from concept to handover</span></div>
              <div><b>3D first</b><span>See your finished home before work starts</span></div>
              <div><b>Trusted from abroad</b><span>A client in Saudi Arabia handed us his entire duplex</span></div>
            </div>
          </div>
          <Link href="/projects/shipon" className="card3d reveal" aria-label="Home of Dr. Shipon & Dr. Ishrat">
            <div className="inner">
              <Image className="photo" src="/projects/shipon-0.jpg" alt="Living room designed by Prokolpo for Dr. Shipon & Dr. Ishrat" fill sizes="(max-width: 900px) 100vw, 40vw" quality={75} />
              <div className="pill"><strong>Home of Dr. Shipon &amp; Dr. Ishrat</strong><small>Luxury residence · Chattogram</small></div>
            </div>
          </Link>
        </div>
      </section>

      <section className="block" id="projects" style={{ background: 'var(--ink2)' }}>
        <div className="wrap">
          <div className="proj-head reveal">
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2 className="h2">Projects we&apos;ve <em>handed over</em>.</h2>
              <p className="lead" style={{ maxWidth: 520 }}>A few favourites from 200+ completed projects. Open any one for the full story and photos.</p>
            </div>
            <Link href="/portfolio" className="btn ghost">View full portfolio →</Link>
          </div>
          <div className="grid six">{FEATURED.map((id) => <ProjectCard key={id} p={byId[id]} sizes="(max-width: 900px) 100vw, 33vw" />)}</div>
          <div style={{ textAlign: 'center', marginTop: 46 }} className="reveal"><Link href="/portfolio" className="btn">See all {projects.length} projects →</Link></div>
        </div>
      </section>

      <Room3D />

      <section className="block" id="services" style={{ background: 'var(--ink2)' }}>
        <div className="wrap">
          <div className="reveal"><span className="eyebrow">What we do</span><h2 className="h2">Everything your space needs, <em>under one roof</em>.</h2></div>
          <div className="services">
            {services.map((s, i) => (
              <div className="svc reveal" key={s.t}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <svg className="ico" viewBox="0 0 54 54" fill="none" stroke="#c9a25c" strokeWidth="1.6" aria-hidden="true">{s.i}</svg>
                <h3>{s.t}</h3><p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="process">
        <div className="wrap">
          <div className="reveal"><span className="eyebrow">From first call to keys</span><h2 className="h2">From first meeting to <em>move-in day</em>.</h2></div>
          <div className="process">
            <div className="bar" />
            {[['Consult', 'Free first consultation — we visit, understand your needs, style and budget.'], ['Design', 'Layouts, mood boards and material selections tailored to you.'], ['Visualize', 'Full 3D renders — revise until every detail feels right.'], ['Build', 'Our team executes on site and hands over a finished space.']].map(([t, d], i) => (
              <div className="pstep" key={t}><div className="dot">0{i + 1}</div><h3 style={{ fontFamily: 'var(--f-serif)', fontWeight: 500, fontSize: '1.3rem', marginTop: 24 }}>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="voices" style={{ background: 'var(--ink2)' }}>
        <div className="wrap voices">
          <div className="reveal">
            <span className="eyebrow">In their words</span>
            <blockquote className="serif">“This is my kitchen. I really came to the right place for our kitchen work… I am happy for their plan, design and aesthetic look.”</blockquote>
            <cite>— Aysha Siddiqa, client · comment on the Prokolpo Facebook page</cite>
          </div>
          <div className="reveal story">
            <b className="serif">Trusted from 4,000 km away</b>
            <p>A client living in Saudi Arabia couldn&apos;t be in Chattogram to supervise — so he handed Prokolpo his entire duplex, from design to final handover.</p>
            <Link href="/projects/duplex">See the duplex →</Link>
          </div>
        </div>
      </section>

      <section className="block" id="faq">
        <div className="wrap faq">
          <div className="reveal"><span className="eyebrow">Questions clients ask</span><h2 className="h2" style={{ marginBottom: 30 }}>Good to <em>know</em>.</h2></div>
          {faqs.map((f) => <details key={f.q} className="reveal"><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </section>

      <section className="block" id="academy" style={{ paddingTop: 40 }}>
        <div className="wrap academy reveal">
          <div className="ring" /><div className="ring r2" />
          <div>
            <span className="eyebrow" style={{ color: '#ffe3c7' }}>Prokolpo Academy</span>
            <h2 className="h2">Learn interior design from a <em>working studio</em>.</h2>
            <p>A 6-month offline Interior Design &amp; Business course in Chattogram — taught by the team behind our real projects.</p>
            <div className="tags"><span>AutoCAD</span><span>SketchUp</span><span>V-Ray</span><span>Site visits</span><span>Real projects</span><span>Fri &amp; Sat classes</span></div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}><a className="btn" href={site.academy} target="_blank" rel="noopener">Explore the course →</a></div>
        </div>
      </section>

      <section className="block" id="contact">
        <div className="wrap contact">
          <div className="reveal">
            <span className="eyebrow">Start a project</span>
            <h2 className="h2">Let&apos;s design <em>your</em> space.</h2>
            <p className="lead">Tell us your flat&apos;s location, size in sft and when you want to start. The first consultation is free.</p>
            <address className="info" style={{ marginTop: 40, fontStyle: 'normal' }}>
              <div><small>Studio</small><span>{site.address.street}, {site.address.locality} {site.address.postalCode}</span></div>
              <div><small>Phone</small><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></div>
              <div><small>WhatsApp</small><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">{site.whatsappDisplay}</a></div>
              <div><small>Email</small><a href={`mailto:${site.email}`}>{site.email}</a></div>
              <div><small>Facebook</small><a href={site.facebook} target="_blank" rel="noopener">facebook.com/Prokolpo.Designs</a></div>
            </address>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
