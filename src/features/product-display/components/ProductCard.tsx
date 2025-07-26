/**
 * Component for displaying a product card
 */
import { Product } from '../../../lib/types';
import { constructAmazonSearchUrl } from '../../../lib/utils';
import { TEXT } from '../../../lib/constants';
import { Badge, Icon } from '../../../components/ui';
import { trackClickedAmazonLink } from '../../../lib/api/client';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    // Format category name for display
    const formatCategoryName = (category: string) => {
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-medium text-lg text-white">{product.name}</h3>
                    <p className="text-gray-300">
                        {(product.brand && product.brand.toLowerCase() !== 'unknown') ? `${product.brand} • ` : ''}{formatCategoryName(product.category)}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {product.features && product.features.length > 0 && product.features.slice(0, 3).map((feature, i) => (
                    <Badge key={i} size="sm">
                        {feature}
                    </Badge>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-600">
                <a
                    href={constructAmazonSearchUrl(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#30B3A4] hover:text-[#30B3A4]/80 font-medium flex items-center"
                    onClick={() => trackClickedAmazonLink()}
                >
                    <Icon name="external-link" className="mr-1" size={16} />
                    {TEXT.amazonLinkText}
                </a>
            </div>
        </div>
    );
};

export default ProductCard;
