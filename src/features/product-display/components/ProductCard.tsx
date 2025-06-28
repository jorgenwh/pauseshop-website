/**
 * Component for displaying a product card
 */
import { AmazonProduct } from '../../../lib/types';
import { TEXT } from '../../../lib/constants';
import { Badge, Icon } from '../../../components/ui';

interface ProductCardProps {
    product: AmazonProduct;
    isClicked: boolean;
}

const ProductCard = ({ product, isClicked }: ProductCardProps) => {
    const cardClasses = `
        border rounded-lg p-4 transition-all duration-300 flex items-center gap-4
        ${isClicked ? 'bg-gray-600 border-primary-500 shadow-lg' : 'bg-gray-700 border-gray-600 hover:border-gray-500'}
    `;

    return (
        <div className={cardClasses}>
            <div className="flex-shrink-0">
                <img
                    src={product.thumbnailUrl}
                    alt="Product thumbnail"
                    className="w-24 h-24 object-cover rounded-md"
                />
            </div>
            <div className="flex-grow">
                {isClicked && (
                    <Badge variant="primary" size="sm" className="mb-2">
                        {TEXT.clickedItem}
                    </Badge>
                )}
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        {product.price && (
                            <p className="text-xl font-bold text-white">${product.price.toFixed(2)}</p>
                        )}
                        <p className="text-sm text-gray-400">{product.amazonAsin || 'N/A'}</p>
                    </div>
                    {product.productUrl && (
                         <a
                            href={product.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#30B3A4] hover:text-[#30B3A4]/80 font-medium flex items-center text-sm"
                        >
                            <Icon name="external-link" className="mr-1" size={16} />
                            {TEXT.amazonLinkText}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
