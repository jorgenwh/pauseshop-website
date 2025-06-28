/**
 * Referrer page component
 * Displays the pause screenshot and product results without filtering
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImagePreview } from '../features/image-upload';
import { AppHeader, Card, EmptyState } from '../components/ui';
import { TEXT } from '../lib/constants';
import { getScreenshot } from '../lib/api';
import { decodeReferrerData } from '../lib/referrer';
import { DecodedReferrerData } from '../lib/types';
import { ProductList } from '../features/product-display';

interface ReferrerPageProps {
    onReset: () => void;
}

const ReferrerPage = ({ onReset: _onReset }: ReferrerPageProps) => {
    const [searchParams] = useSearchParams();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [decodedData, setDecodedData] = useState<DecodedReferrerData | null>(null);
    const [animateIn, setAnimateIn] = useState(false);
    const [loadingDots, setLoadingDots] = useState('.');

    useEffect(() => {
        const pauseId = searchParams.get('pauseId');
        const data = searchParams.get('data');

        if (data) {
            const decoded = decodeReferrerData(data);
            setDecodedData(decoded);
        }

        if (pauseId) {
            getScreenshot(pauseId).then(screenshotUrl => {
                if (screenshotUrl) {
                    setImageUrl(screenshotUrl);
                }
            });
        }
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateIn(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!imageUrl) {
            const interval = setInterval(() => {
                setLoadingDots(prev => (prev === '...' ? '.' : prev + '.'));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [imageUrl]);

    return (
        <div className={`container mx-auto px-4 py-8 max-w-5xl transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <AppHeader subtitle={TEXT.resultsDescription} className="mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card className="sticky top-4">
                        <h2 className="text-xl font-semibold mb-4 text-white">Pause Screenshot</h2>
                        {imageUrl ? (
                            <ImagePreview imageUrl={imageUrl} onRemove={() => {}} />
                        ) : (
                            <div className="max-h-[400px] overflow-hidden flex items-center justify-center rounded-lg shadow-md bg-gray-700 min-h-[200px]">
                                <div className="text-center">
                                    <div className="text-xl text-white font-semibold">Loading{loadingDots}</div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <div className="md:col-span-2">
                    {decodedData && decodedData.amazonProducts.length > 0 ? (
                        <ProductList
                            products={decodedData.amazonProducts}
                            productContext={decodedData.productContext}
                            clickedPosition={decodedData.clickedPosition}
                        />
                    ) : (
                        <Card>
                            <EmptyState title={TEXT.noProductsFound} />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferrerPage;
