// Central business info — used by pages, metadata and structured data.
// Set NEXT_PUBLIC_SITE_URL in Vercel once you have a domain (e.g. https://prokolpo.com.bd).
export const site = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://prokolpo-designs.vercel.app').replace(/\/$/, ''),
  name: 'Prokolpo',
  legalName: 'Prokolpo Designs',
  nameBn: 'প্রকল্প',
  tagline: 'Interior Design & Build Studio in Chattogram',
  description:
    'Prokolpo is an interior design and build studio in Chattogram, Bangladesh. For 14 years we have designed, visualized in 3D and executed 200+ homes, duplexes, shops, offices and institutions — from concept to handover.',
  phone: '+8801738125945',
  phoneDisplay: '01738-125945',
  whatsapp: '8801741876037',
  whatsappDisplay: '01741-876037',
  email: 'prokolpo.designs@gmail.com',
  address: {
    street: 'Azad Bhaban, 9th Floor, 79/A Jamal Khan Road',
    locality: 'Chattogram',
    region: 'Chattogram Division',
    postalCode: '4000',
    country: 'BD',
  },
  facebook: 'https://www.facebook.com/Prokolpo.Designs',
  academy: 'https://prokolpo-academy.vercel.app',
  years: 14,
  projectsDone: 200,
};
