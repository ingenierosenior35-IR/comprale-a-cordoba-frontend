import { sellers } from '../../../data/mockData';
import ProductDetailClient from '../../../components/ProductDetail/ProductDetailClient';

export default function ProductDetailPage({ params, searchParams }) {
  const { id } = params;
  const sellerId = searchParams?.seller ? String(searchParams.seller) : null;

  // Find the product across all sellers
  let product = null;
  let resolvedSellerId = sellerId;

  for (const seller of sellers) {
    const found = seller.products.find((p) => String(p.id) === String(id));
    if (found) {
      product = found;
      if (!resolvedSellerId) resolvedSellerId = String(seller.id);
      break;
    }
  }

  if (!product) {
    return (
      <div style={{ padding: '120px 40px', textAlign: 'center', fontFamily: 'inherit' }}>
        Producto no encontrado.
      </div>
    );
  }

  return <ProductDetailClient product={product} sellerId={resolvedSellerId} />;
}
