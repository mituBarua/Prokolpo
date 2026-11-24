import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/manrope/index.css';
import '@fontsource/hind-siliguri/bengali-400.css';
import '@fontsource/hind-siliguri/bengali-600.css';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Prokolpo — Interior Design & Build Studio in Chattogram',
    template: '%s | Prokolpo Interiors',
  },
  description: site.description,
  keywords: [
    'interior design Chattogram', 'interior designer Chittagong', 'flat interior design Chattogram', 'home interior Bangladesh',
    'shop interior design Chattogram', 'office interior Chittagong', '3D interior design Bangladesh', 'Prokolpo',
    'ইন্টেরিয়র ডিজাইন চট্টগ্রাম', 'প্রকল্প ইন্টেরিয়র',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    locale: 'en_US',
    alternateLocale: ['bn_BD'],
    siteName: 'Prokolpo',
    title: 'Prokolpo — Interior Design & Build Studio in Chattogram',
    description: site.description,
    images: [{ url: '/projects/japandi-0.jpg', width: 1600, height: 733, alt: 'Japandi living room designed by Prokolpo' }],
  },
  twitter: { card: 'summary_large_image', title: 'Prokolpo — Interior Design Studio, Chattogram', description: site.description, images: ['/projects/japandi-0.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  category: 'Interior Design',
};

export const viewport: Viewport = { themeColor: '#16130f', width: 'device-width', initialScale: 1 };

const business = {
  '@context': 'https://schema.org',
  '@type': ['HomeAndConstructionBusiness', 'LocalBusiness'],
  '@id': `${site.url}/#business`,
  name: 'Prokolpo',
  alternateName: ['Prokolpo Designs', 'প্রকল্প', 'Prokolpo-প্রকল্প'],
  description: site.description,
  url: site.url,
  logo: { '@type': 'ImageObject', url: `${site.url}/logo.png`, width: 311, height: 301 },
  image: `${site.url}/projects/japandi-0.jpg`,
  telephone: site.phone,
  email: site.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  areaServed: [{ '@type': 'City', name: 'Chattogram' }, { '@type': 'City', name: 'Dhaka' }, { '@type': 'Country', name: 'Bangladesh' }],
  knowsAbout: ['Interior design', 'Residential interiors', 'Shop interior design', 'Office interiors', '3D visualization', 'Custom furniture', 'False ceilings and lighting design', 'Turnkey interior execution'],
  sameAs: [site.facebook, site.academy],
  hasMap: 'https://www.google.com/maps/search/?api=1&query=Azad+Bhaban+Jamal+Khan+Road+Chattogram',
  contactPoint: [{ '@type': 'ContactPoint', telephone: site.phone, contactType: 'customer service', areaServed: 'BD', availableLanguage: ['Bengali', 'English'] }],
  slogan: 'Homes designed in 3D — and built exactly as promised.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <JsonLd data={business} />
        <SmoothScroll />
        <Nav />
        <div id="main">{children}</div>
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
