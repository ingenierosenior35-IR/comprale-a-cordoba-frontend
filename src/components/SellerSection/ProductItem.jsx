import './ProductItem.css';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

function ProductItem({ product }) {
  return (
    <div className="product-item" role="listitem">
      <img
        className="product-item__image"
        src={product.image}
        alt={product.name}
        loading="lazy"
      />
      <div className="product-item__body">
        <p className="product-item__name">{product.name}</p>
        <p className="product-item__price">{formatPrice(product.price)}</p>
      </div>
      <button className="product-item__add" aria-label={`Agregar ${product.name} al carrito`}>
        +
      </button>
    </div>
  );
}

export default ProductItem;
