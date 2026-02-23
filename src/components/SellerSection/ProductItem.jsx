'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import './ProductItem.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

function ProductItem({ product, sellerId, sellerName }) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleClick = () => {
    const query = sellerId ? `?seller=${sellerId}` : '';
    router.push(`/product/${product.id}${query}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product, sellerId, 1, sellerName);
  };

  return (
    <div className="product-item" role="listitem">
      <img
        className="product-item__image"
        src={product.image}
        alt={product.name}
        loading="lazy"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      <div className="product-item__body" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <p className="product-item__name">{product.name}</p>
        <p className="product-item__price">{formatPrice(product.price)}</p>
      </div>
      <button
        className="product-item__add"
        aria-label={`Agregar ${product.name} al carrito`}
        onClick={handleAddToCart}
      >
        Agregar
      </button>
    </div>
  );
}

export default ProductItem;
