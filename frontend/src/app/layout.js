import './globals.css';
import { LanguageProvider } from '@/lib/i18n';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://omsri.example';

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Teak Wood Work in Karimnagar | Om Sri Wooden Furniture, Building Works & Aluminium Works',
    template: '%s | Om Sri, Karimnagar'
  },
  description:
    'Om Sri Wooden Furniture, Building Works & Aluminium Works does teak wood work in Karimnagar — beds, sofas, main doors, CNC pooja doors, veneer doors and windows, plus building and aluminium works. Own carpenters, seasoned teak, delivery on the agreed date. Call 98495 23572.',
  keywords: ['teak wood work Karimnagar', 'teak furniture Karimnagar', 'wooden doors Karimnagar', 'pooja door CNC', 'carpenter Karimnagar', 'teak main door Telangana', 'aluminium works Karimnagar'],
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'Om Sri Wooden Furniture' },
  robots: { index: true, follow: true },
  other: { 'geo.region': 'IN-TG', 'geo.placename': 'Karimnagar' }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Om Sri Wooden Furniture, Building Works & Aluminium Works',
  description: 'Teak wood work, main doors, CNC pooja doors, veneer doors, windows, and building and aluminium works in Karimnagar, Telangana.',
  founder: { '@type': 'Person', name: 'Narsingoju Srinivas' },
  telephone: '+91-98495-23572',
  hasMap: 'https://maps.app.goo.gl/Y4a1oaU1JJQ4yGiFA',
  priceRange: '$$',
  address: { '@type': 'PostalAddress', addressLocality: 'Karimnagar', addressRegion: 'Telangana', addressCountry: 'IN' },
  areaServed: [{ '@type': 'City', name: 'Karimnagar' }, { '@type': 'State', name: 'Telangana' }],
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    opens: '09:00', closes: '20:00'
  }],
  knowsLanguage: ['en', 'te']
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Karla:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
