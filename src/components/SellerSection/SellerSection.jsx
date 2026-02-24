'use client';

import { useEffect } from 'react';
import SellerCard from './SellerCard';
import { useSellersWithProducts } from '../../hooks/useSellersWithProducts';
import { sellers as mockSellers } from '../../data/mockData';
import './SellerSection.css';

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function adaptSeller(item) {
  const { seller, products } = item;
  return {
    id: String(seller.seller_id),
    name: seller.shop_title,
    description: stripHtml(seller.description),
    image: seller.banner_pic || seller.logo_pic || '',
    category: '',
    rating: null,
    products: (products?.items || []).map((p) => ({
      id: p.sku,
      name: p.name,
      price: p.price_range?.minimum_price?.final_price?.value ?? 0,
      image: p.image?.url || '',
    })),
  };
}

function SellerSection({ onSellerClick }) {
  const { data, isError, isLoading } = useSellersWithProducts({ pageSize: 10, productLimit: 6, currentPage: 1 });

  useEffect(() => {
    if (isError) {
      console.error('[SellerSection] GraphQL fetch failed – falling back to mock data');
    }
  }, [isError]);

  const apiItems = !isError && !isLoading ? data?.sellersWithProducts?.items : null;
  const sellers =
    Array.isArray(apiItems) && apiItems.length > 0
      ? apiItems.map(adaptSeller)
      : mockSellers;

  return (
    <section className="seller-section" id="negocios" aria-labelledby="seller-section-title">
      <div className="seller-section__inner">
        <h2 className="seller-section__title" id="seller-section-title">
          Negocios de Córdoba
        </h2>
        {sellers.map((seller) => (
          <SellerCard
            key={seller.id}
            seller={seller}
            onViewDetail={() => onSellerClick && onSellerClick(seller)}
          />
        ))}
      </div>
    </section>
  );
}

export default SellerSection;
