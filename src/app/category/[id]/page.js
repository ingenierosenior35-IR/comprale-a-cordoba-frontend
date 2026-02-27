'use client';

import { use } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import { useCategories } from '../../../hooks/useCategories';
import { useProductsByCategory } from '../../../hooks/useProductsByCategory';
import ProductItem from '../../../components/SellerSection/ProductItem';
import '../../../pages/CategoryPage.css';

function CategoryContent({ id }) {

  const { data: catData } = useCategories();

  const categoryIdNum = Number(id);

  const categoryName = (() => {
    const items = catData?.categories?.items || [];
    for (const parent of items) {
      const children = parent?.children || [];
      const match = children.find((c) => Number(c?.id) === categoryIdNum);
      if (match?.name) return match.name;
    }
    return 'Categoría';
  })();

  const { products, isLoading, isError } = useProductsByCategory({
    categoryId: categoryIdNum,
    pageSize: 100,
    productLimit: 12,
    currentPage: 1,
  });

  return (
    <div className="category-page">
      <Navbar />

      <main className="cat">
        <header className="cat-hero">
          <div className="cat-hero__overlay">
            <div className="cat-hero__inner">
              <h1 className="cat-hero__name">{categoryName}</h1>
              <p className="cat-hero__description">
                Explora productos disponibles en la categoría <strong>{categoryName}</strong>.
              </p>
            </div>
          </div>
        </header>

        <section className="cat-products" aria-labelledby="cat-products-title">
          <div className="cat-products__inner">
            <h2 className="cat-products__title" id="cat-products-title">
              Productos disponibles
            </h2>

            {isLoading ? (
              <p className="cat-products__state">Cargando…</p>
            ) : isError ? (
              <p className="cat-products__state">Error cargando productos.</p>
            ) : products.length === 0 ? (
              <p className="cat-products__state">No hay productos en esta categoría.</p>
            ) : (
              <div className="cat-products__grid" role="list" aria-label={`Productos de ${categoryName}`}>
                {products.map((product) => (
                  <ProductItem
                    key={`${product.sellerId}-${product.sku}`}
                    product={product}
                    sellerId={product.sellerId}
                    sellerName={product.sellerName}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer sponsors={[]} />
    </div>
  );
}

export default function CategoryPage({ params }) {
  const { id } = use(params);
  return <CategoryContent id={id} />;
}