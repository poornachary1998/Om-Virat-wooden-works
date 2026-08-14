'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLang, UI } from '@/lib/i18n';

export default function Header() {
  const { lang } = useLang();
  const t = UI[lang];
  return (
    <header className="header">
      <div className="wrap">
        <Link href="/" className="logo">
          <Image src="/logo-mark.png" alt="Om Virat" width={40} height={40} className="logo-mark" priority />
          <span>
            <span className="logo-name">Om Virat</span>
            <span className="logo-sub">{t.logoSub}</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href="/">{t.navHome}</Link>
          <Link href="/catalog">{t.navCatalog}</Link>
          <a href="/#contact">{t.navVisit}</a>
          <a className="btn-primary" href="tel:+919849523572">{t.navCall}</a>
        </nav>
      </div>
    </header>
  );
}
