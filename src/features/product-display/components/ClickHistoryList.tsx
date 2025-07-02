import { ExtensionClickHistoryEntry } from '../../../lib/types';
import { Card } from '../../../components/ui';

interface ClickHistoryListProps {
    history: ExtensionClickHistoryEntry[];
    onHistoryItemClick: (item: ExtensionClickHistoryEntry) => void;
}

const ClickHistoryList = ({ history, onHistoryItemClick }: ClickHistoryListProps) => {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <Card className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-white">Recently Viewed</h2>
            <div className="scrollable-list max-h-96 overflow-y-auto scrollbar-styled">
                {[...history].reverse().map((item, index) => (
                    <div
                        key={`${item.pauseId}-${index}`}
                        onClick={() => onHistoryItemClick(item)}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    >
                        <p className="text-white font-semibold truncate">{item.productGroup.product.name}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default ClickHistoryList;