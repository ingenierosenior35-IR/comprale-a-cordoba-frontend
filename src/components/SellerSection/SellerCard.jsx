/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProductScrollList from './ProductScrollList';
import { useProductsBySeller } from '../../hooks/useProductsBySeller';
import { stripHtml } from '../../utils/html';
import './SellerCard.css';

const SELLER_PLACEHOLDER = 'https://via.placeholder.com/600x400?text=Negocio';
const PRODUCT_PLACEHOLDER = 'https://via.placeholder.com/400x400?text=Producto';

function isValidProduct(p) {
  if (!p) return false;

  const id = p?.sku ?? p?.id ?? p?.productId;
  if (id === null || id === undefined) return false;
  const idStr = String(id).trim();
  if (!idStr) return false;

  const name = String(p?.name ?? '').trim();
  if (!name) return false;

  return true;
}

function mapProductsFromApi(items = [], sellerId) {
  return (items || [])
    .filter(isValidProduct)
    .map((p, idx) => ({
      id: String(p?.sku ?? p?.id ?? `${sellerId || 'seller'}-${idx}`),
      sku: p?.sku || null,
      productId: typeof p?.id === 'number' ? p.id : null,
      stock: typeof p?.stock_saleable === 'number' ? p.stock_saleable : null,

      name: p?.name || '',
      price: p?.price_range?.minimum_price?.final_price?.value ?? 0,
      currency: p?.price_range?.minimum_price?.final_price?.currency || 'COP',
      image: p?.image?.url || PRODUCT_PLACEHOLDER,
      description: stripHtml(p?.description?.html),
    }));
}

function SellerCard({ seller, onViewDetail, disableProductsFetch = false }) {
  const router = useRouter();
  const scrollRef = useRef(null);

  const sellerId = seller?.id;
  const sellerName = seller?.name || '';

  const sellerImage = seller?.logo_pic || seller?.banner_pic || SELLER_PLACEHOLDER;
  const sellerDescription = stripHtml(seller?.description);

  // ✅ IMPORTANT: in Home we must NOT call productsBySeller per seller
  const qProducts = useProductsBySeller({
    sellerId,
    pageSize: 12,
    currentPage: 1,
    enabled: !disableProductsFetch, // ✅ disable fetch in Home
  });

  const products = useMemo(() => {
    if (disableProductsFetch) {
      const fallbackOnly = Array.isArray(seller?.products) ? seller.products : [];
      return fallbackOnly
        .filter(isValidProduct)
        .map((p, idx) => ({
          id: String(p?.id ?? p?.sku ?? `${sellerId || 'seller'}-${idx}`),
          sku: p?.sku || p?.id || null,
          productId: p?.productId ?? null,
          stock: p?.stock ?? null,
          name: p?.name || '',
          price: p?.price ?? 0,
          currency: 'COP',
          image: p?.image || PRODUCT_PLACEHOLDER,
          description: p?.description || '',
        }));
    }

    // Prefer API productsBySeller if present
    const apiItems = qProducts.data?.productsBySeller?.items;
    if (Array.isArray(apiItems) && apiItems.length) return mapProductsFromApi(apiItems, sellerId);

    // Fallback to sellersWithProducts preloaded products
    const fallback = Array.isArray(seller?.products) ? seller.products : [];
    return fallback
      .filter(isValidProduct)
      .map((p, idx) => ({
        id: String(p?.id ?? p?.sku ?? `${sellerId || 'seller'}-${idx}`),
        sku: p?.sku || p?.id || null,
        productId: p?.productId ?? null,
        stock: p?.stock ?? null,
        name: p?.name || '',
        price: p?.price ?? 0,
        currency: 'COP',
        image: p?.image || PRODUCT_PLACEHOLDER,
        description: p?.description || '',
      }));
  }, [disableProductsFetch, qProducts.data, seller?.products, sellerId]);

  const canScroll = products.length > 0;

  if (!disableProductsFetch && !qProducts.isLoading && products.length === 0) return null;
  if (disableProductsFetch && products.length === 0) return null;

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const handleLimitsChange = useCallback(({ canPrev: p, canNext: n }) => {
    setCanPrev(Boolean(p));
    setCanNext(Boolean(n));
  }, []);

  const handlePrev = () => {
    if (!canScroll) return;
    scrollRef.current?.prev?.();
  };

  const handleNext = () => {
    if (!canScroll) return;
    scrollRef.current?.next?.();
  };

  const handleSellerNav = () => router.push(`/seller/${sellerId}`);

  return (
    <article className="seller-card" aria-label={`Negocio ${sellerName}`}>
      <button
        className="seller-card__arrow seller-card__arrow--prev"
        onClick={handlePrev}
        disabled={!canScroll || !canPrev}
        aria-label="Productos anteriores"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <div className="seller-card__left">
        <div className="seller-card__image-wrap" onClick={handleSellerNav} role="button" tabIndex={0}>
          <img className="seller-card__cover" src={sellerImage} alt={`Imagen de ${sellerName}`} loading="lazy" />
          <div className="seller-card__name-overlay">
            <h3 className="seller-card__name">{sellerName}</h3>
          </div>
        </div>

        <div className="seller-card__info">
          <h3 className="seller-card__name seller-card__name--mobile">{sellerName}</h3>
          <p className="seller-card__description">{sellerDescription}</p>

          <button className="seller-card__btn" onClick={onViewDetail} aria-label={`Cómprale aquí a ${sellerName}`} type="button">
            Cómprale aquí
          </button>
        </div>
      </div>

      <div className="seller-card__right">
        <ProductScrollList
          ref={scrollRef}
          products={products}
          sellerId={sellerId}
          sellerName={sellerName}
          loading={!disableProductsFetch ? qProducts.isLoading : false}
          visibleCount={3}
          onLimitsChange={handleLimitsChange}
        />
      </div>

      <button
        className="seller-card__arrow seller-card__arrow--next"
        onClick={handleNext}
        disabled={!canScroll || !canNext}
        aria-label="Más productos"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </article>
  );
}

export default SellerCard;