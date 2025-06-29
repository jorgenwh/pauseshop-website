import { RankingResult, AmazonProduct } from '../../../lib/types';
import { Card } from '../../../components/ui';

interface RankingResultsProps {
  rankings: RankingResult[];
  products: AmazonProduct[];
  isRanking: boolean;
}

export const RankingResults = ({ rankings, products, isRanking }: RankingResultsProps) => {
  if (!isRanking && rankings.length === 0) {
    return null;
  }

  const rankedProducts = rankings
    .map(ranking => {
      const product = products.find(p => p.id === ranking.id);
      return product ? { ...product, ...ranking } : null;
    })
    .filter((p): p is (AmazonProduct & RankingResult) => p !== null)
    .sort((a, b) => a.rank - b.rank);

  return (
    <Card className="mt-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Deep Search Results</h2>
      {isRanking && rankedProducts.length === 0 && (
        <div className="text-center text-gray-400">Ranking products...</div>
      )}
      <div className="space-y-4">
        {rankedProducts.map(item => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-gray-400 w-8">{item.rank}</div>
            <img
              src={item.thumbnailUrl}
              alt={item.id}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div className="flex-1">
              <div className="text-sm text-white">Similarity: {item.similarityScore.toFixed(0)}%</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};