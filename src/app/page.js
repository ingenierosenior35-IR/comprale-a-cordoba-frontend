'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClientProviders from '../providers/ClientProviders';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import SellerSection from '../components/SellerSection/SellerSection';
import Stats from '../components/Stats/Stats';
import Footer from '../components/Footer/Footer';
import { sellers as mockSellers, stats, sponsors } from '../data/mockData';
import { SELLERS_WITH_PRODUCTS } from '../graphql/sellers/queries';
import './home.css';

const SELLER_PLACEHOLDER = 'https://via.placeholder.com/400x300?text=Negocio';
const PRODUCT_PLACEHOLDER = 'https://via.placeholder.com/200x200?text=Producto';

function stripHtml(html) {
  return (html || '').replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim();
}

function mapSellers(items) {
  return items.map((item) => {
    const s = item.seller;
    const productItems = item.products?.items ?? [];
    return {
      id: s.seller_id,
      name: s.shop_title || s.shop_url || `Seller ${s.seller_id}`,
      description: stripHtml(s.description),
      image: s.banner_pic || s.logo_pic || SELLER_PLACEHOLDER,
      category: 'Negocio',
      rating: 4.8,
      products: productItems.map((p, i) => ({
        id: p.sku || String(i),
        name: p.name,
        price: p.price_range?.minimum_price?.final_price?.value ?? 0,
        image: p.image?.url || PRODUCT_PLACEHOLDER,
      })),
    };
  });
}

export default function HomePage() {
  const howItWorksSectionRef = useRef(null);
  const router = useRouter();
  const [sellers, setSellers] = useState(mockSellers);

  useEffect(() => {
    async function fetchSellers() {
      try {
        const res = await fetch('/api/graphql-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: SELLERS_WITH_PRODUCTS,
            variables: { pageSize: 100, productLimit: 6, currentPage: 1 },
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = json?.data?.sellersWithProducts?.items;
        if (!Array.isArray(items) || items.length === 0) throw new Error('No sellers returned');
        setSellers(mapSellers(items));
      } catch (err) {
        console.warn('[HomePage] GraphQL fetch failed, using mock data:', err?.message || err);
      }
    }
    fetchSellers();
  }, []);

  const handleSellerClick = (seller) => {
    router.push(`/seller/${seller.id}`);
  };

  return (
    <ClientProviders>
      <div className="home-page">
        <Navbar />
        <main>
          <Hero nextSectionRef={howItWorksSectionRef} />
          <HowItWorks sectionRef={howItWorksSectionRef} />
          <SellerSection sellers={sellers} onSellerClick={handleSellerClick} />
          <Stats stats={stats} />
          <Footer sponsors={sponsors} />
        </main>
      </div>
    </ClientProviders>
  );
}
