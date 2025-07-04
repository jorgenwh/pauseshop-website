/**
 * RecentlyViewedCarousel component that creates a horizontal version of the ProductCarousel
 * for displaying recently viewed items
 */
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ExtensionClickHistoryEntry, AmazonProduct } from '../../../lib/types';

interface RecentlyViewedCarouselProps {
    history: ExtensionClickHistoryEntry[];
    onHistoryItemClick: (item: ExtensionClickHistoryEntry) => void;
}

const RecentlyViewedCarousel = ({ history, onHistoryItemClick }: RecentlyViewedCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const updateAnimationRef = useRef<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [itemStyles, setItemStyles] = useState<{ [key: number]: React.CSSProperties }>({});
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Convert history items to AmazonProduct format and reverse to show most recent first
    const carouselProducts = useMemo(() => {
        const recentItems = [...history].reverse();
        return recentItems.map((item, index): AmazonProduct => ({
            id: `history-${item.pauseId}-${index}`,
            amazonAsin: item.clickedProduct.amazonAsin,
            price: typeof item.clickedProduct.price === 'number' ? item.clickedProduct.price : undefined,
            thumbnailUrl: item.clickedProduct.thumbnailUrl,
            productUrl: item.clickedProduct.productUrl,
            position: index,
        }));
    }, [history]);

    const updateItemStyles = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;
        const newStyles: { [key: number]: React.CSSProperties } = {};

        itemRefs.current.forEach((item, index) => {
            if (!item) return;

            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const distanceFromCenter = itemCenter - containerCenter;
            const absoluteDistance = Math.abs(distanceFromCenter);
            
            // Calculate opacity and scale based on distance (horizontal version)
            const maxDistance = containerRect.width / 2;
            const normalizedDistance = Math.min(absoluteDistance / maxDistance, 1);
            
            // Smooth easing function for opacity
            const opacity = 1 - Math.pow(normalizedDistance, 2) * 0.8;
            
            // Subtle scale effect for depth
            const scale = index === selectedIndex ? 1.1 : (1 - normalizedDistance * 0.05);
            
            newStyles[index] = {
                opacity,
                transform: `scale(${scale})`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            };
        });

        setItemStyles(newStyles);
    }, [selectedIndex]);

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
        let targetScroll = container.scrollLeft;
        
        const animate = () => {
            const current = container.scrollLeft;
            const diff = targetScroll - current;
            
            // Apply a very small portion of the difference for ultra-smooth animation
            if (Math.abs(diff) > 0.01) {
                container.scrollLeft = current + diff * 0.08;
                animationId = requestAnimationFrame(animate);
            } else {
                animationId = 0;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            
            let delta = e.deltaY || e.deltaX; // Support both vertical and horizontal scrolling
            if (e.deltaMode === 1) {
                delta *= 40;
            } else if (e.deltaMode === 2) {
                delta *= window.innerWidth;
            }
            
            // Update target scroll position
            const scaledDelta = delta * 0.8;
            targetScroll = Math.max(0, Math.min(targetScroll + scaledDelta, container.scrollWidth - container.clientWidth));
            
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
        if (!container) return;

        const selectedCard = itemRefs.current[selectedIndex];
        if (selectedCard) {
            selectedCard.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
        
        // Update styles after selection change
        setTimeout(updateItemStyles, 100);
    }, [selectedIndex, updateItemStyles]);

    const handleProductSelect = (index: number) => {
        const historyItem = [...history].reverse()[index];
        setSelectedIndex(index);
        onHistoryItemClick(historyItem);
    };

    const getItemSpacing = (index: number) => {
        if (index === selectedIndex) {
            return 'mr-4';
        } else if (index === selectedIndex - 1) {
            return 'mr-4';
        }
        return 'mr-3';
    };

    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="mt-2">
            <div className="flex items-center gap-4">
                {/* History Carousel Container */}
                <div className="flex-1 relative h-[100px] overflow-hidden rounded-lg bg-gray-900">
                <div 
                    ref={scrollContainerRef}
                    className="h-full overflow-x-auto scrollbar-hide py-3"
                    style={{ 
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none',
                        scrollBehavior: 'auto'
                    }}
                >
                    <div className="flex pl-8 pr-12">
                        {carouselProducts.map((product, index) => (
                            <div
                                key={product.id}
                                ref={el => {
                                    itemRefs.current[index] = el;
                                }}
                                data-index={index}
                                className={`
                                    relative cursor-pointer flex-shrink-0
                                    ${index === selectedIndex ? 'z-10' : 'z-0'}
                                    ${getItemSpacing(index)}
                                `}
                                style={itemStyles[index] || {}}
                                onClick={() => handleProductSelect(index)}
                            >
                                <div className={`
                                    relative w-[70px] h-[70px] rounded-lg overflow-hidden bg-white
                                    ${index === selectedIndex 
                                        ? 'ring-[2px] ring-[#30B3A4] shadow-lg shadow-[#30B3A4]/30' 
                                        : 'hover:ring-1 hover:ring-gray-400 hover:shadow-md'
                                    }
                                    transition-all duration-300 ease-out
                                `}>
                                    <img
                                        src={product.thumbnailUrl}
                                        alt={`Recently viewed item ${index + 1}`}
                                        className="w-full h-full object-contain p-1"
                                    />
                                </div>
                            </div>
                        ))}
                        {/* Spacer to ensure last item has enough scroll space */}
                        <div className="w-3 flex-shrink-0" />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewedCarousel;
