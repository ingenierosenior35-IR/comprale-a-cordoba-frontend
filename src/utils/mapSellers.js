import { stripHtml } from './html';

const SELLER_PLACEHOLDER = 'https://via.placeholder.com/400x300?text=Negocio';
const PRODUCT_PLACEHOLDER = 'https://via.placeholder.com/200x200?text=Producto';

export function mapSellersWithProducts(items) {
  return (items || []).map((item) => {
    // ✅ IMPORTANT: sellersWithProducts response shape is { seller, products }
    const s = item?.seller || {};
    const productItems = Array.isArray(item?.products?.items) ? item.products.items : [];

    const banner_pic = s.banner_pic || null;
    const logo_pic = s.logo_pic || null;

    return {
      id: s.seller_id,
      name: s.shop_title || s.shop_url || `Seller ${s.seller_id}`,
      description: stripHtml(s.description),

      // ✅ expose both fields explicitly for UI decisions
      banner_pic,
      logo_pic,

      // ✅ legacy image (now prefers logo, fallback to banner)
      image: logo_pic || banner_pic || SELLER_PLACEHOLDER,

      category: 'Negocio',
      rating: 4.8,
      products: productItems.map((p, i) => ({
        id: p?.sku || `${s.seller_id || 'seller'}-${i}`,
        name: p?.name || '',
        price: p?.price_range?.minimum_price?.final_price?.value ?? 0,
        image: p?.image?.url || PRODUCT_PLACEHOLDER,
      })),
    };
  });
}

export function mapSellers(items) {
  return (items || []).map((item) => {
    const s = item?.seller || {};

    const banner_pic = s.banner_pic || null;
    const logo_pic = s.logo_pic || null;

    return {
      id: s.seller_id,
      name: s.shop_title || s.shop_url || `Seller ${s.seller_id}`,

      // ✅ expose both
      banner_pic,
      logo_pic,

      // ✅ legacy image (now prefers logo, fallback to banner)
      image: logo_pic || banner_pic || 'https://via.placeholder.com/900x900?text=Negocio',

      description: stripHtml(s.description),
    };
  });
}