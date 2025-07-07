import React from 'react';
import { ProductCarousel } from '../../features/product-display';
import { Button } from '../ui';
import { AmazonProduct, RankingResult } from '../../lib/types';
import { getDeepSearchButtonState } from '../../lib/utils';
import { LAYOUT_DIMENSIONS } from '../../lib/constants/ui';

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

    const buttonState = getDeepSearchButtonState(
        canPerformDeepSearch,
        hasSavedDeepSearchData,
        isRanking,
        rankedProductsLength
    );

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
                                ? buttonDimensions.originalWidth * LAYOUT_DIMENSIONS.BUTTON_BAR_OFFSET_RATIO
                                : buttonDimensions.deepSearchLeft + buttonDimensions.deepSearchWidth * LAYOUT_DIMENSIONS.BUTTON_BAR_OFFSET_RATIO,
                            width: !showDeepSearchView
                                ? buttonDimensions.originalWidth * LAYOUT_DIMENSIONS.BUTTON_BAR_WIDTH_RATIO
                                : buttonDimensions.deepSearchWidth * LAYOUT_DIMENSIONS.BUTTON_BAR_WIDTH_RATIO
                        }}
                    />
                </div>
            </div>
            <div className="sticky top-4">
                <ProductCarousel
                    key={`${showDeepSearchView ? 'deep-search' : 'original'}`}
                    products={carouselProducts}
                    currentIndex={selectedProductIndex}
                    onProductSelect={onProductSelect}
                />
            </div>
        </div>
    );
};

export default ProductCarouselSection;
