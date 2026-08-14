'use client';
import { useLang, UI } from '@/lib/i18n';

export default function TopBar() {
  const { lang, setLang } = useLang();
  const t = UI[lang];
  return (
    <div className="topbar">
      <a href="#top" className="skip">{t.skip}</a>
      <div className="wrap">
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          <span>{t.phone} 98495 23572</span>
          <span style={{ opacity: .55 }}>{t.hours}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="langbtn" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
          <button className="langbtn" aria-pressed={lang === 'te'} onClick={() => setLang('te')}>తెలుగు</button>
        </div>
      </div>
    </div>
  );
}
