import SellerCard from './SellerCard';
import './SellerSection.css';

function SellerSection({ sellers, onSellerClick }) {
  return (
    <section className="seller-section" id="negocios">
      <div className="seller-section__inner">
        {sellers.map((seller) => (
          <SellerCard
            key={seller.id}
            seller={seller}
            onViewDetail={() => onSellerClick(seller)}
          />
        ))}
      </div>
    </section>
  );
}

export default SellerSection;
