'use client';

import { useMemo, useCallback, useRef, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSellerById } from '../../hooks/useSellerById';
import { useProductsBySellerInfinite } from '../../hooks/useProductsBySellerInfinite';
import { useInfiniteScrollTrigger } from '../../hooks/useInfiniteScrollTrigger';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ProductItem from '../SellerSection/ProductItem';
import './SellerDetailPage.css';

function ensureHiRes(url) {
  if (!url) return '';
  try {
    const u = new URL(url);
    if (u.searchParams.get('optimize') === 'medium') u.searchParams.delete('optimize');
    return u.toString();
  } catch {
    return String(url).replace(/([?&])optimize=medium(&|$)/, '$1').replace(/[?&]$/, '');
  }
}

function stripHtmlText(v) {
  if (!v) return '';
  return String(v).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function SellerDetailPageView({ id }) {
  const router = useRouter();

  const sellerIdNum = Number(id);
  const { data: seller, isLoading: sellerLoading, isError: sellerError } = useSellerById({ sellerId: sellerIdNum });

  const productsQ = useProductsBySellerInfinite({ sellerId: sellerIdNum, pageSize: 12 });

  const products = useMemo(() => {
    const pages = productsQ.data?.pages || [];
    const out = [];
    for (const page of pages) {
      const items = page?.productsBySeller?.items || [];
      for (const p of items) {
        out.push({
          id: p.sku,
          sku: p.sku,
          productId: typeof p.id === 'number' ? p.id : null,
          stock: typeof p.stock_saleable === 'number' ? p.stock_saleable : null,
          name: p.name,
          price: p.price_range?.minimum_price?.final_price?.value ?? 0,
          image: p.image?.url || '',
          description: stripHtmlText(p.description?.html),
        });
      }
    }
    return out;
  }, [productsQ.data]);

  const sellerName = seller?.shop_title || 'Ayuda a Cordoba';
  const bannerUrl = ensureHiRes(seller?.banner_pic || '');
  const sellerDescription = stripHtmlText(seller?.description || seller?.shop_description || '');

  const loading = sellerLoading || productsQ.isLoading;
  const canLoadMore = !!productsQ.hasNextPage && !productsQ.isFetchingNextPage;

  const loadMore = useCallback(() => {
    if (!canLoadMore) return;
    productsQ.fetchNextPage();
  }, [canLoadMore, productsQ]);

  const sentinelRef = useInfiniteScrollTrigger({
    enabled: !loading && !sellerError && !!seller && canLoadMore,
    onLoadMore: loadMore,
    rootMargin: '900px',
  });

  const descRef = useRef(null);
  const [descUseNarrow, setDescUseNarrow] = useState(false);

  useLayoutEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const check = () => {
      el.classList.remove('sdp-hero__descText--narrow');
      el.classList.add('sdp-hero__descText--full');

      const styles = window.getComputedStyle(el);
      const fontSize = parseFloat(styles.fontSize) || 16;

      // line-height might be "normal" -> approximate
      const rawLineHeight = styles.lineHeight;
      const parsedLineHeight = parseFloat(rawLineHeight);
      const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : fontSize * 1.2;

      // If height is more than ~1 line, we consider it wrapped => switch to narrow
      const isMultiLine = el.scrollHeight > lineHeight * 1.6; // tolerance
      setDescUseNarrow(isMultiLine);
    };

    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => ro.disconnect();
  }, [sellerDescription]);

  if (loading) {
    return (
      <div className="seller-detail-page">
        <Navbar />
        <main className="seller-detail-page__notfound">
          <p>Cargando...</p>
        </main>
      </div>
    );
  }

  if (sellerError || !seller) {
    return (
      <div className="seller-detail-page seller-detail-page--notfound">
        <Navbar />
        <main className="seller-detail-page__notfound">
          <p>Negocio no encontrado.</p>
          <button className="seller-detail-page__back" onClick={() => router.push('/')} type="button">
            ← Volver al inicio
          </button>
        </main>
        <Footer sponsors={[]} />
      </div>
    );
  }

  return (
    <div className="seller-detail-page">
      <Navbar />

      <main className="sdp">
        <header className="sdp-hero" aria-label={`Portada de ${sellerName}`}>
          <div className="sdp-container">
            <div className="sdp-hero__frame">
              {bannerUrl ? (
                <img className="sdp-hero__image" src={bannerUrl} alt={`Portada de ${sellerName}`} />
              ) : (
                <div className="sdp-hero__fallback" aria-hidden="true" />
              )}
              <h1 className="sdp-hero__title">{sellerName}</h1>
            </div>

            {sellerDescription ? (
              <div className="sdp-hero__descCard" aria-label="Descripción del negocio">
                <p
                  ref={descRef}
                  className={`sdp-hero__descText ${
                    descUseNarrow ? 'sdp-hero__descText--narrow' : 'sdp-hero__descText--full'
                  }`}
                >
                  {sellerDescription}
                </p>
              </div>
            ) : null}
          </div>
        </header>

        <section className="sdp-products" aria-label={`Productos de ${sellerName}`}>
          <div className="sdp-container">
            {productsQ.isError ? (
              <p className="sdp-products__state">Error cargando productos.</p>
            ) : products.length === 0 ? (
              <p className="sdp-products__state">Este negocio no tiene productos.</p>
            ) : (
              <>
                <div className="sdp-products__grid" role="list">
                  {products.map((product) => (
                    <ProductItem key={product.id} product={product} sellerId={id} sellerName={sellerName} />
                  ))}
                </div>

                <div ref={sentinelRef} style={{ height: 1 }} />

                {productsQ.isFetchingNextPage ? <p className="sdp-products__state">Cargando más productos…</p> : null}
                {!productsQ.hasNextPage && products.length > 0 ? <p className="sdp-products__state"></p> : null}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer sponsors={[]} />
    </div>
  );
}