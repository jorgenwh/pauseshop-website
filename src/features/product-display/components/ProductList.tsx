/**
 * Component for displaying a list of products
 */
import { Product } from '../../../lib/types';
import ProductCard from './ProductCard';
import { TEXT } from '../../../lib/constants';
import { Card, Badge } from '../../../components/ui';

interface ProductListProps {
    products: Product[];
}

const ProductList = ({ products }: ProductListProps) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">{TEXT.productsTitle}</h2>
                <Badge variant="primary" rounded>
                    {TEXT.productsFoundText(products.length)}
                </Badge>
            </div>

            <div className="space-y-4">
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </Card>
    );
};

export default ProductList;
