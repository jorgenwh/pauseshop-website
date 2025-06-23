/**
 * Results page component
 * Displays the uploaded image and product results
 */

import { useEffect } from 'react';
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

    // If there's no image, redirect back to the upload page
    useEffect(() => {
        if (!imageUrl) {
            navigate('/');
        }
    }, [imageUrl, navigate]);

    const handleNewSearch = () => {
        onReset();
        navigate('/');
    };

    if (!imageUrl) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-4xl font-bold mb-2 text-center">
                <span className="text-white">Pause</span>
                <span className="text-[#30B3A4]">Shop</span>
            </h1>
            <p className="text-center text-gray-400 mb-8 max-w-lg mx-auto">
                {TEXT.resultsDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column - Image */}
                <div className="md:col-span-1">
                    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
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
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;