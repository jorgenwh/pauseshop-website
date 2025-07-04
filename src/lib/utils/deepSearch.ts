/**
 * Deep search utility functions
 */

interface DeepSearchButtonState {
    variant: 'secondary' | 'glow' | 'glow-grayscale';
    disabled: boolean;
    loading: boolean;
    text: string;
}

/**
 * Determines the state of the deep search button based on various conditions
 */
export const getDeepSearchButtonState = (
    canPerformDeepSearch: boolean,
    hasSavedDeepSearchData: boolean,
    isRanking: boolean,
    rankedProductsLength: number
): DeepSearchButtonState => {
    // No image available mode: no image and no saved ranked history
    if (!canPerformDeepSearch && !hasSavedDeepSearchData) {
        return {
            variant: 'secondary',
            disabled: true,
            loading: false,
            text: 'No Image Available'
        };
    }
    
    // Loading state when ranking is in progress
    if (isRanking) {
        return {
            variant: 'glow-grayscale',
            disabled: true,
            loading: false,
            text: 'Deep Search'
        };
    }
    
    // Results available mode: ranked results exist (from current session or saved history)
    if (rankedProductsLength > 0 || hasSavedDeepSearchData) {
        return {
            variant: 'glow',
            disabled: false,
            loading: false,
            text: 'Deep Search'
        };
    }
    
    // Deep search available mode: has image but no saved ranked data
    if (canPerformDeepSearch && !hasSavedDeepSearchData) {
        return {
            variant: 'secondary',
            disabled: false,
            loading: false,
            text: 'Deep Search'
        };
    }
    
    // Fallback (should not reach here normally)
    return {
        variant: 'secondary',
        disabled: false,
        loading: false,
        text: 'Deep Search'
    };
};

/**
 * Checks if deep search results are available for a given session
 */
export const hasDeepSearchResults = (
    rankingResults: unknown[],
    hasSavedData: boolean
): boolean => {
    return rankingResults.length > 0 || hasSavedData;
};