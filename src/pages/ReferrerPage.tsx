/**
 * Referrer page component
 * Displays the pause screenshot and product results without filtering
 */

import { useEffect, useState } from 'react';
import { ImagePreview } from '../features/image-upload';
import { ProductList } from '../features/product-display';
import { AppHeader, Card, EmptyState } from '../components/ui';
import { Product } from '../lib/types';
import { TEXT } from '../lib/constants';

interface ReferrerPageProps {
    imageUrl: string | null;
    products: Product[];
    onReset: () => void;
}

const ReferrerPage = ({ imageUrl, products, onReset: _onReset }: ReferrerPageProps) => {
    const [animateIn, setAnimateIn] = useState(false);
    const [loadingDots, setLoadingDots] = useState('.');

    // Trigger animation after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateIn(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Animate loading dots when no image
    useEffect(() => {
        if (!imageUrl) {
            const interval = setInterval(() => {
                setLoadingDots(prev => prev === '...' ? '.' : prev + '.');
            }, 500);
            return () => clearInterval(interval);
        }
    }, [imageUrl]);

    return (
        <div className={`container mx-auto px-4 py-8 max-w-5xl transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <AppHeader subtitle={TEXT.resultsDescription} className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column - Image */}
                <div className="md:col-span-1">
                    <Card className="sticky top-4">
                        <h2 className="text-xl font-semibold mb-4 text-white">Pause Screenshot</h2>
                        {imageUrl ? (
                            <ImagePreview imageUrl={imageUrl} onRemove={() => {}} />
                        ) : (
                            <div className="max-h-[400px] overflow-hidden flex items-center justify-center rounded-lg shadow-md bg-gray-700 min-h-[200px]">
                                <div className="text-center">
                                    <div className="text-xl text-white font-semibold">
                                        Loading{loadingDots}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right column - Products */}
                <div className="md:col-span-2">
                    {products.length > 0 ? (
                        <ProductList products={products} />
                    ) : (
                        <Card>
                            <EmptyState
                                title={TEXT.noProductsFound}
                            />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferrerPage;
