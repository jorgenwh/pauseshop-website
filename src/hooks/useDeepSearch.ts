import { useState, useEffect, useCallback } from 'react';
import { rankProductsStreaming } from '../lib/api';
import { imageUrlToBase64 as urlToBase64 } from '../lib/utils';
import { AmazonProduct, RankingResult, RankingRequest, Product, ExtensionClickHistoryEntry } from '../lib/types';

interface DeepSearchState {
    isRanking: boolean;
    rankingResults: RankingResult[];
    rankingError: string | null;
    deepSearchAttempted: boolean;
    deepSearchResultsReady: boolean;
    hasAutoExecuted: boolean; // Track if deep search was auto-executed on initial load
    hasSavedDeepSearchData: boolean; // Track if current session has saved deep search data
    freshDeepSearchCompleted: boolean; // Track if deep search was just completed (not loaded from saved data)
}

export const useDeepSearch = (
    product: Product | null,
    amazonProducts: AmazonProduct[],
    imageUrl: string | null,
    pauseId: string | null,
    onScreenshotError?: (error: string) => void,
    clickHistory: ExtensionClickHistoryEntry[] = [] // Add click history parameter
) => {
    const [state, setState] = useState<DeepSearchState>({
        isRanking: false,
        rankingResults: [],
        rankingError: null,
        deepSearchAttempted: false,
        deepSearchResultsReady: false,
        hasAutoExecuted: false,
        hasSavedDeepSearchData: false,
        freshDeepSearchCompleted: false,
    });

    const resetDeepSearch = () => {
        setState({
            isRanking: false,
            rankingResults: [],
            rankingError: null,
            deepSearchAttempted: false,
            deepSearchResultsReady: false,
            hasAutoExecuted: true, // Set to true to prevent auto-execution after reset
            hasSavedDeepSearchData: false,
            freshDeepSearchCompleted: false,
        });
    };

    // Check for saved deep search data when session or history changes
    useEffect(() => {
        if (!pauseId || !product || !clickHistory.length) {
            setState(prev => ({ 
                ...prev, 
                hasSavedDeepSearchData: false,
                freshDeepSearchCompleted: false // Reset when session changes
            }));
            return;
        }

        // Find the current session in click history
        const currentSession = clickHistory.find(entry => 
            entry.pauseId === pauseId && 
            entry.productGroup.product.name === product.name
        );

        if (currentSession?.hasDeepSearch) {
            // Load saved ranking data from the session's scraped products
            const savedRankingResults: RankingResult[] = [];
            
            currentSession.productGroup.scrapedProducts.forEach(scrapedProduct => {
                if (scrapedProduct.rank !== undefined && scrapedProduct.similarityScore !== undefined) {
                    savedRankingResults.push({
                        id: String(scrapedProduct.position),
                        rank: scrapedProduct.rank,
                        similarityScore: scrapedProduct.similarityScore,
                    });
                }
            });

            if (savedRankingResults.length > 0) {
                console.log(`[DeepSearch] Found saved deep search data for session ${pauseId}, loading ${savedRankingResults.length} ranked products`);
                setState(prev => ({
                    ...prev,
                    rankingResults: savedRankingResults.sort((a, b) => a.rank - b.rank),
                    hasSavedDeepSearchData: true,
                    deepSearchResultsReady: true,
                    deepSearchAttempted: true,
                    freshDeepSearchCompleted: false, // This is loaded data, not freshly completed
                }));
                return;
            }
        }

        // No saved data found - reset flags
        setState(prev => ({ 
            ...prev, 
            hasSavedDeepSearchData: false,
            freshDeepSearchCompleted: false 
        }));
    }, [pauseId, product, clickHistory]);

    const handleDeepSearch = useCallback(async () => {
        if (!product) return;

        setState(prev => ({
            ...prev,
            isRanking: true,
            rankingResults: [],
            rankingError: null,
            deepSearchAttempted: true,
            deepSearchResultsReady: false,
        }));

        const startTime = Date.now();

        const callRankApi = async (request: RankingRequest) => {
            return new Promise<void>((resolve, reject) => {
                rankProductsStreaming(
                    request,
                    {
                        onRanking: (result) => {
                            setState(prev => ({
                                ...prev,
                                rankingResults: [...prev.rankingResults, result].sort((a, b) => a.rank - b.rank)
                            }));
                        },
                        onComplete: () => resolve(),
                        onError: (error) => reject(error),
                    }
                );
            });
        };

        try {
            const thumbnailPromises = amazonProducts.map(async (p: AmazonProduct) => ({
                id: String(p.position),
                image: await urlToBase64(p.thumbnailUrl),
            }));
            const thumbnails = await Promise.all(thumbnailPromises);

            // --- Attempt 1: Session-first ---
            const initialRequest: RankingRequest = {
                productName: product.name,
                category: product.category,
                pauseId: pauseId ?? undefined,
                thumbnails,
            };

            try {
                await callRankApi(initialRequest);
            } catch (error) {
                if (error instanceof Error && error.message.startsWith('SESSION_IMAGE_UNAVAILABLE')) {
                    // --- Attempt 2: Fallback with original image ---
                    if (imageUrl) {
                        const originalImage = await urlToBase64(imageUrl);
                        const fallbackRequest: RankingRequest = {
                            productName: product.name,
                            category: product.category,
                            originalImage,
                            thumbnails,
                        };
                        await callRankApi(fallbackRequest);
                    } else {
                        if (onScreenshotError) {
                            onScreenshotError("Saved screenshot has expired. Please pause the video again.");
                        } else {
                            setState(prev => ({
                                ...prev,
                                rankingError: "Saved screenshot has expired. Please pause the video again."
                            }));
                        }
                        return;
                    }
                } else {
                    throw error; // Re-throw other errors
                }
            }
        } catch (error) {
            console.error("Deep Search failed:", error);
            setState(prev => ({
                ...prev,
                rankingError: error instanceof Error ? error.message : "An unknown error occurred."
            }));
        } finally {
            // Calculate remaining time to reach 5 seconds
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 5000 - elapsedTime);

            // Wait for the remaining time before showing results
            setTimeout(() => {
                setState(prev => ({
                    ...prev,
                    isRanking: false,
                    deepSearchResultsReady: true,
                    freshDeepSearchCompleted: true, // Mark as freshly completed
                }));
            }, remainingTime);
        }
    }, [product, amazonProducts, imageUrl, pauseId, onScreenshotError]);

    // Create ranked products array from ranking results
    const rankedProducts = state.rankingResults
        .map((ranking: RankingResult) => {
            const rankedProduct = amazonProducts.find((p: AmazonProduct) => String(p.position) === ranking.id);
            return rankedProduct ? { ...rankedProduct, ...ranking } : null;
        })
        .filter((p): p is (AmazonProduct & RankingResult) => p !== null)
        .sort((a, b) => a.rank - b.rank);

    // Check if deep search can be performed (needs product, amazon products, and image)
    const canPerformDeepSearch = !!(product && amazonProducts.length > 0 && imageUrl);

    // Automatically trigger deep search ONCE when decoded data is available on initial page load
    useEffect(() => {
        if (canPerformDeepSearch && !state.isRanking && state.rankingResults.length === 0 && !state.deepSearchAttempted && !state.hasAutoExecuted && !state.hasSavedDeepSearchData) {
            setState(prev => ({ ...prev, hasAutoExecuted: true }));
            handleDeepSearch();
        }
    }, [canPerformDeepSearch, handleDeepSearch, state.isRanking, state.rankingResults.length, state.deepSearchAttempted, state.hasAutoExecuted, state.hasSavedDeepSearchData]);

    return {
        ...state,
        rankedProducts,
        handleDeepSearch,
        resetDeepSearch,
        canPerformDeepSearch,
    };
};
