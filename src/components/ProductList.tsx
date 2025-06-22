/**
 * Component for displaying a list of products
 */
import { Product } from '../lib/types';
import ProductCard from './ProductCard';
import { TEXT } from '../lib/constants';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">{TEXT.productsTitle}</h2>
        <span className="bg-[#30B3A4]/10 text-[#30B3A4] text-xs font-semibold px-3 py-1 rounded-full">
          {TEXT.productsFoundText(products.length)}
        </span>
      </div>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;