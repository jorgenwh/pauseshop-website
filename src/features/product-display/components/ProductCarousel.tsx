/**
 * ProductCarousel component that displays a vertical scrollable list of product thumbnails
 * with clean card design and fade effects
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

        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.top + containerRect.height / 2;
        const newStyles: { [key: number]: React.CSSProperties } = {};

        itemRefs.current.forEach((item, index) => {
            if (!item || index >= products.length) return;

            const rect = item.getBoundingClientRect();
            const itemCenter = rect.top + rect.height / 2;
            const distanceFromCenter = itemCenter - containerCenter;
            const absoluteDistance = Math.abs(distanceFromCenter);
            
            // Calculate opacity and scale based on distance
            const maxDistance = containerRect.height / 2;
            const normalizedDistance = Math.min(absoluteDistance / maxDistance, 1);
            
            // Smooth easing function for opacity
            const opacity = 1 - Math.pow(normalizedDistance, 2) * 0.8;
            
            // Subtle scale effect for depth
            const scale = index === currentIndex ? 1.1 : (1 - normalizedDistance * 0.05);
            
            // Blur effect for distant items
            const blur = normalizedDistance > 0.7 ? 2 : 0;
            
            newStyles[index] = {
                opacity,
                transform: `scale(${scale})`,
                filter: blur > 0 ? `blur(${blur}px)` : 'none',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease-out',
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
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none" />
            
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