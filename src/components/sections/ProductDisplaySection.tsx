import React from 'react';
import { ProductDisplay, RecentlyViewedCarousel } from '../../features/product-display';
import AmazonAssociateDisclaimer from '../ui/AmazonAssociateDisclaimer';
import { Product, AmazonProduct, ExtensionClickHistoryEntry } from '../../lib/types';

interface ProductDisplaySectionProps {
    product: Product | null;
    selectedProduct: AmazonProduct | undefined;
    rankingError: string | null;
    clickHistory: ExtensionClickHistoryEntry[];
    onHistoryItemClick: (item: ExtensionClickHistoryEntry) => void;
}

const ProductDisplaySection: React.FC<ProductDisplaySectionProps> = ({
    product,
    selectedProduct,
    rankingError,
    clickHistory,
    onHistoryItemClick,
}) => {
    if (!product) return null;

    return (
        <div className="lg:col-span-2">
            <div>
                <ProductDisplay
                    product={product}
                    amazonProduct={selectedProduct!}
                />
                {rankingError && (
                    <div className="text-red-500 text-center mt-6">{rankingError}</div>
                )}
                {clickHistory && clickHistory.length > 0 && (
                    <RecentlyViewedCarousel 
                        history={clickHistory} 
                        onHistoryItemClick={onHistoryItemClick} 
                    />
                )}
                <AmazonAssociateDisclaimer />
            </div>
        </div>
    );
};

export default ProductDisplaySection;
