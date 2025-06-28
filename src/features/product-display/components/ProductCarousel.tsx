/**
 * ProductCarousel component that displays a vertical list of products
 * with clean, simple selection interface
 */
import { AmazonProduct } from '../../../lib/types';
import { Card } from '../../../components/ui';

interface ProductCarouselProps {
    products: AmazonProduct[];
    currentIndex: number;
    onProductSelect: (product: AmazonProduct, index: number) => void;
}

const ProductCarousel = ({ products, currentIndex, onProductSelect }: ProductCarouselProps) => {

    return (
        <Card className="p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Products ({products.length})</h3>

            <div className="space-y-2">
                {products.map((product, index) => (
                    <div
                        key={product.imageId}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            index === currentIndex 
                                ? 'bg-blue-600 bg-opacity-20 border border-blue-500' 
                                : 'hover:bg-gray-800 border border-transparent'
                        }`}
                        onClick={() => onProductSelect(product, index)}
                    >
                        <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <img
                                src={product.thumbnailUrl}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {index === currentIndex && (
                                <div className="absolute inset-0 border border-blue-400 rounded-md"></div>
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium">
                                Product {index + 1}
                            </div>
                        </div>

                        {index === currentIndex && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ProductCarousel;