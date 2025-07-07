/**
 * ProductCarousel component that displays a vertical scrollable list of product thumbnails
 * with clean card design
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { AmazonProduct } from '../../../lib/types';

interface ProductCarouselProps {
    products: AmazonProduct[];
    currentIndex: number;
    onProductSelect: (product: AmazonProduct, index: number) => void;
}

const ProductCarousel = ({ products, currentIndex, onProductSelect }: ProductCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const updateAnimationRef = useRef<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [itemStyles, setItemStyles] = useState<{ [key: number]: React.CSSProperties }>({});
    
    const updateItemStyles = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container || !products.length) return;

        const newStyles: { [key: number]: React.CSSProperties } = {};

        itemRefs.current.forEach((item, index) => {
            if (!item || index >= products.length) return;

            // Scale effect for selected card only
            const scale = index === currentIndex ? 1.1 : 1.0;
            
            newStyles[index] = {
                transform: `scale(${scale})`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            };
        });

        setItemStyles(newStyles);
    }, [currentIndex, products.length]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                updateAnimationRef.current = requestAnimationFrame(() => {
                    updateItemStyles();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial update
        updateItemStyles();

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (updateAnimationRef.current) {
                cancelAnimationFrame(updateAnimationRef.current);
            }
        };
    }, [updateItemStyles]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animationId: number;
        let targetScroll = container.scrollTop;
        
        const animate = () => {
            const current = container.scrollTop;
            const diff = targetScroll - current;
            
            // Apply a very small portion of the difference for ultra-smooth animation
            if (Math.abs(diff) > 0.01) {
                container.scrollTop = current + diff * 0.08; // Much smaller steps
                animationId = requestAnimationFrame(animate);
            } else {
                animationId = 0;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            let delta = e.deltaY;
            if (e.deltaMode === 1) {
                delta *= 40;
            } else if (e.deltaMode === 2) {
                delta *= window.innerHeight;
            }
            
            // Update target scroll position
            const scaledDelta = delta * 0.8;
            targetScroll = Math.max(0, Math.min(targetScroll + scaledDelta, container.scrollHeight - container.clientHeight));
            
            // Start animation if not already running
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            container.removeEventListener('wheel', handleWheel);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || !products.length) return;

        const selectedCard = itemRefs.current[currentIndex];
        if (selectedCard && currentIndex >= 0 && currentIndex < products.length) {
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Update styles after selection change
        setTimeout(updateItemStyles, 100);
    }, [currentIndex, updateItemStyles, products.length]);

    const getItemSpacing = (index: number) => {
        if (index === currentIndex - 1) {
            return 'mb-8';
        } else if (index === currentIndex) {
            return 'mb-8';
        }
        return 'mb-3';
    };

    return (
        <div className="relative h-[580px] overflow-hidden rounded-lg bg-gray-900">
            <div 
                ref={scrollContainerRef}
                className="h-full overflow-y-auto scrollbar-hide px-4"
                style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    scrollBehavior: 'auto' // Disable native smooth scrolling
                }}
            >
                <div className="py-12">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            ref={el => {
                                itemRefs.current[index] = el;
                            }}
                            data-index={index}
                            className={`
                                relative cursor-pointer
                                ${index === currentIndex ? 'z-10' : 'z-0'}
                                ${getItemSpacing(index)}
                            `}
                            style={itemStyles[index] || {}}
                            onClick={() => onProductSelect(product, index)}
                        >
                            <div className={`
                                relative w-full h-[180px] rounded-lg overflow-hidden bg-white
                                ${index === currentIndex 
                                    ? 'ring-[3px] ring-[#30B3A4] shadow-xl shadow-[#30B3A4]/30' 
                                    : 'hover:ring-1 hover:ring-gray-400 hover:shadow-lg'
                                }
                                transition-all duration-300 ease-out
                            `}>
                                <img
                                    src={product.thumbnailUrl}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCarousel;