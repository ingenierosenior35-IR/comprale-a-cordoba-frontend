'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { sponsors } from '../../data/mockData';
import './ProductDetail.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

export default function ProductDetailClient({ product, sellerId }) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, sellerId, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, sellerId, quantity);
    router.push('/checkout');
  };

  return (
    <div className="pdp">
      <Navbar />
      <main className="pdp__main">
        <div className="pdp__container">
          <button className="pdp__back" onClick={() => router.back()} aria-label="Volver">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver
          </button>

          <div className="pdp__layout">
            {/* Left: Image */}
            <div className="pdp__image-wrap">
              <img
                className="pdp__image"
                src={product.image}
                alt={product.name}
              />
            </div>

            {/* Right: Info */}
            <div className="pdp__info">
              <h1 className="pdp__name">{product.name}</h1>
              <p className="pdp__price">{formatPrice(product.price)}</p>

              <hr className="pdp__divider" />

              {product.description && (
                <p className="pdp__description">{product.description}</p>
              )}

              {/* Quantity */}
              <div className="pdp__qty-row">
                <span className="pdp__qty-label">Cantidad</span>
                <div className="pdp__qty-ctrl" role="group" aria-label="Control de cantidad">
                  <button
                    className="pdp__qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span className="pdp__qty-num" aria-live="polite">{quantity}</span>
                  <button
                    className="pdp__qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <button className="pdp__btn pdp__btn--primary" onClick={handleAddToCart}>
                Agregar al carrito
              </button>
              <button className="pdp__btn pdp__btn--secondary" onClick={handleBuyNow}>
                Comprar ahora
              </button>

              {/* Shipping info */}
              <div className="pdp__shipping">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="1" y="3" width="15" height="13" rx="1" />
                  <path d="M16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Envío gratis a través de Inter Rapidísimo</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer sponsors={sponsors} />
    </div>
  );
}
