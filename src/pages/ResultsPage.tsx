/**
 * Results page component
 * Displays the uploaded image and product results
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePreview } from '../features/image-upload';
import { ProductList } from '../features/product-display';
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
    
    // Count products by category for summary
    const categoryCount = products.reduce((acc, product) => {
        const category = product.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get unique categories from products
    const availableCategories = useMemo(() => {
        const categories = new Set(products.map(product => product.category));
        return Array.from(categories).sort();
    }, [products]);

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

    // Format category name for display
    const formatCategoryName = (category: Category) => {
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
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
            
            {/* Results summary with category filters */}
            <div className="mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-center mb-4">
                        <p className="text-lg text-white">
                            <span className="font-bold text-[#30B3A4]">
                                {selectedCategories.size === 0 ? products.length : filteredProducts.length}
                            </span> {TEXT.productsFoundSummary(selectedCategories.size === 0 ? products.length : filteredProducts.length)}
                            {selectedCategories.size > 0 && (
                                <span className="text-gray-400 text-sm ml-2">
                                    (filtered from {products.length} total)
                                </span>
                            )}
                        </p>
                    </div>
                    
                    {/* Category Filter Buttons */}
                    {availableCategories.length > 1 && (
                        <div>
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <span className="text-sm text-gray-400">Filter by category:</span>
                                {selectedCategories.size > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-[#30B3A4] hover:text-[#30B3A4]/80 underline flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear filters
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                {availableCategories.map((category) => {
                                    const isSelected = selectedCategories.has(category);
                                    const productCount = products.filter(p => p.category === category).length;
                                    
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => toggleCategory(category)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                                                isSelected
                                                    ? 'bg-[#30B3A4] text-white border-[#30B3A4] shadow-md transform scale-105'
                                                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:text-white'
                                            }`}
                                        >
                                            {formatCategoryName(category)} ({productCount})
                                        </button>
                                    );
                                })}
                            </div>
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