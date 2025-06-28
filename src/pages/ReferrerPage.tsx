/**
 * Referrer page component
 * Displays the pause screenshot and product results without filtering
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImagePreview } from '../features/image-upload';
import { ProductList } from '../features/product-display';
import { AppHeader, Card, EmptyState } from '../components/ui';
import { Product, ReferrerData } from '../lib/types';
import { TEXT } from '../lib/constants';
import { getScreenshot } from '../lib/api';
import { decodeReferrerData } from '../lib/referrer';

interface ReferrerPageProps {
    onReset: () => void;
}

const ReferrerPage = ({ onReset: _onReset }: ReferrerPageProps) => {
    const [searchParams] = useSearchParams();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [referrerData, setReferrerData] = useState<ReferrerData | null>(null);
    const [animateIn, setAnimateIn] = useState(false);
    const [loadingDots, setLoadingDots] = useState('.');

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const pauseId = searchParams.get('pauseId');
        const data = searchParams.get('data');

        if (pauseId) {
            getScreenshot(pauseId).then(screenshotUrl => {
                if (screenshotUrl) {
                    setImageUrl(screenshotUrl);
                }
            });
        }

        if (data) {
            const decodedData = decodeReferrerData(data);
            if (decodedData) {
                setReferrerData(decodedData);
                // Convert referrer products to display products
                const displayProducts: Product[] = decodedData.products.map((product, index) => ({
                    name: `Product ${index + 1}`, // We don't have the original product name in referrer data
                    category: 'Unknown', // We don't have category in referrer data
                    iconCategory: 'shopping', // Default icon
                    price: product.price || 'Price not available',
                    productUrl: product.amazonAsin ? `https://www.amazon.com/dp/${product.amazonAsin}` : '#',
                    thumbnailUrl: product.thumbnailUrl || '',
                    amazonAsin: product.amazonAsin || ''
                }));
                setProducts(displayProducts);
            }
        }
    }, [searchParams]);

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
