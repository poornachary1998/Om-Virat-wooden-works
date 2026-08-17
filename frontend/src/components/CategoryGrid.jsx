'use client';
import Link from 'next/link';
import Carousel from './Carousel';
import { useLang, UI, pick } from '@/lib/i18n';

export default function CategoryGrid({ categories }) {
  const { lang } = useLang();
  const t = UI[lang];
  return (
    <section className="section-dark">
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h2>{t.catTitle}</h2>
            <p style={{ margin: 0, maxWidth: '58ch' }}>{t.catBody}</p>
          </div>
          <Link href="/catalog" style={{ color: '#e0b972', fontWeight: 600 }}>{t.viewCatalog}</Link>
        </div>
        <div className="grid-cats">
          {categories.map((cat) => (
            <article className="cat-card" key={cat.slug}>
              <Carousel
                ratio="4x5"
                images={cat.images.map((im) => ({
                  url: im.url,
                  alt: pick(im, 'name', lang) + ' — teak, made in Karimnagar by Om Sri Virat'
                }))}
              />
              <div className="cat-body">
                <Link href={'/catalog?category=' + cat.slug} className="cat-name">{pick(cat, 'name', lang)}</Link>
                <div className="cat-note">{cat.images.length} {lang === 'te' ? 'డిజైన్లు' : 'designs'}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
