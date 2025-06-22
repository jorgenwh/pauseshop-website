/**
 * Component for displaying a product card
 */
import { Product } from '../lib/types';
import { constructAmazonSearchUrl } from '../lib/utils';
import { TEXT } from '../lib/constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const confidencePercentage = Math.round(product.confidence * 100);
  
  return (
    <div className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg text-white">{product.name}</h3>
          <p className="text-gray-300">
            {product.brand || TEXT.unknownBrand} • {product.category}
          </p>
        </div>
        <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {confidencePercentage}%
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {product.features && product.features.length > 0 && product.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded">
            {feature}
          </span>
        ))}
        {product.primaryColor && (
          <span className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded flex items-center">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: product.primaryColor }}></div>
            {product.primaryColor}
          </span>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-600">
        <a 
          href={constructAmazonSearchUrl(product)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#30B3A4] hover:text-[#30B3A4]/80 font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {TEXT.amazonLinkText}
        </a>
      </div>
    </div>
  );
};

export default ProductCard;