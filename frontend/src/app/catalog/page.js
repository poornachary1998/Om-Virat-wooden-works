import { getCategories, getProducts, mediaUrl } from '@/lib/strapi';
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import CatalogGrid from '@/components/CatalogGrid';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Teak Wood Work Catalog — Doors & Furniture, Karimnagar',
  description:
    'Catalog of teak wood work in Karimnagar: main doors, CNC pooja doors, beds and windows made to measure.',
  alternates: { canonical: '/catalog' }
};

export default async function CatalogPage({ searchParams }) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const items = products.map((p) => ({
    id: p.id,
    name_en: p.name_en, name_te: p.name_te,
    description_en: p.description_en, description_te: p.description_te,
    category: p.category?.data?.attributes?.slug || p.category?.slug || '',
    url: mediaUrl(p.image)
  }));

  // Deep links like /catalog?category=main-doors (from the homepage category cards)
  // should land already filtered, not on the full "all" grid.
  const requestedCategory = searchParams?.category;
  const initialFilter = requestedCategory && categories.some((c) => c.slug === requestedCategory)
    ? requestedCategory
    : 'all';

  return (
    <>
      <TopBar />
      <Header />
      <main>
        <CatalogGrid categories={categories} items={items} initialFilter={initialFilter} />
      </main>
      <Footer />
    </>
  );
}
