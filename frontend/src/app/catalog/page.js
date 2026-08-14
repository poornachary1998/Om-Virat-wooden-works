import { getCategories, getProducts, mediaUrl } from '@/lib/strapi';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import CatalogGrid from '@/components/CatalogGrid';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Teak Door & Furniture Catalog, Karimnagar',
  description:
    'Catalog of teak main doors, CNC pooja doors, veneer and interior doors, beds, sofas, dining tables and windows made to measure in Karimnagar.'
};

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const items = products.map((p) => ({
    id: p.id,
    name_en: p.name_en, name_te: p.name_te,
    description_en: p.description_en, description_te: p.description_te,
    category: p.category?.data?.attributes?.slug || p.category?.slug || '',
    url: mediaUrl(p.image)
  }));

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <CatalogGrid categories={categories} items={items} />
      </main>
      <Footer />
    </>
  );
}
