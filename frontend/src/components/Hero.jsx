'use client';
import Link from 'next/link';
import Carousel from './Carousel';
import { useLang, UI } from '@/lib/i18n';

export default function Hero({ images }) {
  const { lang } = useLang();
  const t = UI[lang];
  return (
    <div className="hero">
      <div>
        <p className="kicker">{t.heroKicker}</p>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroBody}</p>
        <div className="cta-row">
          <Link className="cta" href="/catalog">{t.heroCta1}</Link>
          <a className="btn-ghost" href="#contact">{t.heroCta2}</a>
        </div>
      </div>
      <Carousel
        ratio="4x5"
        autoplayMs={5000}
        priority
        images={images.map((url) => ({ url, alt: 'Teak main door made by Om Sri, Karimnagar' }))}
      />
    </div>
  );
}
