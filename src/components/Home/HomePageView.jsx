'use client';

import { useMemo, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../Navbar/Navbar';
import Hero from '../Hero/Hero';
import HowItWorks from '../HowItWorks/HowItWorks';
import SellerSection from '../SellerSection/SellerSection';
// import Stats from '../Stats/Stats';
import Footer from '../Footer/Footer';
// import { stats } from '../../data/mockData';
import { useSellersWithProductsInfinite } from '../../hooks/useSellersWithProductsInfinite';
import { useInfiniteScrollTrigger } from '../../hooks/useInfiniteScrollTrigger';
import OrderSuccessFromUrl from '../OrderSuccessModal/OrderSuccessFromUrl';
import { mapSellersWithProducts } from '../../utils/mapSellers';
import './HomePageView.css';

const PINNED_SELLER_ID = 341734; // Papelería y Miscelánea Calixto

function pinSellerFirst(list, pinnedId) {
  const arr = Array.isArray(list) ? list : [];
  const pinnedIdStr = String(pinnedId);

  // ✅ de-dupe in case the seller appears across multiple pages
  const seen = new Set();
  const unique = [];
  for (const s of arr) {
    const id = String(s?.id ?? '');
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push(s);
  }

  const idx = unique.findIndex((s) => String(s?.id) === pinnedIdStr);
  if (idx === -1) return unique;

  const [pinned] = unique.splice(idx, 1);
  return [pinned, ...unique];
}

export default function HomePageView() {
  const howItWorksSectionRef = useRef(null);
  const router = useRouter();

  const q = useSellersWithProductsInfinite({ pageSize: 20, productLimit: 6 });

  const sellers = useMemo(() => {
    const pages = q.data?.pages || [];
    const allItems = pages.flatMap((p) => p?.sellersWithProducts?.items || []);
    const mapped = mapSellersWithProducts(allItems);

    // ✅ force Calixto first
    return pinSellerFirst(mapped, PINNED_SELLER_ID);
  }, [q.data]);

  const canLoadMore = !!q.hasNextPage && !q.isFetchingNextPage;

  const loadMore = useCallback(() => {
    if (!canLoadMore) return;
    q.fetchNextPage();
  }, [canLoadMore, q]);

  const sentinelRef = useInfiniteScrollTrigger({
    enabled: canLoadMore,
    onLoadMore: loadMore,
    rootMargin: '900px',
  });

  return (
    <div className="home-page">
      <Suspense fallback={null}>
        <OrderSuccessFromUrl />
      </Suspense>

      <Navbar />
      <main>
        <Hero nextSectionRef={howItWorksSectionRef} />
        <HowItWorks sectionRef={howItWorksSectionRef} />

        <section className="home-sellers" aria-label="Emprendedores destacados">
          <SellerSection
            sellers={sellers}
            disableProductsFetch={true}
            onSellerClick={(seller) => router.push(`/seller/${seller.id}`)}
          />

          <div className="home-sellers__footer">
            <button
              type="button"
              className="home-sellers__link"
              onClick={() => router.push('/sellers')}
              aria-label="Ver todos los emprendedores"
            >
              Ver todos
            </button>
          </div>
        </section>

        <div ref={sentinelRef} className="home-infinite__sentinel" />
        <Footer sponsors={[]} />
      </main>
    </div>
  );
}