/**
 * Results page component
 * Displays the uploaded image and product results
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePreview } from '../features/image-upload';
import { ProductList, ProductFilters } from '../features/product-display';
import { Product, Category } from '../lib/types';
import { TEXT } from '../lib/constants';

interface ResultsPageProps {
    imageUrl: string | null;
    products: Product[];
    onReset: () => void;
}

const ResultsPage = ({ imageUrl, products, onReset }: ResultsPageProps) => {
    const navigate = useNavigate();
    const [animateIn, setAnimateIn] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());

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

    // Filter products based on selected categories
    const filteredProducts = useMemo(() => {
        if (selectedCategories.size === 0) {
            return products;
        }
        return products.filter(product => selectedCategories.has(product.category));
    }, [products, selectedCategories]);

    // Toggle category selection
    const toggleCategory = (category: Category) => {
        const newSelected = new Set(selectedCategories);
        if (newSelected.has(category)) {
            newSelected.delete(category);
        } else {
            newSelected.add(category);
        }
        setSelectedCategories(newSelected);
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategories(new Set());
    };

    return (
        <div className={`container mx-auto px-4 py-8 max-w-5xl transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-4xl font-bold mb-2 text-center">
                <span className="text-white">Pause</span>
                <span className="text-[#30B3A4]">Shop</span>
            </h1>
            <p className="text-center text-gray-400 mb-8 max-w-lg mx-auto">
                {TEXT.resultsDescription}
            </p>
            
            {/* Product Filters */}
            <ProductFilters
                products={products}
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearFilters={clearFilters}
            />

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
                    {filteredProducts.length > 0 ? (
                        <ProductList products={filteredProducts} />
                    ) : (
                        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 text-center">
                            {products.length === 0 ? (
                                <>
                                    <p className="text-gray-400 mb-4">{TEXT.noProductsFound}</p>
                                    <button
                                        onClick={handleNewSearch}
                                        className="bg-[#30B3A4] hover:bg-[#2a9d8f] text-white py-2 px-4 rounded-md transition-colors"
                                    >
                                        {TEXT.tryAnotherImage}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-400 mb-2">No products found for the selected categories.</p>
                                    <button
                                        onClick={clearFilters}
                                        className="bg-[#30B3A4] hover:bg-[#2a9d8f] text-white py-2 px-4 rounded-md transition-colors"
                                    >
                                        Clear filters to see all products
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;