import { RankingResult, AmazonProduct } from '../../../lib/types';
import { Card } from '../../../components/ui';

interface RankingResultsProps {
    rankings: RankingResult[];
    products: AmazonProduct[];
    isRanking: boolean;
    onProductSelect: (product: AmazonProduct, index: number) => void;
}

export const RankingResults = ({ rankings, products, isRanking, onProductSelect }: RankingResultsProps) => {
    if (!isRanking && rankings.length === 0) {
        return null;
    }

    const rankedProducts = rankings
        .map(ranking => {
            // The ranking ID from the backend corresponds to the product's `id`
            const product = products.find(p => p.id === ranking.id);
            return product ? { ...product, ...ranking } : null;
        })
        .filter((p): p is (AmazonProduct & RankingResult) => p !== null)
        .sort((a, b) => a.rank - b.rank);

    const handleProductClick = (product: AmazonProduct) => {
        // Find the original index of the clicked product in the full list
        const originalIndex = products.findIndex(p => p.id === product.id);
        if (originalIndex !== -1) {
            onProductSelect(product, originalIndex);
        }
    };

    return (
        <Card className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Deep Search Results</h2>
            {isRanking && rankedProducts.length === 0 && (
                <div className="text-center text-gray-400">Ranking products...</div>
            )}
            <div className="space-y-2">
                {rankedProducts.map(item => (
                    <div
                        key={item.id}
                        className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                        onClick={() => handleProductClick(item)}
                    >
                        <div className="text-2xl font-bold text-gray-400 w-8 text-center">{item.rank}</div>
                        <img
                            src={item.thumbnailUrl}
                            alt={item.id}
                            className="w-16 h-16 rounded-md object-cover bg-white"
                        />
                        <div className="flex-1">
                            <div className="text-sm text-white font-semibold">Similarity: {item.similarityScore.toFixed(0)}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};