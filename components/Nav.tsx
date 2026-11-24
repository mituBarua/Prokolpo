'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/#about', label: 'Studio' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/#visualize', label: '3D Design' },
  { href: '/#services', label: 'Services' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#academy', label: 'Academy' },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > (path === '/' ? window.innerHeight * 0.8 : 40));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [path]);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);
  return (
    <>
      <nav id="nav" className={solid || open ? 'solid' : ''} aria-label="Main">
        <Link href="/" className="logo" aria-label="Prokolpo home"><Image src="/logo-mark.png" alt="" width={40} height={32} priority /><span>Prokolpo<b>.</b></span></Link>
        <ul>{links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
        <Link href="/#contact" className="btn navcta">Free consultation</Link>
        <button className={`burger ${open ? 'open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}><span /></button>
      </nav>
      <div className={`mnav ${open ? 'open' : ''}`} aria-hidden={!open}>
        {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>{l.label}</Link>)}
        <Link href="/#contact" className="btn" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>Book a free consultation</Link>
      </div>
    </>
  );
}
