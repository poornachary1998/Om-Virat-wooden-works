import { getCategories, getProducts, getSiteSettings, mediaUrl } from '@/lib/strapi';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import CategoryGrid from '@/components/CategoryGrid';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function HomePage() {
  const [categories, products, settings] = await Promise.all([
    getCategories(), getProducts(), getSiteSettings()
  ]);

  // Hero images come from Site Settings in the CMS; fall back to the first main-door products.
  const heroFromCms = (settings?.heroImages?.data || settings?.heroImages || []).map(mediaUrl).filter(Boolean);
  const heroImages = heroFromCms.length
    ? heroFromCms
    : products.slice(0, 7).map((p) => mediaUrl(p.image)).filter(Boolean);

  // Group product images under their category, for the carousels.
  const byCategory = categories.map((cat) => ({
    ...cat,
    images: products
      .filter((p) => (p.category?.data?.attributes?.slug || p.category?.slug) === cat.slug)
      .map((p) => ({ url: mediaUrl(p.image), name_en: p.name_en, name_te: p.name_te }))
      .filter((i) => i.url)
  }));

  return (
    <>
      <TopBar />
      <Header />
      <main id="top">
        <div className="wrap"><Hero images={heroImages} /></div>
        <Stats />
        <CategoryGrid categories={byCategory} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
