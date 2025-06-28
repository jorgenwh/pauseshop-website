/**
 * ProductCarousel component that displays a scrollable carousel of products
 * with current, previous, and next products
 */
import { useEffect, useRef, useState } from 'react';
import { AmazonProduct } from '../../../lib/types';
import { Card } from '../../../components/ui';

interface ProductCarouselProps {
    products: AmazonProduct[];
    currentIndex: number;
    onProductSelect: (product: AmazonProduct, index: number) => void;
}

const ProductCarousel = ({ products, currentIndex, onProductSelect }: ProductCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollButtons);
            return () => container.removeEventListener('scroll', updateScrollButtons);
        }
    }, [products]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 240; // Width of one card plus gap
            const newScrollLeft = scrollContainerRef.current.scrollLeft + 
                (direction === 'left' ? -scrollAmount : scrollAmount);
            
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const getItemClass = (index: number) => {
        if (index === currentIndex) {
            return 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800';
        }
        return 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-2 hover:ring-offset-gray-800';
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">All Products</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                        aria-label="Scroll left"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="p-2 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                        aria-label="Scroll right"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product, index) => (
                    <div
                        key={product.imageId}
                        className={`flex-shrink-0 w-56 cursor-pointer transition-all duration-200 ${getItemClass(index)}`}
                        onClick={() => onProductSelect(product, index)}
                    >
                        <div className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-all duration-200 hover:shadow-lg">
                            <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                                <img
                                    src={product.thumbnailUrl}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {product.price && (
                                    <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-semibold">
                                        ${product.price.toFixed(2)}
                                    </div>
                                )}
                                {index === currentIndex && (
                                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg"></div>
                                )}
                            </div>
                            
                            <div className="text-center">
                                <div className="text-sm text-gray-300 mb-1">
                                    Product {index + 1}
                                </div>
                                {product.amazonAsin && (
                                    <div className="text-xs text-gray-500 font-mono">
                                        {product.amazonAsin}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-center text-sm text-gray-400">
                {products.length} products found • {currentIndex + 1} of {products.length} selected
            </div>
        </Card>
    );
};

export default ProductCarousel;