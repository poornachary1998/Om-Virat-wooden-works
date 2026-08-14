import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <div className="wrap" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <p className="kicker">404</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 16 }}>Page not found</h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '50ch', margin: '0 auto 28px' }}>
            The page you&rsquo;re looking for doesn&rsquo;t exist. It may have been moved, or the link might be out of date.
          </p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="cta" href="/">Back to home</Link>
            <Link className="btn-ghost" href="/catalog">View catalog</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
