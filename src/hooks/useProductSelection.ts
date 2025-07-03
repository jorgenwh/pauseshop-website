import { useState } from 'react';
import { AmazonProduct, RankingResult } from '../lib/types';
import { CAROUSEL_CONFIG } from '../lib/constants';

export const useProductSelection = (amazonProducts: AmazonProduct[], rankedProducts: (AmazonProduct & RankingResult)[]) => {
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);
    const [showDeepSearchView, setShowDeepSearchView] = useState(false);

    const handleProductSelect = (product: AmazonProduct, index: number) => {
        // If we're in deep search view and the product is clicked from RankingResults,
        // we need to find its index in the ranked products array
        if (showDeepSearchView && rankedProducts.some(p => p.id === product.id)) {
            const rankedIndex = rankedProducts.findIndex(p => p.id === product.id);
            if (rankedIndex !== -1) {
                setSelectedProductIndex(rankedIndex);
                return;
            }
        }

        // For original view or direct carousel clicks, use the provided index
        setSelectedProductIndex(index);
    };

    const handleOriginalItemsClick = () => {
        setShowDeepSearchView(false);
        setSelectedProductIndex(0);
    };

    const handleDeepSearchClick = () => {
        if (rankedProducts.length > 0) {
            setShowDeepSearchView(true);
            setSelectedProductIndex(0);
        }
    };

    // Determine which products to show in carousel
    const carouselProducts = showDeepSearchView ? rankedProducts : (amazonProducts.slice(0, CAROUSEL_CONFIG.itemLimit) || []);

    const resetSelection = () => {
        setShowDeepSearchView(false);
        setSelectedProductIndex(0);
    };

    return {
        selectedProductIndex,
        showDeepSearchView,
        carouselProducts,
        handleProductSelect,
        handleOriginalItemsClick,
        handleDeepSearchClick,
        resetSelection,
        setSelectedProductIndex,
    };
};
