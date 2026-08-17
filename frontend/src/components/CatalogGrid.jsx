'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useLang, UI, pick } from '@/lib/i18n';

export default function CatalogGrid({ categories, items }) {
  const { lang } = useLang();
  const t = UI[lang];
  const [filter, setFilter] = useState('all');

  const shown = filter === 'all' ? items : items.filter((it) => it.category === filter);

  return (
    <>
      <section style={{ paddingBottom: 26 }}>
        <div className="wrap">
          <p className="kicker">{lang === 'te' ? 'కరీంనగర్‌లో మీ కొలతల ప్రకారం తయారీ' : 'Made to measure in Karimnagar'}</p>
          <h1 style={{ fontSize: 'clamp(32px, 4.6vw, 50px)', marginBottom: 16 }}>{t.catalogTitle}</h1>
          <p className="lede" style={{ fontSize: 16.5 }}>{t.catalogIntro}</p>
        </div>
      </section>

      <div className="filters">
        <div className="wrap">
          <button className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>{t.all}</button>
          {categories.map((c) => (
            <button
              key={c.slug}
              className="chip"
              aria-pressed={filter === c.slug}
              onClick={() => setFilter(c.slug)}
            >
              {pick(c, 'name', lang)}
            </button>
          ))}
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="grid-products">
            {shown.map((it) => {
              const cat = categories.find((c) => c.slug === it.category);
              const name = pick(it, 'name', lang);
              return (
                <article className="product" key={it.id}>
                  <div className="shot">
                    <Image
                      src={it.url}
                      alt={name + ' — teak ' + (cat ? pick(cat, 'name', 'en').toLowerCase() : 'furniture') + ', made in Karimnagar by Om Sri'}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                  </div>
                  <div className="product-body">
                    <div className="eyebrow">{cat ? pick(cat, 'name', lang) : ''}</div>
                    <h3>{name}</h3>
                    <p>{pick(it, 'description', lang)}</p>
                    <a
                      className="enquire"
                      href={'https://wa.me/919849523572?text=' + encodeURIComponent(t.waEnquireMsg.replace('{name}', name))}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.enquire}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
