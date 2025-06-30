/**
 * Results page component
 * Displays the uploaded image and product results
 */

import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePreview } from '../features/image-upload';
import { ProductList, ProductFilters } from '../features/product-display';
import { AppHeader, Card, Button, EmptyState } from '../components/ui';
import AmazonAssociateDisclaimer from '../components/ui/AmazonAssociateDisclaimer';
import { Product, Category } from '../lib/types';
import { TEXT } from '../lib/constants';
import { Seo } from '../components/Seo';

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

    // Filter products based on selected categories
    const filteredProducts = useMemo(() => {
        if (selectedCategories.size === 0) {
            return products;
        }
        return products.filter(product => selectedCategories.has(product.category));
    }, [products, selectedCategories]);

    const handleNewSearch = () => {
        onReset();
        navigate('/');
    };
    if (!imageUrl) {
        return null;
    }

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
            <Seo
                title="Search Results"
                description={`Found ${products.length} similar products for your uploaded image. Browse and compare items from top retailers.`}
                canonical="/results"
                robots="index, follow"
            />
            <AppHeader subtitle={TEXT.resultsDescription} className="mb-8" />

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
                    <Card className="sticky top-4">
                        <h2 className="text-xl font-semibold mb-4 text-white">{TEXT.uploadedImage}</h2>
                        <ImagePreview imageUrl={imageUrl} />
                        <Button
                            onClick={handleNewSearch}
                            variant="secondary"
                            fullWidth
                            className="mt-4"
                        >
                            {TEXT.newSearchButton}
                        </Button>
                    </Card>
                </div>

                {/* Right column - Products */}
                <div className="md:col-span-2">
                    {filteredProducts.length > 0 ? (
                        <>
                            <ProductList products={filteredProducts} />
                            <div className="mt-2">
                                <AmazonAssociateDisclaimer />
                            </div>
                        </>
                    ) : (
                        <Card>
                            {products.length === 0 ? (
                                <EmptyState
                                    title={TEXT.noProductsFound}
                                    action={{
                                        label: TEXT.tryAnotherImage,
                                        onClick: handleNewSearch
                                    }}
                                />
                            ) : (
                                <EmptyState
                                    title="No products found for the selected categories."
                                    action={{
                                        label: "Clear filters to see all products",
                                        onClick: clearFilters
                                    }}
                                />
                            )}
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
