'use client';
import { useLang, UI } from '@/lib/i18n';

export default function Contact() {
  const { lang } = useLang();
  const t = UI[lang];
  return (
    <section id="contact">
      <div className="wrap contact">
        <div>
          <h2>{t.contactTitle}</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '44ch' }}>{t.contactBody}</p>
          <dl>
            <div><dt>{t.lblPhone}</dt><dd><a href="tel:+919849523572" style={{ fontWeight: 600 }}>98495 23572</a></dd></div>
            <div><dt>{t.lblWorkshop}</dt><dd>Karimnagar, Telangana</dd></div>
            <div><dt>{t.lblHours}</dt><dd>{t.hoursVal}</dd></div>
          </dl>
          <div className="cta-row" style={{ marginTop: 28 }}>
            <a className="cta" href="tel:+919849523572">{t.btnCall}</a>
            <a className="btn-ghost" href="https://wa.me/919849523572">WhatsApp</a>
          </div>
        </div>
        <div className="map-block">
          <div className="map">
            <iframe
              src="https://maps.google.com/maps?q=18.4435501,79.1338994&z=16&output=embed"
              title="Om Virat Wooden Furniture — location on Google Maps"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a className="map-link" href="https://maps.app.goo.gl/Y4a1oaU1JJQ4yGiFA">{t.mapTitle} →</a>
        </div>
      </div>
    </section>
  );
}
