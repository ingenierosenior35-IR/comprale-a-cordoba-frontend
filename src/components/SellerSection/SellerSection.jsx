'use client';

import SellerCard from './SellerCard';
import './SellerSection.css';

function SellerSection({ sellers, onSellerClick, disableProductsFetch = false }) {
  const list = Array.isArray(sellers) ? sellers : [];
  if (!list.length) return null;

  return (
    <section className="seller-section" id="negocios" aria-labelledby="seller-section-title">
      <div className="seller-section__inner">
        {list.map((seller) => (
          <SellerCard
            key={seller.id}
            seller={seller}
            disableProductsFetch={disableProductsFetch}
            onViewDetail={() => onSellerClick && onSellerClick(seller)}
          />
        ))}
      </div>
    </section>
  );
}

export default SellerSection;