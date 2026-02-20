import ProductScrollList from './ProductScrollList';
import './SellerCard.css';

function SellerCard({ seller, onViewDetail }) {
  return (
    <div className="seller-card">
      <div className="seller-card__info">
        <img
          className="seller-card__image"
          src={seller.image}
          alt={`Negocio ${seller.name}`}
          loading="lazy"
        />
        <div className="seller-card__details">
          <span className="seller-card__category">{seller.category}</span>
          <h3 className="seller-card__name">{seller.name}</h3>
          <p className="seller-card__description">{seller.description}</p>
          <div className="seller-card__footer">
            <span className="seller-card__rating">
              ★ {seller.rating}
            </span>
            <button
              className="seller-card__btn"
              onClick={onViewDetail}
              aria-label={`Ver detalle de ${seller.name}`}
            >
              Ver negocio
            </button>
          </div>
        </div>
      </div>
      <ProductScrollList products={seller.products} />
    </div>
  );
}

export default SellerCard;
