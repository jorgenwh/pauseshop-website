/**
 * Results page component
 * Displays the uploaded image and product results
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePreview } from '../features/image-upload';
import { ProductList } from '../features/product-display';
import { Product } from '../lib/types';
import { TEXT } from '../lib/constants';

interface ResultsPageProps {
    imageUrl: string | null;
    products: Product[];
    onReset: () => void;
}

const ResultsPage = ({ imageUrl, products, onReset }: ResultsPageProps) => {
    const navigate = useNavigate();
    const [animateIn, setAnimateIn] = useState(false);

    // If there's no image, redirect back to the upload page
    useEffect(() => {
        if (!imageUrl) {
            navigate('/');
        } else {
            // Trigger animation after component mounts
            const timer = setTimeout(() => {
                setAnimateIn(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [imageUrl, navigate]);

    const handleNewSearch = () => {
        onReset();
        navigate('/');
    };

    if (!imageUrl) {
        return null;
    }
    
    // Count products by category for summary
    const categoryCount = products.reduce((acc, product) => {
        const category = product.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className={`container mx-auto px-4 py-8 max-w-5xl transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-4xl font-bold mb-2 text-center">
                <span className="text-white">Pause</span>
                <span className="text-[#30B3A4]">Shop</span>
            </h1>
            <p className="text-center text-gray-400 mb-8 max-w-lg mx-auto">
                {TEXT.resultsDescription}
            </p>
            
            {/* Results summary */}
            <div className="mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className="text-lg text-white">
                        <span className="font-bold text-[#30B3A4]">{products.length}</span> {TEXT.productsFoundSummary(products.length)}
                    </p>
                    {Object.keys(categoryCount).length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {Object.entries(categoryCount).map(([category, count]) => (
                                <span key={category} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
                                    {category}: {count}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column - Image */}
                <div className="md:col-span-1">
                    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 sticky top-4">
                        <h2 className="text-xl font-semibold mb-4 text-white">{TEXT.uploadedImage}</h2>
                        <ImagePreview imageUrl={imageUrl} onRemove={() => handleNewSearch()} />
                        <button
                            onClick={handleNewSearch}
                            className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                        >
                            {TEXT.newSearchButton}
                        </button>
                    </div>
                </div>

                {/* Right column - Products */}
                <div className="md:col-span-2">
                    <ProductList products={products} />
                    
                    {/* No products found message */}
                    {products.length === 0 && (
                        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 text-center">
                            <p className="text-gray-400 mb-4">{TEXT.noProductsFound}</p>
                            <button
                                onClick={handleNewSearch}
                                className="bg-[#30B3A4] hover:bg-[#2a9d8f] text-white py-2 px-4 rounded-md transition-colors"
                            >
                                {TEXT.tryAnotherImage}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;