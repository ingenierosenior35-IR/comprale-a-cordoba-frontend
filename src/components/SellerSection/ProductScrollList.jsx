import ProductItem from './ProductItem';
import './ProductScrollList.css';

function ProductScrollList({ products }) {
  return (
    <div className="product-scroll" role="list" aria-label="Productos del negocio">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductScrollList;
