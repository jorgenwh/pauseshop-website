/**
 * Referrer page component
 * Displays the pause screenshot and product results without filtering
 */

import { useEffect, useState } from 'react';
import { AppHeader } from '../components/ui';
import { ScreenshotSection, ProductDisplaySection, ProductCarouselSection } from '../components/sections';
import { ExtensionClickHistoryEntry } from '../lib/types';
import { updateExtensionClickHistory } from '../lib/browser-extensions';
import {
    useExtensionData,
    useDeepSearch,
    useButtonDimensions,
    useProductSelection
} from '../hooks';

const ReferrerPage = () => {
    const [animateIn, setAnimateIn] = useState(false);
    const [shouldAutoSwitchToDeepSearch, setShouldAutoSwitchToDeepSearch] = useState(false);
    const [processedDeepSearchSessions, setProcessedDeepSearchSessions] = useState<Set<string>>(new Set());
    
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
        updateClickHistory,
    } = useExtensionData();

    const {
        isRanking,
        rankingResults,
        rankingError,
        rankedProducts,
        resetDeepSearch,
        canPerformDeepSearch,
        handleDeepSearch,
        hasSavedDeepSearchData,
        freshDeepSearchCompleted,
    } = useDeepSearch(product, amazonProducts, imageUrl, pauseId, setScreenshotError, clickHistory);

    const {
        selectedProductIndex,
        showDeepSearchView,
        carouselProducts,
        handleProductSelect,
        handleOriginalItemsClick,
        handleDeepSearchClick,
        resetSelection,
        setSelectedProductIndex,
    } = useProductSelection(amazonProducts, rankedProducts, isRanking, hasSavedDeepSearchData);

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

    // Update click history with deep search results when ranking completes
    useEffect(() => {
        const updateClickHistoryWithDeepSearch = async () => {
            // Only proceed if deep search was freshly completed (not loaded from saved data) and we have results
            if (!freshDeepSearchCompleted || rankedProducts.length === 0 || !pauseId || !product) {
                return;
            }

            // Find the current product group in click history (match by pauseId AND product name)
            const currentSession = clickHistory.find(entry => 
                entry.pauseId === pauseId && 
                entry.productGroup.product.name === product.name
            );
            
            if (!currentSession) {
                console.warn('Current product group not found in click history, cannot update with deep search data');
                return;
            }
            
            // Check if this specific product group already has deep search data
            if (currentSession.hasDeepSearch) {
                console.log('[DeepSearch] This product group already has deep search data, skipping');
                return;
            }

            // Create a unique identifier for this product group (pauseId + product name)
            const productGroupId = `${pauseId}-${product.name}`;
            
            // Check if we've already processed this specific product group's deep search in this session
            if (processedDeepSearchSessions.has(productGroupId)) {
                return;
            }

            console.log(`[DeepSearch] Deep search completed! Updating click history with ${rankedProducts.length} ranked products for session ${pauseId} (product: ${product.name})`);
            console.log('[DeepSearch] Ranked products details:', rankedProducts);
            console.log('[DeepSearch] Amazon products being ranked:', amazonProducts.length, amazonProducts.map(ap => ({ id: ap.id, position: ap.position })));
            console.log('[DeepSearch] Scraped products in history:', currentSession.productGroup.scrapedProducts.length, currentSession.productGroup.scrapedProducts.map(sp => ({ id: sp.id, position: sp.position })));

            // Mark this product group as processed
            setProcessedDeepSearchSessions(prev => new Set(prev).add(productGroupId));

            // Find the current product group in click history
            const updatedHistory = [...clickHistory];
            const currentSessionIndex = updatedHistory.findIndex(entry => 
                entry.pauseId === pauseId && 
                entry.productGroup.product.name === product.name
            );
            
            if (currentSessionIndex === -1) {
                console.warn('Current product group not found in click history, cannot update with deep search data');
                return;
            }

            // Update the session entry with deep search metadata
            const updatedSession = {
                ...currentSession,
                hasDeepSearch: true,
                deepSearchTimestamp: Date.now(),
                productGroup: {
                    ...currentSession.productGroup,
                    scrapedProducts: currentSession.productGroup.scrapedProducts.map(scrapedProduct => {
                        // Find the ranking data for this product by position
                        // Note: rankedProducts have position-based matching, scrapedProducts have id-based matching
                        const rankingData = rankedProducts.find(rankedProduct => 
                            rankedProduct.position === scrapedProduct.position
                        );
                        
                        if (rankingData) {
                            console.log(`[DeepSearch] ✅ Adding ranking data to product ${scrapedProduct.id} (position ${scrapedProduct.position}): rank ${rankingData.rank}, similarity ${rankingData.similarityScore}`);
                            return {
                                ...scrapedProduct,
                                rank: rankingData.rank,
                                similarityScore: rankingData.similarityScore,
                            };
                        } else {
                            console.log(`[DeepSearch] ❌ No ranking data found for product ${scrapedProduct.id} (position ${scrapedProduct.position})`);
                        }
                        
                        return scrapedProduct;
                    }),
                },
            };

            updatedHistory[currentSessionIndex] = updatedSession;

            // Send the updated history back to the extension
            console.log('[DeepSearch] Sending updated click history to extension...');
            const success = await updateExtensionClickHistory(updatedHistory);
            
            if (success) {
                console.log('Successfully updated extension click history with deep search results');
                // Also update local state to reflect the changes
                updateClickHistory(updatedHistory);
            } else {
                console.warn('Failed to update extension click history with deep search results');
            }
        };

        updateClickHistoryWithDeepSearch();
    }, [freshDeepSearchCompleted, rankedProducts, pauseId, product]);

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
            <AppHeader className="mb-8" showBrowserExtensionButton={false} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <ScreenshotSection
                    imageUrl={imageUrl}
                    screenshotError={screenshotError}
                />

                <ProductDisplaySection
                    product={product}
                    selectedProduct={carouselProducts[selectedProductIndex]}
                    rankingError={rankingError}
                    clickHistory={clickHistory}
                    onHistoryItemClick={handleHistoryItemClick}
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
                    hasSavedDeepSearchData={hasSavedDeepSearchData}
                    originalItemsButtonRef={originalItemsButtonRef}
                    deepSearchButtonRef={deepSearchButtonRef}
                    buttonDimensions={buttonDimensions}
                />
            </div>
        </div>
    );
};

export default ReferrerPage;
