import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="page-hero" style={{ minHeight: '70vh' }}>
      <div className="wrap">
        <span className="eyebrow">404</span>
        <h1 className="h2 big">This room <em>doesn&apos;t exist</em> yet.</h1>
        <p className="lead">The page you were looking for was moved or never built.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}><Link href="/" className="btn">Go home</Link><Link href="/portfolio" className="btn ghost">See our projects</Link></div>
      </div>
    </main>
  );
}
