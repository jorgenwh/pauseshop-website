/**
 * Component for displaying a product card
 */
import { Product } from '../../../lib/types';
import { constructAmazonSearchUrl } from '../../../lib/utils';
import { TEXT } from '../../../lib/constants';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const confidencePercentage = Math.round(product.confidence * 10);
    
    // Format category name for display
    const formatCategoryName = (category: string) => {
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };
    
    // Determine accuracy level and colors (server outputs only: 70, 80, 90, 100)
    const getAccuracyStyle = (percentage: number) => {
        if (percentage >= 90) {
            // 90% and 100% - Highest accuracy
            return {
                bgColor: 'bg-emerald-500/20',
                textColor: 'text-emerald-400',
                borderColor: 'border-emerald-500/30'
            };
        } else {
            // 70% and 80% - Good accuracy
            return {
                bgColor: 'bg-yellow-500/20',
                textColor: 'text-yellow-400',
                borderColor: 'border-yellow-500/30'
            };
        }
    };

    const accuracyStyle = getAccuracyStyle(confidencePercentage);

    return (
        <div className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-lg text-white">{product.name}</h3>
                    <p className="text-gray-300">
                        {(product.brand && product.brand.toLowerCase() !== 'unknown') ? `${product.brand} • ` : ''}{formatCategoryName(product.category)}
                    </p>
                </div>
                <div className={`${accuracyStyle.bgColor} ${accuracyStyle.textColor} border ${accuracyStyle.borderColor} px-3 py-2 rounded-lg flex items-center gap-2 min-w-[100px] justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    <div className="text-center">
                        <div className="text-xs font-medium opacity-75">{TEXT.accuracyLabel}</div>
                        <div className="text-sm font-bold">{confidencePercentage}%</div>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {product.features && product.features.length > 0 && product.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-1 rounded">
                        {feature}
                    </span>
                ))}
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
