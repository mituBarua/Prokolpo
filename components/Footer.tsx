import Link from 'next/link';
import { site } from '@/lib/site';

export default function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} Prokolpo Interior Design · {site.address.street}, {site.address.locality} {site.address.postalCode}</span>
      <span style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <Link href="/portfolio">Portfolio</Link>
        <a href={site.facebook} target="_blank" rel="noopener">Facebook</a>
        <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>
      </span>
    </footer>
  );
}
