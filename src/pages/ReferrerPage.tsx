/**
 * Referrer page component
 * Displays the pause screenshot and product results without filtering
 */

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ImagePreview } from '../features/image-upload';
import { ProductDisplay } from '../features/product-display';
import { ProductCarousel, RankingResults } from '../features/referrer';
import { AppHeader, Card, Button } from '../components/ui';
import { TEXT } from '../lib/constants';
import { getScreenshot, rankProductsStreaming } from '../lib/api';
import { imageUrlToBase64 as urlToBase64 } from '../lib/utils';
import { decodeReferrerData } from '../lib/referrer';
import { DecodedReferrerData, AmazonProduct, RankingResult, RankingRequest } from '../lib/types';

interface ReferrerPageProps {
    onReset: () => void;
}

const ReferrerPage = ({ onReset: _onReset }: ReferrerPageProps) => {
    const [searchParams] = useSearchParams();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [animateIn, setAnimateIn] = useState(false);
    const [loadingDots, setLoadingDots] = useState('.');
    const [decodedData, setDecodedData] = useState<DecodedReferrerData | null>(null);
    const [selectedProductIndex, setSelectedProductIndex] = useState(0);
    const [isRanking, setIsRanking] = useState(false);
    const [rankingResults, setRankingResults] = useState<RankingResult[]>([]);
    const [rankingError, setRankingError] = useState<string | null>(null);

    const pauseId = searchParams.get('pauseId');

    useEffect(() => {
        const data = searchParams.get('data');

        if (pauseId) {
            getScreenshot(pauseId).then(screenshotUrl => {
                if (screenshotUrl) {
                    setImageUrl(screenshotUrl);
                }
            });
        }

        if (data) {
            const decoded = decodeReferrerData(data);
            if (decoded) {
                setDecodedData(decoded);
                setSelectedProductIndex(decoded.clickedPosition);
            }
        }
    }, [searchParams, pauseId]);

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

    const handleProductSelect = (_product: AmazonProduct, index: number) => {
        setSelectedProductIndex(index);
    };


    const handleDeepSearch = useCallback(async () => {
        if (!decodedData || !decodedData.product) return;

        setIsRanking(true);
        setRankingResults([]);
        setRankingError(null);

        const { product, amazonProducts } = decodedData;

        const callRankApi = async (request: RankingRequest) => {
            return new Promise<void>((resolve, reject) => {
                rankProductsStreaming(
                    request,
                    {
                        onRanking: (result) => {
                            setRankingResults(prev => [...prev, result].sort((a, b) => a.rank - b.rank));
                        },
                        onComplete: () => resolve(),
                        onError: (error) => reject(error),
                    }
                );
            });
        };

        try {
            const thumbnailPromises = amazonProducts.map(async (p) => ({
                id: p.imageId,
                image: await urlToBase64(p.thumbnailUrl),
            }));
            const thumbnails = await Promise.all(thumbnailPromises);

            // --- Attempt 1: Session-first ---
            const initialRequest: RankingRequest = {
                productName: product.name,
                category: product.category,
                pauseId: pauseId ?? undefined,
                thumbnails,
            };

            try {
                await callRankApi(initialRequest);
            } catch (error) {
                if (error instanceof Error && error.message.startsWith('SESSION_IMAGE_UNAVAILABLE')) {
                    // --- Attempt 2: Fallback with original image ---
                    if (imageUrl) {
                        const originalImage = await urlToBase64(imageUrl);
                        const fallbackRequest: RankingRequest = {
                            productName: product.name,
                            category: product.category,
                            originalImage,
                            thumbnails,
                        };
                        await callRankApi(fallbackRequest);
                    } else {
                        throw new Error("Original image not available for fallback.");
                    }
                } else {
                    throw error; // Re-throw other errors
                }
            }
        } catch (error) {
            console.error("Deep Search failed:", error);
            setRankingError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setIsRanking(false);
        }
    }, [decodedData, imageUrl, pauseId]);

    return (
        <div className={`container mx-auto px-4 py-8 max-w-7xl transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <AppHeader subtitle={TEXT.resultsDescription} className="mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Screenshot Section */}
                <div className="lg:col-span-1">
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
                         {decodedData?.product && (
                            <Button
                                onClick={handleDeepSearch}
                                disabled={isRanking}
                                className="w-full mt-4"
                            >
                                {isRanking ? 'Searching...' : 'Deep Search'}
                            </Button>
                        )}
                    </Card>
                </div>

                {/* Product Display Section */}
                <div className="lg:col-span-2">
                    {decodedData && (
                        <div className="space-y-6">
                            <ProductDisplay
                                product={decodedData.product}
                                amazonProduct={decodedData.amazonProducts[selectedProductIndex]}
                            />
                             {rankingError && (
                                <div className="text-red-500 text-center">{rankingError}</div>
                            )}
                            <RankingResults
                                rankings={rankingResults}
                                products={decodedData.amazonProducts}
                                isRanking={isRanking}
                                onProductSelect={handleProductSelect}
                            />
                        </div>
                    )}
                </div>

                {/* Product Carousel Section */}
                <div className="lg:col-span-1 relative">
                    {decodedData && (
                        <>
                            <div className="absolute w-full flex justify-center space-x-4 -top-16 z-10">
                                <Button
                                    variant='primary'
                                >
                                    Original Items
                                </Button>
                                <Button
                                    variant='secondary'
                                >
                                    Deep Search
                                </Button>
                            </div>
                            <div className="sticky top-4">
                                <ProductCarousel
                                    products={decodedData.amazonProducts}
                                    currentIndex={selectedProductIndex}
                                    onProductSelect={handleProductSelect}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReferrerPage;
