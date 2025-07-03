/**
 * Referrer page component
 * Displays the pause screenshot and product results without filtering
 */

import { useEffect, useState } from 'react';
import { AppHeader } from '../components/ui';
import { ScreenshotSection, ProductDisplaySection, ProductCarouselSection } from '../components/sections';
import { TEXT } from '../lib/constants';
import { ExtensionClickHistoryEntry } from '../lib/types';
import {
    useExtensionData,
    useDeepSearch,
    useButtonDimensions,
    useProductSelection
} from '../hooks';

const ReferrerPage = () => {
    const [animateIn, setAnimateIn] = useState(false);
    const [shouldAutoSwitchToDeepSearch, setShouldAutoSwitchToDeepSearch] = useState(false);
    
    // Use custom hooks for data management
    const {
        imageUrl,
        product,
        amazonProducts,
        clickHistory,
        selectedProductIndex: extensionSelectedIndex,
        screenshotError,
        pauseId,
        updateHistoryItem,
        setScreenshotError,
    } = useExtensionData();

    const {
        isRanking,
        rankingResults,
        rankingError,
        rankedProducts,
        resetDeepSearch,
        canPerformDeepSearch,
        handleDeepSearch,
    } = useDeepSearch(product, amazonProducts, imageUrl, pauseId, setScreenshotError);

    const {
        selectedProductIndex,
        showDeepSearchView,
        carouselProducts,
        handleProductSelect,
        handleOriginalItemsClick,
        handleDeepSearchClick,
        resetSelection,
        setSelectedProductIndex,
    } = useProductSelection(amazonProducts, rankedProducts);

    const {
        originalItemsButtonRef,
        deepSearchButtonRef,
        buttonDimensions,
    } = useButtonDimensions(isRanking, rankingResults.length);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateIn(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Sync selected index when extension data changes
    useEffect(() => {
        setSelectedProductIndex(extensionSelectedIndex);
    }, [extensionSelectedIndex, setSelectedProductIndex]);

    // Auto-switch to deep search view after manual execution
    useEffect(() => {
        if (shouldAutoSwitchToDeepSearch && rankedProducts.length > 0) {
            handleDeepSearchClick();
            setShouldAutoSwitchToDeepSearch(false);
        }
    }, [shouldAutoSwitchToDeepSearch, rankedProducts.length, handleDeepSearchClick]);

    const handleHistoryItemClick = async (item: ExtensionClickHistoryEntry) => {
        await updateHistoryItem(item);
        
        // Reset deep search view and auto-switch flag, then scroll to top
        resetSelection();
        resetDeepSearch();
        setShouldAutoSwitchToDeepSearch(false);
        window.scrollTo(0, 0);
    };

    const handleDeepSearchButtonClick = async () => {
        if (rankedProducts.length > 0) {
            // If results already exist, just switch to deep search view
            handleDeepSearchClick();
        } else if (canPerformDeepSearch) {
            // If no results but deep search is possible, execute it and set flag to auto-switch
            setShouldAutoSwitchToDeepSearch(true);
            await handleDeepSearch();
        }
    };

    return (
        <div className={`container mx-auto px-4 py-8 max-w-7xl transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <AppHeader subtitle={TEXT.resultsDescription} className="mb-8" showBrowserExtensionButton={false} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <ScreenshotSection
                    imageUrl={imageUrl}
                    screenshotError={screenshotError}
                    clickHistory={clickHistory}
                    onHistoryItemClick={handleHistoryItemClick}
                />

                <ProductDisplaySection
                    product={product}
                    selectedProduct={carouselProducts[selectedProductIndex]}
                    rankingError={rankingError}
                />

                <ProductCarouselSection
                    amazonProducts={amazonProducts}
                    carouselProducts={carouselProducts}
                    selectedProductIndex={selectedProductIndex}
                    onProductSelect={handleProductSelect}
                    showDeepSearchView={showDeepSearchView}
                    onOriginalItemsClick={handleOriginalItemsClick}
                    onDeepSearchClick={handleDeepSearchButtonClick}
                    isRanking={isRanking}
                    rankedProductsLength={rankedProducts.length}
                    canPerformDeepSearch={canPerformDeepSearch}
                    originalItemsButtonRef={originalItemsButtonRef}
                    deepSearchButtonRef={deepSearchButtonRef}
                    buttonDimensions={buttonDimensions}
                />
            </div>
        </div>
    );
};

export default ReferrerPage;
