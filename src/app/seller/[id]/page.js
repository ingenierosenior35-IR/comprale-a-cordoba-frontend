'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { sellers, sponsors } from '../../../data/mockData';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import ProductItem from '../../../components/SellerSection/ProductItem';
import '../../../pages/SellerDetailPage.css';

export default function SellerDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const seller = sellers.find((s) => String(s.id) === id);

  if (!seller) {
    return (
      <div className="seller-detail-page seller-detail-page--notfound">
        <Navbar />
        <main className="seller-detail-page__notfound">
          <p>Negocio no encontrado.</p>
          <button className="seller-detail-page__back" onClick={() => router.push('/')}>
            ← Volver al inicio
          </button>
        </main>
        <Footer sponsors={sponsors} />
      </div>
    );
  }

  return (
    <div className="seller-detail-page">
      <Navbar />
      <main>
        {/* Hero banner */}
        <header className="sdp-hero">
          <img
            className="sdp-hero__image"
            src={seller.image}
            alt={`Portada de ${seller.name}`}
          />
          <div className="sdp-hero__overlay">
            <div className="sdp-hero__inner">
              <button
                className="sdp-hero__back"
                onClick={() => router.push('/')}
                aria-label="Volver al inicio"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Volver
              </button>
              <span className="sdp-hero__category">{seller.category}</span>
              <h1 className="sdp-hero__name">{seller.name}</h1>
              <p className="sdp-hero__rating" aria-label={`Calificación: ${seller.rating}`}>★ {seller.rating}</p>
              <p className="sdp-hero__description">{seller.description}</p>
            </div>
          </div>
        </header>

        {/* Products grid */}
        <section className="sdp-products" aria-labelledby="sdp-products-title">
          <div className="sdp-products__inner">
            <h2 className="sdp-products__title" id="sdp-products-title">
              Productos disponibles
            </h2>
            <div className="sdp-products__grid" role="list" aria-label={`Productos de ${seller.name}`}>
              {seller.products.map((product) => (
                <ProductItem key={product.id} product={product} sellerId={seller.id} large />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer sponsors={sponsors} />
    </div>
  );
}
