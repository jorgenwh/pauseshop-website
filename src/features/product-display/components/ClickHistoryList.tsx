import { ExtensionClickHistoryEntry } from '../../../lib/types';
import { Card } from '../../../components/ui';

interface ClickHistoryListProps {
    history: ExtensionClickHistoryEntry[];
}

const ClickHistoryList = ({ history }: ClickHistoryListProps) => {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <Card className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Recently Viewed</h2>
            <div className="scrollable-list max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                    <a
                        key={`${item.pauseId}-${index}`}
                        href={`/referrer?extensionId=fcegkghmhhbgegalihmbpfchcmflaadd&pauseId=${item.pauseId}&asin=${item.clickedProduct.amazonAsin}`}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                        <img
                            src={item.clickedProduct.thumbnailUrl}
                            alt={item.productGroup.product.name}
                            className="w-16 h-16 rounded-md object-cover mr-4"
                        />
                        <div className="flex-1">
                            <p className="text-white font-semibold">{item.productGroup.product.name}</p>
                            <p className="text-gray-400 text-sm">Viewed in a recent pause</p>
                        </div>
                    </a>
                ))}
            </div>
        </Card>
    );
};

export default ClickHistoryList;