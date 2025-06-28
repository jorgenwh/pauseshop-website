/**
 * Component for filtering products by category
 */
import { useMemo } from 'react';
import { Product, Category } from '../../../lib/types';
import { TEXT } from '../../../lib/constants';
import { Button, Icon } from '../../../components/ui';

interface ProductFiltersProps {
    products: Product[];
    selectedCategories: Set<Category>;
    onToggleCategory: (category: Category) => void;
    onClearFilters: () => void;
}

const ProductFilters = ({ 
    products, 
    selectedCategories, 
    onToggleCategory, 
    onClearFilters 
}: ProductFiltersProps) => {
    // Get unique categories from products
    const availableCategories = useMemo(() => {
        const categories = new Set(products.map(product => product.category));
        return Array.from(categories).sort();
    }, [products]);

    // Calculate filtered product count
    const filteredProductCount = useMemo(() => {
        if (selectedCategories.size === 0) {
            return products.length;
        }
        return products.filter(product => selectedCategories.has(product.category)).length;
    }, [products, selectedCategories]);

    // Format category name for display
    const formatCategoryName = (category: Category) => {
        return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-center mb-4">
                    <p className="text-lg text-white">
                        <span className="font-bold text-[#30B3A4]">
                            {filteredProductCount}
                        </span> {TEXT.productsFoundSummary(filteredProductCount)}
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
                                <Button
                                    onClick={onClearFilters}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs underline"
                                >
                                    <Icon name="clear" size={12} className="mr-1" />
                                    Clear filters
                                </Button>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {availableCategories.map((category) => {
                                const isSelected = selectedCategories.has(category);
                                const productCount = products.filter(p => p.category === category).length;
                                
                                return (
                                    <button
                                        key={category}
                                        onClick={() => onToggleCategory(category)}
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
    );
};

export default ProductFilters;
