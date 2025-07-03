import React from 'react';
import { ProductCarousel } from '../../features/product-display';
import { Button } from '../ui';
import { AmazonProduct, RankingResult } from '../../lib/types';

interface ProductCarouselSectionProps {
    amazonProducts: AmazonProduct[];
    carouselProducts: (AmazonProduct | (AmazonProduct & RankingResult))[];
    selectedProductIndex: number;
    onProductSelect: (product: AmazonProduct, index: number) => void;
    showDeepSearchView: boolean;
    onOriginalItemsClick: () => void;
    onDeepSearchClick: () => void;
    isRanking: boolean;
    rankedProductsLength: number;
    canPerformDeepSearch: boolean;
    hasSavedDeepSearchData: boolean;
    originalItemsButtonRef: React.RefObject<HTMLButtonElement | null>;
    deepSearchButtonRef: React.RefObject<HTMLButtonElement | null>;
    buttonDimensions: {
        originalWidth: number;
        deepSearchWidth: number;
        deepSearchLeft: number;
    };
}

const ProductCarouselSection: React.FC<ProductCarouselSectionProps> = ({
    amazonProducts,
    carouselProducts,
    selectedProductIndex,
    onProductSelect,
    showDeepSearchView,
    onOriginalItemsClick,
    onDeepSearchClick,
    isRanking,
    rankedProductsLength,
    canPerformDeepSearch,
    hasSavedDeepSearchData,
    originalItemsButtonRef,
    deepSearchButtonRef,
    buttonDimensions,
}) => {
    if (amazonProducts.length === 0) return null;

    // Determine deep search button state
    const getDeepSearchButtonState = () => {
        // No image available mode: no image and no saved ranked history
        if (!canPerformDeepSearch && !hasSavedDeepSearchData) {
            return {
                variant: 'secondary' as const,
                disabled: true,
                loading: false,
                text: 'No Image Available'
            };
        }
        
        // Loading state when ranking is in progress
        if (isRanking) {
            return {
                variant: 'glow-grayscale' as const,
                disabled: true,
                loading: true,
                text: 'Deep Search'
            };
        }
        
        // Results available mode: ranked results exist (from current session or saved history)
        if (rankedProductsLength > 0 || hasSavedDeepSearchData) {
            return {
                variant: 'glow' as const,
                disabled: false,
                loading: false,
                text: 'Deep Search'
            };
        }
        
        // Deep search available mode: has image but no saved ranked data
        if (canPerformDeepSearch && !hasSavedDeepSearchData) {
            return {
                variant: 'secondary' as const,
                disabled: false,
                loading: false,
                text: 'Deep Search'
            };
        }
        
        // Fallback (should not reach here normally)
        return {
            variant: 'secondary' as const,
            disabled: false,
            loading: false,
            text: 'Deep Search'
        };
    };

    const buttonState = getDeepSearchButtonState();

    return (
        <div className="lg:col-span-1 relative">
            <div className="absolute w-full flex justify-center -top-16 z-10">
                <div className="relative flex space-x-4">
                    <Button
                        ref={originalItemsButtonRef}
                        variant="secondary"
                        onClick={onOriginalItemsClick}
                        className="relative"
                    >
                        Original Items
                    </Button>
                    <Button
                        ref={deepSearchButtonRef}
                        variant={buttonState.variant}
                        onClick={onDeepSearchClick}
                        disabled={buttonState.disabled}
                        loading={buttonState.loading}
                        className="relative"
                    >
                        {buttonState.text}
                    </Button>
                    {/* Animated light bar */}
                    <div
                        className="absolute -bottom-3 h-1 bg-gray-300 rounded-full transition-all duration-500 ease-out"
                        style={{
                            left: !showDeepSearchView
                                ? buttonDimensions.originalWidth * 0.1 // 10% offset to center 80% width bar
                                : buttonDimensions.deepSearchLeft + buttonDimensions.deepSearchWidth * 0.1,
                            width: !showDeepSearchView
                                ? buttonDimensions.originalWidth * 0.8 // 80% of button width
                                : buttonDimensions.deepSearchWidth * 0.8
                        }}
                    />
                </div>
            </div>
            <div className="sticky top-4">
                <ProductCarousel
                    key={showDeepSearchView ? 'deep-search' : 'original'}
                    products={carouselProducts}
                    currentIndex={selectedProductIndex}
                    onProductSelect={onProductSelect}
                />
            </div>
        </div>
    );
};

export default ProductCarouselSection;
