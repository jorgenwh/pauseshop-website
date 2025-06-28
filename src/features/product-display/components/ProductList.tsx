/**
 * Component for displaying a list of products
 */
import { AmazonProduct, ProductContext } from '../../../lib/types';
import ProductCard from './ProductCard';
import { TEXT } from '../../../lib/constants';
import { Card, Badge, Icon } from '../../../components/ui';

interface ProductListProps {
    products: AmazonProduct[];
    productContext?: ProductContext;
    clickedPosition: number;
}

const ProductList = ({ products, productContext, clickedPosition }: ProductListProps) => {
    if (products.length === 0) {
        return null;
    }

    const formatCategoryName = (category: string) => {
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-6">
            {productContext && (
                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{productContext.name}</h2>
                            <p className="text-gray-300">
                                {(productContext.brand && productContext.brand.toLowerCase() !== 'unknown') ? `${productContext.brand} • ` : ''}{formatCategoryName(productContext.category)}
                            </p>
                        </div>
                        <Badge
                            variant={productContext.confidence >= 0.9 ? 'success' : 'warning'}
                            className="flex items-center gap-2 min-w-[100px] justify-center"
                        >
                            <Icon name="check" size={16} />
                            <div className="text-center">
                                <div className="text-xs font-medium opacity-75">{TEXT.accuracyLabel}</div>
                                <div className="text-sm font-bold">{Math.round(productContext.confidence * 100)}%</div>
                            </div>
                        </Badge>
                    </div>
                    {productContext.features && productContext.features.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {productContext.features.slice(0, 5).map((feature, i) => (
                                <Badge key={i} size="sm">
                                    {feature}
                                </Badge>
                            ))}
                        </div>
                    )}
                </Card>
            )}

            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">{TEXT.productsTitle}</h2>
                    <Badge variant="primary" rounded>
                        {TEXT.productsFoundText(products.length)}
                    </Badge>
                </div>

                <div className="space-y-4">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.imageId || index}
                            product={product}
                            isClicked={index === clickedPosition}
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ProductList;
