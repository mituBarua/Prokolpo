'use client';
import { useState } from 'react';
import { site } from '@/lib/site';

export default function ContactForm() {
  const [link, setLink] = useState('');
  return (
    <form className="reveal" onSubmit={(e) => {
      e.preventDefault();
      const d = new FormData(e.currentTarget);
      const v = (k: string) => String(d.get(k) || '').trim() || '-';
      const msg = `Hello Prokolpo! I'd like to discuss an interior project.\nName: ${v('name')}\nPhone: ${v('phone')}\nProject: ${v('type')}\nLocation & size: ${v('size')}\nDetails: ${v('msg')}`;
      const url = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
      setLink(url);
      window.open(url, '_blank', 'noopener');
    }}>
      <div><label htmlFor="fn">Your name</label><input id="fn" name="name" required autoComplete="name" /></div>
      <div><label htmlFor="fp">Phone</label><input id="fp" name="phone" type="tel" required autoComplete="tel" /></div>
      <div><label htmlFor="ft">Project type</label>
        <select id="ft" name="type"><option>Full apartment interior</option><option>Duplex / house</option><option>Shop / showroom</option><option>Office</option><option>Single room / kitchen</option><option>3D design only</option></select></div>
      <div><label htmlFor="fs">Location &amp; size (sft)</label><input id="fs" name="size" placeholder="e.g. Khulshi, 1,600 sft" /></div>
      <div><label htmlFor="fm">Tell us about the space</label><textarea id="fm" name="msg" placeholder="Timeline, budget, what you'd like…" /></div>
      <button className="btn" type="submit" style={{ justifySelf: 'start', marginTop: 8 }}>Send on WhatsApp →</button>
      {link && <div className="wa show">If WhatsApp didn't open, <a href={link} target="_blank" rel="noopener">tap here to send your enquiry →</a></div>}
    </form>
  );
}
