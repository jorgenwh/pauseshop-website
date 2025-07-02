/**
 * ProductDisplay component that shows the selected product details
 * with thumbnail and product information
 */
import { AmazonProduct, Product } from '../../../lib/types';
import { Card } from '../../../components/ui';
import { AMAZON_AFFILIATE_TAG } from '../../../lib/constants';

interface ProductDisplayProps {
    product?: Product;
    amazonProduct: AmazonProduct;
}

const ProductDisplay = ({ product, amazonProduct }: ProductDisplayProps) => {
    return (
        <Card className="flex flex-col lg:flex-row gap-6 p-6 mb-2">
            {/* Product Thumbnail */}
            <div className="flex-shrink-0 lg:w-96">
                <div className="relative overflow-hidden rounded-lg bg-white aspect-square group">
                    <img
                        src={amazonProduct.thumbnailUrl}
                        alt={product?.name || 'Product'}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {product?.name || 'Product Details'}
                        </h2>
                        {product?.brand && !['unknown', 'other'].includes(product.brand.toLowerCase()) && (
                            <p className="text-gray-300 text-lg">{product.brand}</p>
                        )}
                    </div>

                    {product && (
                        <div className="space-y-3 text-sm">
                            {product.category && !['unknown', 'other'].includes(product.category.toLowerCase()) && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Category:</span>
                                    <span className="text-white capitalize">{product.category.replace('_', ' ')}</span>
                                </div>
                            )}
                            {product.targetGender && !['unknown', 'other'].includes(product.targetGender.toLowerCase()) && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Target:</span>
                                    <span className="text-white capitalize">{product.targetGender}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Confidence:</span>
                                <span className="text-white">{Math.round(product.confidence * 10)}%</span>
                            </div>
                            {product.secondaryColors.filter(color => !['unknown', 'other'].includes(color.toLowerCase())).length > 0 && (
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-400">Secondary Colors:</span>
                                    <div className="flex flex-wrap gap-1 justify-end max-w-xs">
                                        {product.secondaryColors
                                            .filter(color => !['unknown', 'other'].includes(color.toLowerCase()))
                                            .map((color, index) => (
                                                <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded text-xs capitalize">
                                                    {color}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {product?.features && product.features.filter(feature => !['unknown', 'other'].includes(feature.toLowerCase())).length > 0 && (
                        <div>
                            <span className="text-gray-400 text-sm">Features:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {product.features
                                    .filter(feature => !['unknown', 'other'].includes(feature.toLowerCase()))
                                    .map((feature, index) => (
                                        <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                                            {feature}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {amazonProduct.productUrl && (
                    <div className="lg:mt-auto lg:pt-4">
                        <a
                            href={`${amazonProduct.productUrl}?tag=${AMAZON_AFFILIATE_TAG}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base max-w-xs leading-tight"
                        >
                            <span className="flex-1 text-center">Check price on Amazon</span>
                            <svg className="ml-2 w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ProductDisplay;