import { useState, useEffect } from 'react';
import { AmazonProduct, RankingResult } from '../lib/types';
import { CAROUSEL_CONFIG } from '../lib/constants';

export const useProductSelection = (
    amazonProducts: AmazonProduct[], 
    rankedProducts: (AmazonProduct & RankingResult)[], 
    isRanking?: boolean,
    hasSavedDeepSearchData?: boolean
) => {
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);
    const [showDeepSearchView, setShowDeepSearchView] = useState(false);
    const [wasRanking, setWasRanking] = useState(false);
    const [manualDeepSearchTriggered, setManualDeepSearchTriggered] = useState(false);

    // Track when ranking state changes to automatically switch to deep search view
    useEffect(() => {
        if (wasRanking && !isRanking && rankedProducts.length > 0 && manualDeepSearchTriggered) {
            // Ranking just completed from manual trigger and we have results, switch to deep search view
            setShowDeepSearchView(true);
            setSelectedProductIndex(0);
            setManualDeepSearchTriggered(false); // Reset the flag
        }
        setWasRanking(isRanking || false);
    }, [isRanking, rankedProducts.length, wasRanking, manualDeepSearchTriggered]);

    // Reset to original view when session changes (when saved data loads or products change)
    useEffect(() => {
        if (hasSavedDeepSearchData || rankedProducts.length === 0) {
            // Always start with original items view when clicking different history items
            setShowDeepSearchView(false);
            // Reset to first item when switching between different product groups
            setSelectedProductIndex(0);
        }
    }, [hasSavedDeepSearchData, rankedProducts.length]);

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
        if (rankedProducts.length > 0 && !isRanking) {
            // Results already exist and not ranking, switch immediately
            setShowDeepSearchView(true);
            setSelectedProductIndex(0);
        } else {
            // Either no results or currently ranking - mark as manual trigger for later auto-switch
            setManualDeepSearchTriggered(true);
        }
    };

    // Determine which products to show in carousel
    const carouselProducts = showDeepSearchView ? rankedProducts : (amazonProducts.slice(0, CAROUSEL_CONFIG.itemLimit) || []);

    const resetSelection = () => {
        setShowDeepSearchView(false);
        setSelectedProductIndex(0);
        setManualDeepSearchTriggered(false); // Clear manual trigger flag when resetting
    };

    const resetViewOnly = () => {
        setShowDeepSearchView(false);
        setManualDeepSearchTriggered(false); // Clear manual trigger flag when resetting
    };

    return {
        selectedProductIndex,
        showDeepSearchView,
        carouselProducts,
        handleProductSelect,
        handleOriginalItemsClick,
        handleDeepSearchClick,
        resetSelection,
        resetViewOnly,
        setSelectedProductIndex,
    };
};
