import React from 'react';
import { ProductDisplay } from '../../features/product-display';
import AmazonAssociateDisclaimer from '../ui/AmazonAssociateDisclaimer';
import { Product, AmazonProduct } from '../../lib/types';

interface ProductDisplaySectionProps {
    product: Product | null;
    selectedProduct: AmazonProduct | undefined;
    rankingError: string | null;
}

const ProductDisplaySection: React.FC<ProductDisplaySectionProps> = ({
    product,
    selectedProduct,
    rankingError,
}) => {
    if (!product) return null;

    return (
        <div className="lg:col-span-2">
            <div>
                <ProductDisplay
                    product={product}
                    amazonProduct={selectedProduct!}
                />
                <AmazonAssociateDisclaimer />
                {rankingError && (
                    <div className="text-red-500 text-center mt-6">{rankingError}</div>
                )}
            </div>
        </div>
    );
};

export default ProductDisplaySection;
