import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-brand">
          <Image src="/logo-mark.png" alt="Om Sri Virat" width={40} height={40} className="logo-mark" />
          <strong>Om Sri Virat Wooden Furniture, Building Works &amp; Aluminium Works</strong>
        </div>
        <span>Karimnagar · 98495 23572</span>
      </div>
      <div className="wrap footer-sub">
        <span>&copy; {year} Om Sri Virat Wooden Furniture, Building Works &amp; Aluminium Works. Proprietor: Narsingoju Srinivas. All rights reserved.</span>
        <span>Built with Next.js &amp; Strapi</span>
      </div>
    </footer>
  );
}
